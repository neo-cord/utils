/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

export class AsyncQueue {
  /**
   * The promises in this queue.
   *
   * @type {DeferredPromise[]}
   * @private
   */
  private readonly promises: DeferredPromise[] = [];

  /**
   * The remaining promises that are in the queue.
   *
   * @type {number}
   */
  public get remaining(): number {
    return this.promises.length;
  }

  /**
   * Waits for the last promise to resolve and queues a new one.
   *
   * @returns {Promise<void>}
   */
  public wait(): Promise<void> {
    const next = this.promises.length
      ? this.promises[this.promises.length - 1].promise
      : Promise.resolve();

    this.enqueue();
    return next;
  }

  /**
   * Enqueues a new promise.
   *
   * @returns {Promise<void>}
   */
  public enqueue(): void {
    let resolve!: (value: void) => void;
    const promise = new Promise<void>((res) => {
      resolve = res;
    });

    this.promises.push({ promise, resolve });
  }

  /**
   * Frees the queue's lock so the next promise can resolve.
   *
   * @returns {void}
   */
  public next(): void {
    const next = this.promises.shift();
    if (typeof next !== "undefined") next.resolve();
  }
}

interface DeferredPromise {
  promise: Promise<void>;

  resolve(value: void): void;
}
