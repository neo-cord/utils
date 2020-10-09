/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import { Type } from "..";

export class List<V> extends Set<V> {
  public ["constructor"]: typeof List;

  /**
   * The first item in this list.
   *
   * @type {?any}
   */
  public get first(): V | null {
    return this.size ? [...this][0] : null;
  }

  /**
   * The last item in this list.
   *
   * @type {?any}
   */
  public get last(): V | null {
    return this.size ? [...this][this.size - 1] : null;
  }

  /**
   * The array representation of this list.
   *
   * @returns {Array}
   */
  public array(): V[] {
    return [...this];
  }

  /**
   * Maps each element in this list.
   *
   * @param {Map} callbackFn The callback function.
   * @param {any} [thisArg] Optional binding for the callback.
   * @returns {any[]}
   */
  public map<U>(callbackFn: Map<V, U>, thisArg?: unknown): U[] {
    return this.array().map((v, i) => callbackFn(v, i, this), thisArg);
  }

  /**
   * Check whether a value exists in this list.
   *
   * @param {Predicate} predicate The predicate.
   * @param {any} [thisArg] Optional binding for the predicate.
   * @returns {boolean} true if the predicate returns true
   */
  public exists(predicate: Predicate<V, boolean>, thisArg?: unknown): boolean {
    if (thisArg) predicate = predicate.bind(thisArg);

    let i = 0;
    for (const el of this) {
      if (predicate(el, i, this)) return true;
      i++;
    }

    return false;
  }

  /**
   * Filters items that pass the predicate into a new list.
   *
   * @param {Filter} predicate The filter predicate.
   * @param {any} [thisArg] Optional binding for the predicate.
   */
  public filter(predicate: Filter<V>, thisArg?: unknown): List<V> {
    const filtered = this.array().filter(
      (v, i) => predicate(v, i, this),
      thisArg
    );

    return new this.constructor(filtered);
  }

  /**
   * Finds a value in this list using the predicate.
   *
   * @param {Predicate} predicate The predicate.
   * @param {any} [thisArg] Optional binding for the predicate.
   */
  public find(predicate: Predicate<V>, thisArg?: unknown): V | null {
    return this.array().find((v, i) => predicate(v, i, this), thisArg) ?? null;
  }

  /**
   * Determines whether the specified callback function returns true for any element of an array.
   *
   * @param {Predicate} predicate The predicate.
   * @param {any} [thisArg] Optional binding for the predicate.
   */
  public some(predicate: Predicate<V>, thisArg?: unknown): boolean {
    return this.array().some((v, i) => predicate(v, i, this), thisArg);
  }

  /**
   * Reduces this list into a single value.
   *
   * @param {Reducer} reducer The reducer function.
   * @param {any} acc The accumulator.
   * @param {any} [thisArg] Optional binding for the reducer function.
   * @returns {any}
   */
  public reduce<A>(reducer: Reducer<A, V>, acc: A, thisArg?: unknown): A {
    if (thisArg) reducer = reducer.bind(thisArg);

    let index = 0,
      first = acc;
    for (const el of this) {
      first = reducer(first, el, index, this);
      index++;
    }

    return first;
  }

  /**
   * Clones this list.
   *
   * @returns {List}
   */
  public clone(): List<V> {
    return new this.constructor<V>([...this]);
  }

  /**
   * Get the string representation of this collection.
   *
   * @returns {string}
   */
  public toString(): string {
    if (this.size) {
      const v = this.first;
      return `${this.constructor.name}<${new Type(v)}>`;
    }

    return "${this.constructor.name}<any>";
  }
}

type Reducer<A, V> = (acc: A, value: V, index: number, list: List<V>) => A;
type Predicate<V, R = unknown> = (value: V, index: number, list: List<V>) => R;
type Filter<V> = Predicate<V, boolean>;
type Map<V, R> = Predicate<V, R>;
