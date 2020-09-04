import type { EventEmitter } from "events";

export global {
  type Dictionary<V = any> = Record<string, V>;
  type EventEmitterLike = Emitter | EventEmitter;
  type Tuple<L = any, R = any> = [ L, R ];
}

export class Emitter {
  /**
   * Creates a new Emitter.
   */
  constructor();

  /**
   * Adds a listener to this dispatcher.
   * @param event The event to listen for.
   * @param listener The event listener.
   */
  on(event: string, listener: Listener): this;

  /**
   * Adds a listener to this dispatcher then removes it when an event is dispatched.
   * @param event The event to listen for.
   * @param listener The event listener.
   */
  once(event: string, listener: Listener): this;

  /**
   * Removes a listener from an event.
   * @param event The event to remove the listener from.
   * @param listener The listener to remove.
   */
  removeListener(event: string, listener: Listener): boolean;

  /**
   * Dispatch an event.
   * @param event The event to dispatch.
   * @param args The arguments to provide.
   */
  emit(event: string, ...args: any[]): number;

  /**
   * Get the total listener count of this dispatcher or of a single event.
   * @param event The event.
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
   * @param fn The function to call.
   * @param delay The delay between each call.
   * @param args The args to pass.
   */
  static setInterval(fn: Fn, delay: number, ...args: any[]): NodeJS.Timeout;

  /**
   * Clears an interval.
   * @param interval The interval to clear.
   */
  static clearInterval(interval: NodeJS.Timeout): typeof Timers;

  /**
   * Set an interval.
   * @param fn The function to call.
   * @param delay The delay between each call.
   * @param args The args to pass.
   */
  static setTimeout(fn: Fn, delay: number, ...args: any[]): NodeJS.Timeout;

  /**
   * Clears an interval.
   * @param interval The interval to clear.
   */
  static clearTimeout(interval: NodeJS.Timeout): typeof Timers;
}

type Fn = (...args: any[]) => any;

export class Extender<S extends Dictionary<Class<any>>> {
  /**
   * All of the structures that can be extended.
   */
  readonly structures: Map<keyof S, Class<any>>;
  /**
   * Whether or not this extender is immutable.
   */
  immutable: boolean;

  /**
   * Creates a new extender instance.
   * @param structures Pre-defined structures.
   */
  constructor(structures?: S);

  /**
   * Creates a new immutable extender.
   * @param structures The pre-defined structures.
   * @constructor
   */
  static Immutable<S extends Dictionary<Class<any>>>(structures: S): Extender<S>;

  /**
   * Adds a new structure to this extender.
   * @param name The name of this extender.
   * @param structure
   */
  add(name: string, structure: any): this;

  /**
   * Get a structure.
   * @param name The structures name.
   */
  get<K extends keyof S>(name: K): S[K];

  /**
   * Extend a defined structures.
   * @param name The structure to extend.
   * @param extender The extender function.
   */
  extend<K extends keyof S, E extends S[K]>(name: K, extender: ExtenderFunction<S[K], E>): Promise<this>;
}

export type ExtenderFunction<S, E extends S> = (base: S) => E | Promise<E>;
export type Class<T> = new (...args: any[]) => T;

export class Bucket {
  /**
   * How many tokens the bucket has consumed in this interval.
   */
  tokens: number;
  /**
   * Timestamp of last token cleaning.
   */
  lastReset: number;
  /**
   * Timestamp of last token consumption.
   */
  lastSend: number;
  /**
   * The max number tokens the bucket can consume per interval.
   */
  tokenLimit: number;
  /**
   * How long (in ms) to wait between clearing used tokens.`
   */
  interval: number;
  /**
   * A latency reference object.
   */
  latencyRef: BucketLatencyRef;
  /**
   * The number of reserved tokens.
   */
  reservedTokens: number;

  /**
   * @param tokenLimit
   * @param interval
   * @param options
   */
  constructor(tokenLimit: number, interval: number, options?: BucketOptions);

  /**
   * Queue something in the Bucket
   * @param func A callback to call when a token can be consumed
   * @param priority Whether or not the callback should use reserved tokens
   * @since 1.0.0
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
   */
  get remaining(): number;

  /**
   * Waits for the last promise to resolve and queues a new one.
   */
  wait(): Promise<void>;

  /**
   * Enqueues a new promise.
   */
  enqueue(): void;

  /**
   * Frees the queue's lock so the next promise can resolve.
   */
  next(): void;
}

export class Snowflake {
  /**
   * The snowflake.
   */
  readonly id: BigInt;
  /**
   * The timestamp in which this snowflake was created.
   */
  readonly timestamp: number;
  /**
   * The worker id that generated this snowflake.
   */
  readonly workerId: number;
  /**
   * The ID of the process that generated this snowflake.
   */
  readonly processId: number;
  /**
   * The increment stored in the snowflake.
   */
  readonly increment: number;

  /**
   * Creates a new Snowflake.
   * @param id
   */
  constructor(id: string | BigInt);

  /**
   * When this snowflake was created.
   */
  get createdAt(): Date;

  /**
   * The snowflake as binary.
   */
  get binary(): string;

  /**
   * Resolves a snowflake into an object.
   * @param id The ID to resolve.
   */
  static resolve(id: string | BigInt): DiscordSnowflake;

  /**
   * Get the snowflake as a string.
   */
  toString(): string;

  /**
   * JSON representation of this snowflake.
   */
  toJSON(): DiscordSnowflake;
}

export interface DiscordSnowflake {
  id: string;
  timestamp: number;
  workerId: number;
  processId: number;
  increment: number;
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
 * @file modified https://github.com/Naval-Base/ms
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
   * @param number The number to parse.
   * @param long Whether or not to return the long version.
   * @since 1.0.0
   */
  static parse(number: number, long?: boolean): string;
  /**
   * Parses a string into milliseconds.
   * @param string The string to parse.
   * @since 1.0.0
   */
  static parse(string: string): number;
}

export class BitField<T extends BitFieldResolvable> implements BitFieldObject {
  /**
   * Flags for this BitField (Should be implemented in child classes)
   */
  static FLAGS: any;
  /**
   * The default flags for the bitfield
   */
  static DEFAULT: number;
  /**
   * The bitfield data
   */
  bitmask: number;

  /**
   * @param bits
   */
  constructor(bits?: T);

  /**
   * The value of all bits in this bitfield
   */
  static get ALL(): number;

  /**
   * Resolves a BitFieldResolvable into a number
   * @param bit The bit/s to resolve
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
   * @param bit The bit/s to check
   * @param hasParams
   */
  has(bit: T, ...hasParams: any[]): boolean;

  /**
   * Returns any bits this BitField is missing
   * @param bits The bit/s to check for
   * @param hasParams Additional params to pass to child has methods
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
   * @param bits The bit/s to remove
   */
  remove(...bits: T[]): BitField<T>;

  /**
   * Returns only the bits in common between this bitfield and the passed bits.
   * @param bits The bit/s to mask
   */
  mask(...bits: T[]): BitField<T>;

  /**
   * Returns an object of flags: boolean
   * @param hasParams Additional params to pass to child has methods
   */
  serialize(...hasParams: any[]): Record<string, boolean>;

  /**
   * Returns an array of Flags that make up this BitField
   * @param hasParams Additional params to pass to child has methods
   */
  toArray(...hasParams: any[]): string[];

  /**
   * Defines what this Bitfield is when converted to JSON
   * @since 1.0.0
   */
  toJSON(): number;

  /**
   * Defines value behavior of this BitField
   * @since 1.0.0
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
 * @param input
 * @since 2.0.0
 */
export function isClass(input: unknown): input is Class<unknown>;

/**
 * A helper function for capitalizing the first letter in the sentence.
 * @param str
 * @param lowerRest
 * @since 2.0.0
 */
export function capitalize(str: string, lowerRest?: boolean): string;

/**
 * A helper function for determining if a value is an event emitter.
 * @param input
 * @since 2.0.0
 */
export function isEmitter(input: unknown): input is EventEmitterLike;

/**
 * Returns an array.
 * @param v
 * @since 2.0.0
 */
export function array<T>(v: T | T[]): T[];

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
 * @param ms The duration in milliseconds.
 */
export function sleep(ms: number): Promise<void>;

/**
 * Walks a directory.
 * @param directory The directory to walk.
 * @param options Options for declaring the depth and extensions.
 */
export function walk(directory: string, options?: WalkOptions): string[];

/**
 * Merges objects into one.
 * @param objects The objects to merge.
 */
export function mergeObjects<O extends Dictionary = Dictionary>(...objects: Partial<O>[]): O;

/**
 * Determines whether a value in an object.
 * @param input
 */
export function isObject(input: unknown): input is Dictionary;

/**
 * Flatten an object.
 * @param obj
 * @param props
 * @since 1.0.0
 */
export function flatten(obj: unknown, ...props: any[]): any;

export interface WalkOptions {
  depth?: number;
  extensions?: string[];
}

