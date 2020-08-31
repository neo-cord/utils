/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import { Timers } from "./Timers";

export class Bucket {
  /**
   * How many tokens the bucket has consumed in this interval.
   */
  public tokens: number;

  /**
   * Timestamp of last token cleaning.
   */
  public lastReset: number;

  /**
   * Timestamp of last token consumption.
   */
  public lastSend: number;

  /**
   * The max number tokens the bucket can consume per interval.
   */
  public tokenLimit: number;

  /**
   * How long (in ms) to wait between clearing used tokens.`
   */
  public interval: number;

  /**
   * A latency reference object.
   */
  public latencyRef: BucketLatencyRef;

  /**
   * The number of reserved tokens.
   */
  public reservedTokens: number;

  /**
   * A rate-limit timeout.
   */
  private timeout?: NodeJS.Timeout;

  /**
   * The queue.
   */
  private readonly _queue: Queued[];

  /**
   * @param tokenLimit
   * @param interval
   * @param options
   */
  public constructor(tokenLimit: number, interval: number, options: BucketOptions = {}) {
    this.tokenLimit = tokenLimit;
    this.interval = interval;
    this.lastReset = this.tokens = this.lastSend = 0;

    this.latencyRef = options.latencyRef || { latency: 0 };
    this.reservedTokens = options.reservedTokens || 0;
    this._queue = [];
  }

  /**
   * Queue something in the Bucket
   * @param func A callback to call when a token can be consumed
   * @param priority Whether or not the callback should use reserved tokens
   * @since 1.0.0
   */
  public queue(func: CallableFunction, priority = false): void {
    priority
      ? this._queue.unshift({ func, priority })
      : this._queue.push({ func, priority });

    this.check();
  }

  /**
   * Check the bucket.
   * @since 1.0.0
   */
  private check() {
    if (this.timeout || this._queue.length === 0) return;
    if (this.lastReset + this.interval + this.tokenLimit * this.latencyRef.latency < Date.now()) {
      this.lastReset = Date.now();
      this.tokens = Math.max(0, this.tokens - this.tokenLimit);
    }

    let val;
    let tokensAvailable = this.tokens < this.tokenLimit;
    let unreservedTokensAvailable = this.tokens < (this.tokenLimit - this.reservedTokens);

    while (this._queue.length > 0 && (unreservedTokensAvailable || (tokensAvailable && this._queue[0].priority))) {
      this.tokens++;

      tokensAvailable = this.tokens < this.tokenLimit;
      unreservedTokensAvailable = this.tokens < (this.tokenLimit - this.reservedTokens);

      const item = this._queue.shift();
      val = this.latencyRef.latency - Date.now() + this.lastSend;

      if (this.latencyRef.latency === 0 || val <= 0) {
        item?.func();
        this.lastSend = Date.now();
      } else {
        Timers.setTimeout(() => item?.func(), val);
        this.lastSend = Date.now() + val;
      }
    }

    if (this._queue.length > 0 && !this.timeout) {
      this.timeout = Timers.setTimeout(() => {
        delete this.timeout;
        this.check();
      }, this.tokens < this.tokenLimit ? this.latencyRef.latency : Math.max(0, this.lastReset + this.interval + this.tokenLimit * this.latencyRef.latency - Date.now()));
    }
  }
}

interface Queued {
  func: CallableFunction;
  priority: boolean
}

interface BucketOptions extends Record<string, any> {
  reservedTokens?: number;
  latencyRef?: BucketLatencyRef;
}

interface BucketLatencyRef {
  offset?: number;
  latency: number;
}