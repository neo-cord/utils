/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import { Type } from "../utility/Type";

export class Pair<A, B> {
  /**
   * Whether this pair is immutable.
   * @type {boolean}
   * @private
   */
  #immutable: boolean;

  /**
   * The first value of this pair.
   * @private
   */
  #a: A | null;

  /**
   * The second value of this pair.
   * @private
   */
  #b: B | null;

  /**
   * @param {*} a The first value of this pair.
   * @param {*} b The second value of this pair.
   */
  public constructor(a?: A, b?: B) {
    this.#a = a ?? null;
    this.#b = b ?? null;
    this.#immutable = false;
  }

  /**
   * The first value of this pair.
   */
  public get a(): A | null {
    return this.#a;
  }

  /**
   * The second value of this pair.
   */
  public get b(): B | null {
    return this.#b;
  }

  /**
   * Creates an immutable pair of values.
   * @param a
   * @param b
   * @constructor
   */
  public static Immutable<A, B>(a: A, b: B): Pair<A, B> {
    const pair = new Pair(a, b);
    pair.#immutable = true;
    return pair;
  }

  /**
   * Set the first value of this pair.
   * @param {*} value The value.
   * @returns {Pair} this pair.
   */
  public setA(value: A): this {
    if (this.#immutable) return this;
    this.#a = value;
    return this;
  }

  /**
   * Set the second value of this pair.
   * @param {*} value The value.
   * @returns {Pair} this pair.
   */
  public setB(value: B): this {
    if (this.#immutable) return this;
    this.#b = value;
    return this;
  }

  /**
   * Get the string representation of this pair.
   */
  public toString(): string {
    return `Pair<${new Type(this.#a)}, ${new Type(this.#b)}>`;
  }
}
