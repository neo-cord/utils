/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

export abstract class Timers {
  /**
   * Currently running intervals.
   * @type {Set<NodeJS.Timeout>}
   * @private
   */
  private static readonly _intervals: Set<NodeJS.Timeout> = new Set();

  /**
   * Currently waiting timeouts.
   * @type {Set<NodeJS.Timeout>}
   * @private
   */
  private static readonly _timeouts: Set<NodeJS.Timeout> = new Set();

  /**
   * Clears all of the current intervals and timeouts.
   */
  public static clear(): void {
    for (const i of this._intervals) void this.clearInterval(i);
    for (const i of this._timeouts) void this.clearTimeout(i);
  }

  /**
   * Set an interval.
   * @param {Fn} fn The function to call.
   * @param {number} delay The delay between each call.
   * @param {...any} [args] The args to pass.
   */
  public static setInterval(
    fn: Fn,
    delay: number,
    ...args: any[]
  ): NodeJS.Timeout {
    const interval = setInterval(fn, delay, ...args);
    void this._intervals.add(interval);
    return interval;
  }

  /**
   * Clears an interval.
   * @param {NodeJS.Timeout} interval The interval to clear.
   */
  public static clearInterval(interval: NodeJS.Timeout): typeof Timers {
    void this._intervals.delete(interval);
    void clearInterval(interval);
    return Timers;
  }

  /**
   * Set an interval.
   * @param {Fn} fn The function to call.
   * @param {number} delay The delay between each call.
   * @param {...any} args The args to pass.
   */
  public static setTimeout(
    fn: Fn,
    delay: number,
    ...args: any[]
  ): NodeJS.Timeout {
    const timeout = setTimeout(() => {
      void this._timeouts.delete(timeout);
      void fn(...args);
    }, delay);

    void this._timeouts.add(timeout);
    return timeout;
  }

  /**
   * Clears an interval.
   * @param {NodeJS.Timeout} interval The interval to clear.
   */
  public static clearTimeout(interval: NodeJS.Timeout): typeof Timers {
    void this._timeouts.delete(interval);
    void clearTimeout(interval);
    return Timers;
  }
}

type Fn = (...args: any[]) => any;
