/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import { define } from "../functions";

export class Emitter {
  /**
   * Event listeners attached to this emitter.
   * @type {Dictionary<Set<Listener>>}
   * @private
   */
  private readonly _listeners!: Dictionary<Set<Listener>>;

  /**
   * Creates a new instanceof Emitter.
   */
  public constructor() {
    define({
      value: {},
    })(this, "_listeners");
  }

  /**
   * Adds a listener to this emitter.
   * @param {string} event The event to listen for.
   * @param {Listener} listener The event listener.
   */
  public on(event: string, listener: Listener): this {
    if (!this._listeners[event]) {
      this._listeners[event] = new Set();
    }

    this._listeners[event].add(listener);
    return this;
  }

  /**
   * Adds a listener to this emitter then removes it when an event is dispatched.
   * @param {string} event The event to listen for.
   * @param {Listener} listener The event listener.
   */
  public once(event: string, listener: Listener): this {
    const _listener = (...args: any[]) => {
      listener.call(this, args);
      this.removeListener(event, _listener);
    };

    return this.on(event, _listener);
  }

  /**
   * Removes a listener from an event.
   * @param {string} event The event to remove the listener from.
   * @param {Listener} listener The listener to remove.
   */
  public removeListener(event: string, listener: Listener): boolean {
    if (!(event in this._listeners) || !this._listeners[event].has(listener)) {
      return false;
    }

    void this._listeners[event].delete(listener);
    if (!this.listenerCount(event)) {
      delete this._listeners[event];
    }

    return true;
  }

  /**
   * Dispatch an event.
   * @param {string} event The event to dispatch.
   * @param {...*} [args] The arguments to provide.
   */
  public emit(event: string, ...args: any[]): number {
    if (!this.listenerCount(event)) {
      return 0;
    }

    let count = 0;
    for (const listener of this._listeners[event]) {
      try {
        listener(...args);
        count++;
      } catch (e) {
        void e;
        // no-op
      }
    }

    return count;
  }

  /**
   * Get the total listener count of this emitter or of a single event.
   * @param {string} [event] The event.
   * @returns {number} The amount of listeners for the event or all listeners..
   */
  public listenerCount(event?: string): number {
    if (event) {
      return this._listeners[event] ? this._listeners[event].size : 0;
    }

    let count = 0;
    for (const l of Object.values(this._listeners)) {
      count += l.size;
    }

    return count;
  }
}

export type Listener = (...args: any[]) => unknown;
