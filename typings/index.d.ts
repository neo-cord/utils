import type { EventEmitter } from "events";

declare global {
  type Dictionary<V = any> = Record<string, V>;
  type EventEmitterLike = Emitter | EventEmitter;
  type Tuple<L = any, R = any> = [ L, R ];
}

export class Emitter {
  /**
   * Creates a new instanceof Emitter.
   */
  constructor();

  /**
   * Adds a listener to this emitter.
   * @param {string} event The event to listen for.
   * @param {Listener} listener The event listener.
   */
  on(event: string, listener: Listener): this;

  /**
   * Adds a listener to this emitter then removes it when an event is dispatched.
   * @param {string} event The event to listen for.
   * @param {Listener} listener The event listener.
   */
  once(event: string, listener: Listener): this;

  /**
   * Removes a listener from an event.
   * @param {string} event The event to remove the listener from.
   * @param {Listener} listener The listener to remove.
   */
  removeListener(event: string, listener: Listener): boolean;

  /**
   * Dispatch an event.
   * @param {string} event The event to dispatch.
   * @param {...*} [args] The arguments to provide.
   */
  emit(event: string, ...args: any[]): number;

  /**
   * Get the total listener count of this emitter or of a single event.
   * @param {string} [event] The event.
   * @returns {number} The amount of listeners for the event or all listeners..
   */
  listenerCount(event?: string): number;
}

export type Listener = (...args: any[]) => unknown;

export abstract class Timers {
  /**
   * Clears all of the current intervals and timeouts.
   */
  static clear(): void;

  /**
   * Set an interval.
   * @param {Fn} fn The function to call.
   * @param {number} delay The delay between each call.
   * @param {...*} [args] The args to pass.
   */
  static setInterval(fn: Fn, delay: number, ...args: any[]): NodeJS.Timeout;

  /**
   * Clears an interval.
   * @param {NodeJS.Timeout} interval The interval to clear.
   */
  static clearInterval(interval: NodeJS.Timeout): typeof Timers;

  /**
   * Set an interval.
   * @param {Fn} fn The function to call.
   * @param {number} delay The delay between each call.
   * @param {...*} args The args to pass.
   */
  static setTimeout(fn: Fn, delay: number, ...args: any[]): NodeJS.Timeout;

  /**
   * Clears an interval.
   * @param {NodeJS.Timeout} interval The interval to clear.
   */
  static clearTimeout(interval: NodeJS.Timeout): typeof Timers;
}

type Fn = (...args: any[]) => any;

export class Extender<S extends Dictionary<Class<any>>> {
  /**
   * All of the structures that can be extended.
   * @type {Map<string, Class>}
   */
  readonly structures: Map<keyof S, Class<any>>;
  /**
   * Whether or not this extender is immutable.
   * @type {boolean}
   */
  immutable: boolean;

  /**
   * @param {Dictionary} structures Pre-defined structures.
   */
  constructor(structures?: S);

  /**
   * Creates a new immutable extender.
   * @param {Dictionary} structures The pre-defined structures.
   * @constructor
   */
  static Immutable<S extends Dictionary<Class<any>>>(structures: S): Extender<S>;

  /**
   * Adds a new structure to this extender.
   * @param {string} name The name of this extender.
   * @param {*} structure
   */
  add(name: string, structure: any): this;

  /**
   * Get a structure.
   * @param name The structures name.
   */
  get<K extends keyof S>(name: K): S[K];

  /**
   * Extend a defined structures.
   * @param {string} name The structure to extend.
   * @param {ExtenderFunction} extender The extender function.
   */
  extend<K extends keyof S, E extends S[K]>(name: K, extender: ExtenderFunction<S[K], E>): Promise<this>;
}

export type ExtenderFunction<S, E extends S> = (base: S) => E | Promise<E>;
export type Class<T> = new (...args: any[]) => T;

export class Bucket {
  /**
   * How many tokens the bucket has consumed in this interval.
   * @type {number}
   */
  tokens: number;
  /**
   * Timestamp of last token cleaning.
   * @type {number}
   */
  lastReset: number;
  /**
   * Timestamp of last token consumption.
   * @type {number}
   */
  lastSend: number;
  /**
   * The max number tokens the bucket can consume per interval.
   * @type {number}
   */
  tokenLimit: number;
  /**
   * How long (in ms) to wait between clearing used tokens.`
   * @type {number}
   */
  interval: number;
  /**
   * A latency reference object.
   * @type {BucketLatencyRef}
   */
  latencyRef: BucketLatencyRef;
  /**
   * The number of reserved tokens.
   * @type {number}
   */
  reservedTokens: number;

  /**
   * @param {number} tokenLimit
   * @param {number} interval
   * @param {BucketOptions} [options={}]
   */
  constructor(tokenLimit: number, interval: number, options?: BucketOptions);

  /**
   * Queue something in the Bucket
   * @param {CallableFunction} func A callback to call when a token can be consumed
   * @param {boolean} [priority=false] Whether or not the callback should use reserved tokens
   */
  queue(func: CallableFunction, priority?: boolean): void;
}

interface BucketOptions extends Record<string, any> {
  reservedTokens?: number;
  latencyRef?: BucketLatencyRef;
}

interface BucketLatencyRef {
  offset?: number;
  latency: number;
}

export class AsyncQueue {
  /**
   * The remaining promises that are in the queue.
   * @type {number}
   */
  get remaining(): number;

  /**
   * Waits for the last promise to resolve and queues a new one.
   * @returns {Promise<void>}
   */
  wait(): Promise<void>;

  /**
   * Enqueues a new promise.
   * @returns {Promise<void>}
   */
  enqueue(): void;

  /**
   * Frees the queue's lock so the next promise can resolve.
   * @returns {void}
   */
  next(): void;
}

export abstract class Snowflake {
  /**
   * Transforms an ID into binary.
   * @param {string} snowflake The ID to transform.
   * @returns {string}
   */
  static toBinary(snowflake: snowflake): string;

  /**
   * Transforms an ID from binary to a decimal string.
   * @param {string} binary The binary string to be transformed.
   * @returns {string}
   */
  static fromBinary(binary: string): snowflake;

  /**
   * Deconstructs a Discord Snowflake.
   * @param {snowflake} snowflake
   * @param {number} epoch The epoch to use when deconstructing.
   * @returns {DeconstructedSnowflake}
   */
  static deconstruct(snowflake: snowflake, epoch?: number): DeconstructedSnowflake;

  /**
   * Generates a new snowflake.
   * @param {Date | number} timestamp The timestamp.
   * @param {number} epoch The epoch to use for the timestamp.
   * @returns {string}
   */
  static generate({ epoch, timestamp }?: GenerateSnowflakeOptions): string;
}

/**
 * A Twitter snowflake, except the default epoch is 2015-01-01T00:00:00.000Z
 *
 * ```
 * If we have a snowflake '266241948824764416' we can represent it as binary:
 *
 * 64                                          22     17     12          0
 *  000000111011000111100001101001000101000000  00001  00000  000000000000
 *           number of ms since epoch           worker  pid    increment
 * ```
 */
export type snowflake = string;

export interface DeconstructedSnowflake {
  binary: string;
  timestamp: number;
  workerId: number;
  processId: number;
  increment: number;
}

export interface GenerateSnowflakeOptions {
  timestamp?: Date | number;
  epoch?: number;
}

export class Collection<K, V> extends Map<K, V> {
  ["constructor"]: typeof Collection;

  /**
   * The first item in this collection.
   */
  get first(): V | null;

  /**
   * The last item in this collection.
   */
  get last(): V | null;

  /**
   * Get an array of all values in this collection.
   */
  array(): Array<V>;

  /**
   * Tests whether or not an entry in this collection meets the provided predicate.
   * @param predicate A predicate that tests all entries.
   * @param thisArg An optional binding for the predicate function.
   */
  some(predicate: (value: V, key: K, col: this) => unknown, thisArg?: unknown): boolean;

  /**
   * Collection#forEach but it returns the collection instead of nothing.
   * @param fn The function to be ran on all entries.
   * @param thisArg An optional binding for the fn parameter.
   */
  each(fn: (value: V, key: K, col: this) => unknown, thisArg?: unknown): this;

  /**
   * Sweeps entries from the collection.
   * @param fn
   * @param thisArg
   */
  sweep(fn: (value: V, key: K, col: this) => boolean, thisArg?: unknown): number;

  /**
   * Finds a value using a predicate from this collection
   * @param fn Function used to find the value.
   * @param thisArg Optional binding to use.
   */
  find(fn: (value: V, key: K, col: this) => boolean, thisArg?: unknown): V | null;

  /**
   * Reduces this collection down into a single value.
   * @param fn The function used to reduce this collection.
   * @param acc The accumulator.
   * @param thisArg Optional binding for the reducer function.
   */
  reduce<A>(fn: (acc: A, value: V, key: K, col: this) => A, acc: A, thisArg?: unknown): A;

  /**
   * Returns a filtered collection based on the provided predicate.
   * @param fn The predicate used to determine whether or not an entry can be passed to the new collection.
   * @param thisArg Optional binding for the predicate.
   */
  filter(fn: (value: V, key: K, col: this) => boolean, thisArg?: unknown): Collection<K, V>;

  /**
   * Maps this collection into an array. Array#map equivalent.
   * @param fn Function used to map values to an array.
   * @param thisArg Optional binding for the map function.
   */
  map<T>(fn: (value: V, key: K, col: this) => T, thisArg?: unknown): T[];

  /**
   * Sorts the entries in-place in this collection.
   * @param compareFunction Function to determine how this collection should be sorted
   */
  sort(compareFunction?: (firstValue: V, secondValue: V, firstKey?: K, secondKey?: K) => number): this;

  /**
   * Sorts entries in a new collection
   * @param compareFunction Function to determine how the resulting collection should be sorted
   */
  sorted(compareFunction?: (firstValue: V, secondValue: V, firstKey?: K, secondKey?: K) => number): Collection<K, V>;

  /**
   * Returns a clone of this collection.
   */
  clone(): Collection<K, V>;
}

/**
 * @file modified version of https://github.com/Naval-Base/ms
 */
export enum Unit {
  SECOND = 1000,
  MINUTE = 60000,
  HOUR = 3600000,
  DAY = 86400000,
  WEEK = 604800000,
  YEAR = 31557600000
}

export class Duration {
  /**
   * Parses a number into a string.
   * @param {number} number The number to parse.
   * @param {boolean} [long=false] Whether or not to return the long version.
   */
  static parse(number: number, long?: boolean): string;
  /**
   * Parses a string into milliseconds.
   * @param string The string to parse.
   */
  static parse(string: string): number;
}

export class BitField<T extends BitFieldResolvable> implements BitFieldObject {
  /**
   * Flags for this BitField (Should be implemented in child classes).
   * @type {*}
   */
  static FLAGS: any;
  /**
   * The default flags for the bitfield
   * @type {number}
   */
  static DEFAULT: number;
  /**
   * The bitfield data
   * @type {number}
   */
  bitmask: number;

  /**
   * @param {BitFieldResolvable} bits
   */
  constructor(bits?: T);

  /**
   * The value of all bits in this bitfield
   * @type {number}
   */
  static get ALL(): number;

  /**
   * Resolves a BitFieldResolvable into a number
   * @param {BitFieldResolvable} bit The bit/s to resolve
   */
  static resolve<T extends BitFieldResolvable>(bit?: T): number;

  /**
   * Checks whether the bitfield has a bit, or any of multiple bits.
   * @param bit Bit(s) to check for
   */
  any(bit: T): boolean;

  /**
   * Checks if this BitField matches another bitfield resolvable
   * @param bit The bit/s to check
   */
  equals(bit: T): boolean;

  /**
   * Checks if this BitField has a bit or bits
   * @param {BitFieldResolvable} bit The bit/s to check
   * @param {...*} hasParams
   */
  has(bit: T, ...hasParams: any[]): boolean;

  /**
   * Returns any bits this BitField is missing
   * @param {BitFieldResolvable} bits The bit/s to check for
   * @param {...*} hasParams Additional params to pass to child has methods
   */
  missing(bits: T, ...hasParams: any[]): string[];

  /**
   * Freezes this BitField
   */
  freeze(): this;

  /**
   * Adds a bit to this BitField or a new Bitfield if this is frozen
   * @param bits The bit/s to add
   */
  add(...bits: T[]): BitField<T>;

  /**
   * Removes a bit to this BitField or a new Bitfield if this is frozen
   * @param {...BitFieldResolvable} bits The bit/s to remove
   */
  remove(...bits: T[]): BitField<T>;

  /**
   * Returns only the bits in common between this bitfield and the passed bits.
   * @param {...BitFieldResolvable} bits The bit/s to mask
   */
  mask(...bits: T[]): BitField<T>;

  /**
   * Returns an object of flags: boolean
   * @param {...*} hasParams Additional params to pass to child has methods
   */
  serialize(...hasParams: any[]): Record<string, boolean>;

  /**
   * Returns an array of Flags that make up this BitField
   * @param {...*} hasParams Additional params to pass to child has methods
   */
  toArray(...hasParams: any[]): string[];

  /**
   * The JSON representation of this bitfield.
   * @returns {number}
   */
  toJSON(): number;

  /**
   * Defines value behavior of this BitField
   * @returns {number}
   */
  valueOf(): number;
}

export interface BitFieldObject {
  bitmask: number;
}

export type BitFieldResolvable =
  keyof typeof BitField.FLAGS
  | number
  | BitFieldObject
  | ((keyof typeof BitField.FLAGS) | number | BitFieldObject)[];

/**
 * A helper function for determining whether something is a class.
 * @param {*} input
 * @returns {boolean} Whether the input was a class.
 */
export function isClass(input: unknown): input is Class<unknown>;

/**
 * A helper function for capitalizing the first letter in the sentence.
 * @param {string} str
 * @param {boolean} [lowerRest=true]
 */
export function capitalize(str: string, lowerRest?: boolean): string;

/**
 * A helper function for determining if a value is an event emitter.
 * @param {unknown} input
 * @returns {boolean} Whether the input was an emitter.
 */
export function isEmitter(input: unknown): input is EventEmitterLike;

/**
 * Returns an array.
 * @param {*[] | *} value
 */
export function array<T>(value: T | T[]): T[];

/**
 * A helper function for determining if a value is a string.
 * @param value
 * @since 2.0.0
 */
export function isString(value: unknown): value is string;

/**
 * A helper function for determining whether or not a value is a promise,
 * @param value
 */
export function isPromise(value: unknown): value is Promise<unknown>;

/**
 * Check whether or not an object has a value.
 * @param obj The object.
 * @param key The key.
 */
export function has<O extends Dictionary, K extends keyof O>(obj: O, key: K): obj is O & Required<Pick<O, K>>;

/**
 * Pauses the event loop for a set duration of time.
 * @param {number | string} ms The duration in milliseconds.
 * @returns {Promise<NodeJS.Timeout>}
 */
export function sleep(ms: number | string): Promise<NodeJS.Timeout>;

/**
 * Walks a directory.
 * @param {string} directory The directory to walk.
 * @param {WalkOptions} options Options for declaring the depth and extensions.
 */
export function walk(directory: string, options?: WalkOptions): string[];

/**
 * Merges objects into one.
 * @param {Dictionary} objects The objects to merge.
 */
export function mergeObjects<O extends Dictionary = Dictionary>(...objects: Partial<O>[]): O;

/**
 * Determines whether a value in an object.
 * @param input
 */
export function isObject(input: unknown): input is Dictionary;

/**
 * Calls Object#defineProperty on a method or property.
 * @param {PropertyDescriptor} descriptor The descriptor to pass.
 */
export function define(descriptor: PropertyDescriptor): PropertyDecorator;

/**
 * Flatten an object.
 * @param {*} obj
 * @param {...*} [props]
 */
export function flatten(obj: unknown, ...props: any[]): any;

export interface WalkOptions {
  depth?: number;
  extensions?: string[];
}

