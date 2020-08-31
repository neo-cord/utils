/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import { isPromise } from "../functions";

export class Extender<S extends Dictionary<Class<any>>> {
  /**
   * All of the structures that can be extended.
   */
  public readonly structures: Map<keyof S, Class<any>> = new Map();

  /**
   * Whether or not this extender is immutable.
   */
  public immutable = false;

  /**
   * Creates a new extender instance.
   * @param structures Pre-defined structures.
   */
  public constructor(structures?: S) {
    if (structures) {
      for (const [ name, struct ] of Object.entries(structures)) {
        this.structures.set(name, struct);
      }
    }
  }

  /**
   * Creates a new immutable extender.
   * @param structures The pre-defined structures.
   * @constructor
   */
  public static Immutable<S extends Dictionary<Class<any>>>(structures: S): Extender<S> {
    const extender = new Extender<S>(structures);
    extender.immutable = true;
    return extender;
  }

  /**
   * Adds a new structure to this extender.
   * @param name The name of this extender.
   * @param structure
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public add(name: string, structure: any): this {
    if (this.immutable) throw new Error("This extender is immutable.");
    if (!this.structures.has(name)) this.structures.set(name, structure);
    return this;
  }

  /**
   * Get a structure.
   * @param name The structures name.
   */
  public get<K extends keyof S>(name: K): S[K] {
    if (!this.structures.has(name))
      throw new Error(`Structure "${name}" does not exist.`);

    return this.structures.get(name) as S[K];
  }

  /**
   * Extend a defined structures.
   * @param name The structure to extend.
   * @param extender The extender function.
   */
  public async extend<K extends keyof S, E extends S[K]>(name: K, extender: ExtenderFunction<S[K], E>): Promise<this> {
    const base = this.structures.get(name) as S[K];
    if (!base)
      throw new Error(`Structure "${name}" does not exist.`);

    let extended = extender(base);
    if (isPromise(extended)) {
      extended = await extended;
    }

    if (!extended || !(extended instanceof base)) {
      throw new Error(`Returned class does not extend base structure "${name}"`);
    }

    this.structures.set(name, extended);
    return this;
  }
}

export type ExtenderFunction<S, E extends S> = (base: S) => E | Promise<E>;
export type Class<T> = new (...args: any[]) => T;
