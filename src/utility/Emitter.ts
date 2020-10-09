/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

const LISTENERS = Symbol.for("EmitterListeners");

export class Emitter implements EventEmitterLike {
  /**
   * Event listeners attached to this emitter.
   *
   * @type {Dictionary<Set<Listener>>}
   * @private
   */
  private readonly [LISTENERS]!: Record<string | symbol, Set<Listener>>;

  /**
   * Creates a new instanceof Emitter.
   */
  public constructor() {
    Object.defineProperty(this, LISTENERS, {
      value: {},
    });
  }

  /**
   * Adds a listener to this emitter.
   *
   * @param {string} event The event to listen for.
   * @param {Listener} listener The event listener.
   * @returns {Emitter}
   */
  public on(event: string | symbol, listener: Listener): this {
    return this.addListener(event, listener);
  }

  /**
   * Adds a listener to this emitter then removes it when an event is dispatched.
   *
   * @param {string} event The event to listen for.
   * @param {Listener} listener The event listener.
   * @returns {Emitter}
   */
  public once(event: string | symbol, listener: Listener): this {
    const _listener = (...args: any[]) => {
      listener.call(this, args);
      this.removeListener(event, _listener);
    };

    return this.on(event, _listener);
  }

  /**
   * Adds a listener to this emitter.
   *
   * @param {string} event The event to listen for.
   * @param {Listener} listener The event listener.
   * @returns {Emitter}
   */
  public addListener(event: string | symbol, listener: Listener): this {
    event = event.toString();
    if (!this[LISTENERS][event]) {
      this[LISTENERS][event] = new Set();
    }

    this[LISTENERS][event].add(listener);
    return this;
  }

  /**
   * Removes a listener from an event.
   *
   * @param {string} event The event to remove the listener from.
   * @param {Listener} listener The listener to remove.
   * @returns {boolean}
   */
  public removeListener(event: string | symbol, listener: Listener): boolean {
    event = event.toString();
    if (!(event in this[LISTENERS]) || !this[LISTENERS][event].has(listener)) {
      return false;
    }

    void this[LISTENERS][event].delete(listener);
    if (!this.listenerCount(event)) {
      delete this[LISTENERS][event];
    }

    return true;
  }

  /**
   * Dispatch an event.
   *
   * @param {string} event The event to dispatch.
   * @param {...any} [args] The arguments to provide.
   * @returns {number} The number of listeners that were successful
   */
  public emit(event: string | symbol, ...args: any[]): number {
    if (!this.listenerCount(event)) {
      return 0;
    }

    let count = 0;
    for (const listener of this[LISTENERS][event.toString()]) {
      try {
        listener(...args);
        count++;
      } catch (e) {
        if (event === "error") {
          throw new Error(e);
        }

        this.emit("error", e);
      }
    }

    return count;
  }

  /**
   * Get the total listener count of this emitter or of a single event.
   *
   * @param {string} [event] The event.
   * @returns {number} The amount of listeners for the event or all listeners.
   */
  public listenerCount(event?: string | symbol): number {
    if (event) {
      event = event.toString();
      return this[LISTENERS][event] ? this[LISTENERS][event].size : 0;
    }

    let count = 0;
    for (const l of Object.values(this[LISTENERS])) {
      count += l.size;
    }

    return count;
  }
}

export type Listener = (...args: any[]) => unknown;
