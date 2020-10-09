/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

const INTERVALS = Symbol.for("TimerIntervals");
const TIMEOUTS = Symbol.for("TimerTimeouts");

export abstract class Timers {
  /**
   * Currently running intervals.
   *
   * @type {Set<NodeJS.Timeout>}
   * @private
   */
  private static readonly [INTERVALS]: Set<NodeJS.Timeout> = new Set();

  /**
   * Currently waiting timeouts.
   *
   * @type {Set<NodeJS.Timeout>}
   * @private
   */
  private static readonly [TIMEOUTS]: Set<NodeJS.Timeout> = new Set();

  /**
   * Clears all of the current intervals and timeouts.
   */
  public static clear(): void {
    for (const i of this[INTERVALS]) void this.clearInterval(i);
    for (const i of this[TIMEOUTS]) void this.clearTimeout(i);
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
    void this[INTERVALS].add(interval);
    return interval;
  }

  /**
   * Clears an interval.
   * @param {NodeJS.Timeout} interval The interval to clear.
   */
  public static clearInterval(interval: NodeJS.Timeout): typeof Timers {
    void this[INTERVALS].delete(interval);
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
      void this[TIMEOUTS].delete(timeout);
      void fn(...args);
    }, delay);

    void this[TIMEOUTS].add(timeout);
    return timeout;
  }

  /**
   * Clears an interval.
   * @param {NodeJS.Timeout} interval The interval to clear.
   */
  public static clearTimeout(interval: NodeJS.Timeout): typeof Timers {
    void this[TIMEOUTS].delete(interval);
    void clearTimeout(interval);
    return Timers;
  }
}

type Fn = (...args: any[]) => any;
