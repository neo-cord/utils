/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import { define } from "../functions";

export class Emitter {
  /**
   * Event listeners attached to this emitter.
   * @private
   */
  @define({ writable: true, value: {} })
  private readonly _listeners!: Dictionary<Set<Listener>>;

  /**
   * Adds a listener to this dispatcher.
   * @param event The event to listen for.
   * @param listener The event listener.
   */
  public on(event: string, listener: Listener): this {
    if (!this._listeners[event]) {
      this._listeners[event] = new Set();
    }

    this._listeners[event].add(listener);
    return this;
  }

  /**
   * Adds a listener to this dispatcher then removes it when an event is dispatched.
   * @param event The event to listen for.
   * @param listener The event listener.
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
   * @param event The event to remove the listener from.
   * @param listener The listener to remove.
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
   * @param event The event to dispatch.
   * @param args The arguments to provide.
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
      } catch {
        // no-op
      }
    }

    return count;
  }

  /**
   * Get the total listener count of this dispatcher or of a single event.
   * @param event The event.
   */
  public listenerCount(event?: string): number {
    if (event) {
      return this._listeners[event]
        ? this._listeners[event].size
        : 0;
    }

    let count = 0;
    for (const l of Object.values(this._listeners)) {
      count += l.size;
    }

    return count;
  }
}

export type Listener = (...args: any[]) => unknown;
