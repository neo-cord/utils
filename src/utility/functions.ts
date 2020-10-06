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
 * @param {string} str
 * @param {boolean} [lowerRest=true]
 */
export function capitalize(str: string, lowerRest = true): string {
  const [ f, ...r ] = str.split("");
  return `${f.toUpperCase()}${
    lowerRest ? r.join("").toLowerCase() : r.join("")
  }`;
}

/**
 * A helper function for determining if a value is an event emitter.
 * @param {any} input
 * @returns {boolean} Whether the input was an emitter.
 */
export function isEmitter(input: unknown): input is EventEmitterLike {
  return (
    input !== "undefined" &&
    input !== void 0 &&
    typeof (input as EventEmitterLike).on === "function" &&
    typeof (input as EventEmitterLike).emit === "function"
  );
}

/**
 * Returns an array.
 * @param {any[] | any} value
 */
export function array<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [ value ];
}

/**
 * A helper function for determining if a value is a string.
 * @param value
 * @since 2.0.0
 */
export function isString(value: unknown): value is string {
  return value !== null && value !== "undefined" && typeof value === "string";
}

/**
 * A helper function for determining whether or not a value is a promise,
 * @param value
 */
export function isPromise(value: unknown): value is Promise<unknown> {
  return (
    value &&
    typeof (value as Promise<unknown>).then === "function" &&
    typeof (value as Promise<unknown>).catch === "function"
  );
}

/**
 * Check whether or not an object has a value.
 * @param obj The object.
 * @param key The key.
 */
export function has<O extends Dictionary, K extends keyof O>(
  obj: O,
  key: K
): obj is O & Required<Pick<O, K>> {
  return Reflect.has(obj, key);
}

/**
 * Pauses the event loop for a set duration of time.
 * @param {number | string} ms The duration in milliseconds.
 * @returns {Promise<NodeJS.Timeout>}
 */
export function sleep(ms: number): Promise<NodeJS.Timeout> {
  return new Promise((r) => Timers.setTimeout(r, ms));
}

/**
 * Walks a directory.
 * @param {string} directory The directory to walk.
 * @param {WalkOptions} options Options for declaring the depth and extensions.
 */
export function walk(directory: string, options: WalkOptions = {}): string[] {
  options = Object.assign(
    {
      depth: null,
      extensions: [ ".js", ".ts", ".json" ]
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
 * @param {Dictionary} objects The objects to merge.
 */
export function mergeObjects<O extends Dictionary = Dictionary>(
  ...objects: Partial<O>[]
): O {
  const o: Dictionary = {};
  for (const object of objects) {
    for (const key of Object.keys(object)) {
      if (o[key] === null || o[key] === void 0) o[key] = object[key];
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
 * @param {PropertyDescriptor} descriptor The descriptor to pass.
 */
export function define(descriptor: PropertyDescriptor): PropertyDecorator {
  return (target: Dictionary, propertyKey: string | symbol): void => {
    Object.defineProperty(target, propertyKey, descriptor);
  };
}

/**
 * Flatten an object.
 * @param {any} obj
 * @param {...any} [props]
 */
export function flatten(obj: unknown, ...props: any[]): any {
  if (!isObject(obj)) return obj;

  const out: Dictionary = {};
  for (const prop of props) {
    const element = obj[prop];
    const elemIsObj = isObject(element);
    const valueOf =
      elemIsObj && typeof element.valueOf === "function"
        ? element.valueOf()
        : null;

    if (Array.isArray(element))
      out[prop] = element.map((e: Array<any>) => flatten(e));
    else if (typeof valueOf !== "object") out[prop] = valueOf;
    else if (!elemIsObj) out[prop] = element;
  }

  return out;
}

export interface WalkOptions {
  depth?: number;
  extensions?: string[];
}