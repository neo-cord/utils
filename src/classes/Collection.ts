/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

export class Collection<K, V> extends Map<K, V> {
  public ["constructor"]: typeof Collection;

  /**
   * The first item in this collection.
   */
  public get first(): V | null {
    return this.size
      ? this.values().next().value
      : null;
  }

  /**
   * The last item in this collection.
   */
  public get last(): V | null {
    return this.size
      ? [ ...this.values() ][this.size - 1]
      : null;
  }

  /**
   * Get an array of all values in this collection.
   */
  public array(): Array<V> {
    const arr = [];
    for (const v of this.values()) arr.push(v);
    return arr;
  }

  /**
   * Tests whether or not an entry in this collection meets the provided predicate.
   * @param predicate A predicate that tests all entries.
   * @param thisArg An optional binding for the predicate function.
   */
  public some(predicate: (value: V, key: K, col: this) => unknown, thisArg?: unknown): boolean {
    if (thisArg) predicate = predicate.bind(thisArg);
    for (const [ k, v ] of this) if (predicate(v, k, this)) return true;
    return false;
  }

  /**
   * Collection#forEach but it returns the collection instead of nothing.
   * @param fn The function to be ran on all entries.
   * @param thisArg An optional binding for the fn parameter.
   */
  public each(fn: (value: V, key: K, col: this) => unknown, thisArg?: unknown): this {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [ k, v ] of this) fn(v, k, this);
    return this;
  }

  /**
   * Sweeps entries from the collection.
   * @param fn
   * @param thisArg
   */
  public sweep(fn: (value: V, key: K, col: this) => boolean, thisArg?: unknown): number {
    if (thisArg) fn = fn.bind(thisArg);

    const oldSize = this.size;
    for (const [ k, v ] of this) {
      if (fn(v, k, this)) this.delete(k);
    }

    return oldSize - this.size;
  }

  /**
   * Finds a value using a predicate from this collection
   * @param fn Function used to find the value.
   * @param thisArg Optional binding to use.
   */
  public find(fn: (value: V, key: K, col: this) => boolean, thisArg?: unknown): V | null {
    if (thisArg) fn = fn.bind(this);
    for (const [ k, v ] of this) if (fn(v, k, this)) return v;
    return null;
  }

  /**
   * Reduces this collection down into a single value.
   * @param fn The function used to reduce this collection.
   * @param acc The accumulator.
   * @param thisArg Optional binding for the reducer function.
   */
  public reduce<A>(fn: (acc: A, value: V, key: K, col: this) => A, acc: A, thisArg?: unknown): A {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [ k, v ] of this) fn(acc, v, k, this);
    return acc;
  }

  /**
   * Returns a filtered collection based on the provided predicate.
   * @param fn The predicate used to determine whether or not an entry can be passed to the new collection.
   * @param thisArg Optional binding for the predicate.
   */
  public filter(fn: (value: V, key: K, col: this) => boolean, thisArg?: unknown): Collection<K, V> {
    if (thisArg) fn = fn.bind(thisArg);

    const col = new (this.constructor)[Symbol.species]();
    for (const [ k, v ] of this) {
      if (fn(v, k, this)) col.set(k, v);
    }

    return col as Collection<K, V>;
  }

  /**
   * Maps this collection into an array. Array#map equivalent.
   * @param fn Function used to map values to an array.
   * @param thisArg Optional binding for the map function.
   */
  public map<T>(fn: (value: V, key: K, col: this) => T, thisArg?: unknown): T[] {
    if (thisArg) fn = fn.bind(thisArg);

    const arr = [];
    for (const [ k, v ] of this) {
      const value = fn(v, k, this);
      arr.push(value);
    }

    return arr;
  }

  /**
   * Sorts the entries in-place in this collection.
   * @param compareFunction Function to determine how this collection should be sorted
   */
  public sort(compareFunction: (firstValue: V, secondValue: V, firstKey?: K, secondKey?: K) => number = (first, second): number => +(first > second) || +(first === second) - 1): this {
    const entries = [ ...this.entries() ]
      .sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));

    this.clear();
    for (const [ key, value ] of entries) {
      this.set(key, value);
    }

    return this;
  }

  /**
   * Sorts entries in a new collection
   * @param compareFunction Function to determine how the resulting collection should be sorted
   */
  public sorted(compareFunction: (firstValue: V, secondValue: V, firstKey?: K, secondKey?: K) => number = (first, second): number => +(first > second) || +(first === second) - 1): Collection<K, V> {
    const entries = [ ...this.entries() ]
      .sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));

    return new (this.constructor)(entries);
  }

  /**
   * Returns a clone of this collection.
   */
  public clone(): Collection<K, V> {
    return new (this.constructor)[Symbol.species](this.entries()) as Collection<K, V>;
  }
}

