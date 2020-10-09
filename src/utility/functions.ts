/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import { join } from "path";
import { lstatSync, readdirSync } from "fs";
import { Timers } from "./Timers";

import type { Class } from "./Extender";

/**
 * A helper function for determining whether something is a class.
 *
 * @param {any} input
 * @returns {boolean} Whether the input was a class.
 */
export function isClass(input: unknown): input is Class {
  return (
    typeof input === "function" &&
    typeof input.prototype === "object" &&
    input.toString().substring(0, 5) === "class"
  );
}

/**
 * A helper function for capitalizing the first letter in the sentence.
 *
 * @param {string} str
 * @param {boolean} [lowerRest=true]
 * @returns {string}
 */
export function capitalize(str: string, lowerRest = true): string {
  const [f, ...r] = str.split("");
  return `${f.toUpperCase()}${
    lowerRest ? r.join("").toLowerCase() : r.join("")
  }`;
}

/**
 * A helper function for determining if a value is an event emitter.
 *
 * @param {any} input
 * @returns {boolean} Whether the input was an emitter.
 */
export function isEmitter(input: unknown): input is EventEmitterLike {
  const i = input as EventEmitterLike;
  return (
    input !== "undefined" &&
    input !== void 0 &&
    typeof i.addListener === "function" &&
    typeof i.emit === "function"
  );
}

/**
 * Returns an array.
 *
 * @template {T} The value.
 *
 * @param {T[] | T[]} value
 * @returns {T[]}
 */
export function array<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

/**
 * A helper function for determining if a value is a string.
 *
 * @param {any} input
 * @returns {boolean} Whether the input was a string.
 */
export function isString(input: unknown): input is string {
  return (
    input !== null && typeof input !== "undefined" && typeof input === "string"
  );
}

/**
 * A helper function for determining whether or not a value is a promise,
 *
 * @param {any} input
 * @returns {boolean} Whether the input was a promise.
 */
export function isPromise<V = unknown>(input: unknown): input is Promise<V> {
  const i = input as undefined | Promise<V>;
  return !!i && typeof i?.then === "function" && typeof i?.catch === "function";
}

/**
 * Check whether or not an object has a value.
 *
 * @param {Dictionary} obj The object.
 * @param {PropertyKey} key The key.
 * @returns {boolean} Whether the obj has the provided key.
 */
export function has<O extends Dictionary, K extends keyof O>(
  obj: O,
  key: K
): obj is O & Required<Pick<O, K>> {
  return Reflect.has(obj, key);
}

/**
 * Pauses the event loop for a set duration of time.
 *
 * @param {number} ms The duration in milliseconds.
 * @returns {Promise<NodeJS.Timeout>}
 */
export function sleep(ms: number): Promise<NodeJS.Timeout> {
  return new Promise((r) => Timers.setTimeout(r, ms));
}

/**
 * Walks a directory.
 *
 * @param {string} directory The directory to walk.
 * @param {WalkOptions} options Options for declaring the depth and extensions.
 * @returns {string[]} The found files.
 */
export function walk(directory: string, options: WalkOptions = {}): string[] {
  options = Object.assign(
    {
      depth: null,
      extensions: [".js", ".ts", ".json"],
    },
    options
  );

  let depth = 0;
  const read = (path: string, files: string[] = []) => {
    for (const file of readdirSync(path)) {
      const joined = join(path, file),
        stats = lstatSync(joined);
      if (stats.isFile()) {
        if (
          options.extensions &&
          !options.extensions.some((e) => file.endsWith(e))
        )
          continue;
        files.push(joined);
      } else if (stats.isDirectory()) {
        if (options.depth) {
          if (depth > options.depth) break;
          depth++;
        }

        files = files.concat(read(joined));
      }
    }

    return files;
  };

  return read(directory);
}

/**
 * Merges objects into one.
 *
 * @param {Dictionary} objects The objects to merge.
 */
export function mergeObjects<
  O extends Record<PropertyKey, any> = Record<PropertyKey, any>
>(...objects: Partial<O>[]): O {
  const o: Record<PropertyKey, any> = {};
  for (const object of objects) {
    for (const key of Reflect.ownKeys(object)) {
      if (!Reflect.has(o, key)) {
        const v = Reflect.get(object, key);
        Reflect.set(o, key, v);
      }
    }
  }

  return o as O;
}

/**
 * Determines whether a value in an object.
 * @param input
 */
export function isObject(input: unknown): input is Dictionary {
  return input !== null && typeof input === "object";
}

/**
 * Calls Object#defineProperty on a method or property.
 *
 * @param {PropertyDescriptor} descriptor The descriptor to pass.
 */
export function define(descriptor: PropertyDescriptor): PropertyDecorator {
  return (target: Dictionary, propertyKey: string | symbol): void => {
    Object.defineProperty(target, propertyKey, descriptor);
  };
}

/**
 * Flatten an object.
 *
 * @param {any} obj
 * @param {...any} [props] The properties to include.
 * @returns {Record<PropertyKey, any>}
 */
export function flatten(
  obj: any,
  ...props: PropertyKey[]
): Record<PropertyKey, unknown> {
  if (!isObject(obj)) return obj;

  const out: Dictionary = {};
  for (const prop of props) {
    const element = Reflect.get(obj, prop);
    const elemIsObj = isObject(element);
    const valueOf =
      elemIsObj && typeof element.valueOf === "function"
        ? element.valueOf()
        : null;

    let v;
    if (Array.isArray(element)) {
      v = element.map((e) => flatten(e));
    } else if (typeof valueOf !== "object") {
      v = valueOf;
    } else if (!elemIsObj) {
      v = element;
    }

    if (v) {
      Reflect.set(out, prop, v);
    }
  }

  return out;
}

export interface WalkOptions {
  depth?: number;
  extensions?: string[];
}
