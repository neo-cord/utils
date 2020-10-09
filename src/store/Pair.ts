/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import { Type } from "../utility/Type";

export class Pair<A, B> {
  /**
   * Whether this pair is immutable.
   *
   * @type {boolean}
   * @private
   */
  #immutable: boolean;

  /**
   * The first value of this pair.
   *
   * @type {?any}
   * @private
   */
  #a: A | null;

  /**
   * The second value of this pair.
   *
   * @type {?any}
   * @private
   */
  #b: B | null;

  /**
   * @param {?any} a The first value of this pair.
   * @param {?any} b The second value of this pair.
   */
  public constructor(a?: A, b?: B) {
    this.#a = a ?? null;
    this.#b = b ?? null;
    this.#immutable = false;
  }

  /**
   * The first value of this pair.
   *
   * @type {?any}
   */
  public get a(): A | null {
    return this.#a;
  }

  /**
   * The second value of this pair.
   *
   * @type {?any}
   */
  public get b(): B | null {
    return this.#b;
  }

  /**
   * Creates an immutable pair of values.
   *
   * @param {any} a Value A of the pair.
   * @param {any} b Value B of the pair.
   * @constructor
   */
  public static Immutable<A, B>(a: A, b: B): Pair<A, B> {
    const pair = new Pair(a, b);
    pair.#immutable = true;
    return pair;
  }

  /**
   * Set the first value of this pair.
   *
   * @param {any} value The value.
   * @returns {Pair} this pair.
   */
  public setA(value: A): this {
    if (this.#immutable) return this;
    this.#a = value;
    return this;
  }

  /**
   * Set the second value of this pair.
   *
   * @param {any} value The value.
   * @returns {Pair} this pair.
   */
  public setB(value: B): this {
    if (this.#immutable) return this;
    this.#b = value;
    return this;
  }

  /**
   * Get the string representation of this pair.
   *
   * @type {string}
   */
  public toString(): string {
    return `Pair<${new Type(this.#a)}, ${new Type(this.#b)}>`;
  }
}
