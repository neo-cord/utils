declare global {
  type Dictionary<V = any> = Record<string, V>;
  type Tuple<L = any, R = any> = [L, R];

  interface EventEmitterLike {
    emit(event: string | symbol, ...args: any[]): boolean | void | number;

    addListener(
      event: string | symbol,
      listener: (...args: any[]) => void
    ): EventEmitterLike | any;

    removeListener(
      event: string | symbol,
      listener: (...args: any[]) => void
    ): EventEmitterLike | any;
  }
}

export enum Intent {
  Guilds = 1,
  GuildMembers = 2,
  GuildBans = 4,
  GuildEmojis = 8,
  GuildIntegrations = 16,
  GuildWebhooks = 32,
  GuildInvites = 64,
  GuildVoiceStates = 128,
  GuildPresences = 256,
  GuildMessages = 512,
  GuildMessageReactions = 1024,
  GuildMessageTyping = 2048,
  DirectMessages = 4096,
  DirectMessageReactions = 8192,
  DirectMessageTyping = 16384,
}

export class Intents extends BitField<IntentResolvable> {
  /**
   * All intents that were provided by discord.
   *
   * @type {Intent}
   */
  static FLAGS: typeof Intent;
  /**
   * All privileged intents ORed together.
   *
   * @type {number}
   */
  static PRIVILEGED: number;
  /**
   * All of the non-privileged intents.
   *
   * @type {number}
   */
  static NON_PRIVILEGED: number;
  /**
   * Intents recommended by NeoCord.
   *
   * @type {number}
   */
  static DEFAULT: number;
}

type IntentBit = Intent | keyof typeof Intent | number | BitFieldObject;
export type IntentResolvable = IntentBit | IntentBit[];

export enum MessageFlag {
  /**
   * This message has been published to subscribed channels (via Channel Following).
   */
  Crossposted = 1,
  /**
   * This message originated from a message in another channel (via Channel Following).
   */
  IsCrosspost = 2,
  /**
   * Do not include any embeds when serializing this message.
   */
  SuppressEmbeds = 4,
  /**
   * The source message for this crosspost has been deleted (via Channel Following).
   */
  SourceMessageDeleted = 8,
  /**
   * This message came from the urgent message system.
   *
   * @type {number}
   */
  Urgent = 16,
}

export class MessageFlags extends BitField<MessageFlagResolvable> {}

type MessageFlagBit =
  | MessageFlag
  | keyof typeof MessageFlag
  | number
  | BitFieldObject;
export type MessageFlagResolvable = MessageFlagBit | MessageFlagBit[];

export enum Permission {
  CreateInstantInvite = 1,
  KickMembers = 2,
  BanMembers = 4,
  Administrator = 8,
  ManageChannels = 16,
  ManageGuild = 32,
  AddReactions = 64,
  ViewAuditLog = 128,
  PrioritySpeaker = 256,
  Stream = 512,
  ViewChannel = 1024,
  SendMessages = 2048,
  SendTTSMessage = 4096,
  ManageMessages = 8192,
  EmbedLinks = 16384,
  AttachFiles = 32768,
  ReadMessageHistory = 65536,
  MentionEveryone = 131072,
  UseExternalEmojis = 262144,
  ViewGuildInsights = 524288,
  Connect = 1048576,
  Speak = 2097152,
  MuteMembers = 4194304,
  DeafenMembers = 8388608,
  MoveMembers = 16777216,
  UseVAD = 33554432,
  ChangeNickname = 67108864,
  ManageNicknames = 134217728,
  ManageRoles = 268435456,
  ManageWebhooks = 536870912,
  ManageEmojis = 1073741824,
}

export class Permissions extends BitField<PermissionResolvable> {
  /**
   * All Permission Flags.
   *
   * @type {Permission}
   */
  static FLAGS: typeof Permission;
  /**
   * The default permissions for a role.
   *
   * @type {number}
   */
  static DEFAULT: number;
  /**
   * Permissions that can't be influenced by channel overwrites, even if explicitly set.
   *
   * @type {number}
   */
  static GUILD_SCOPE_PERMISSIONS: number;

  /**
   * Makes a permission name more readable.
   *
   * @param {Permission} permission The permission.
   * @returns {boolean}
   */
  static humanize(permission: Permission): string;

  /**
   * Checks whether the bitfield has a permission, or any of multiple permissions.
   *
   * @param {PermissionResolvable} permission Permission(s) to check for.
   * @param {boolean} [checkAdmin] Whether to allow the administrator permission to override.
   * @returns {boolean}
   */
  any(permission: PermissionResolvable, checkAdmin?: boolean): boolean;

  /**
   * Checks whether the bitfield has a permission, or multiple permissions.
   *
   * @param {PermissionResolvable} permission Permission(s) to check for.
   * @param {boolean} [checkAdmin] Whether to allow the administrator permission to override.
   * @returns {number}
   */
  has(permission: PermissionResolvable, checkAdmin?: boolean): boolean;
}

type PermissionBit =
  | Permission
  | keyof typeof Permission
  | number
  | BitFieldObject;
export type PermissionResolvable = PermissionBit | PermissionBit[];

export enum UserFlag {
  DiscordEmployee = 1,
  DiscordPartner = 2,
  HypeSquadEvents = 4,
  BugHunterLevelOne = 8,
  HouseBravery = 64,
  HouseBrilliance = 128,
  HouseBalance = 256,
  EarlySupporter = 512,
  TeamUser = 1024,
  System = 4096,
  BugHunterLevelTwo = 16384,
  VerifiedBot = 65536,
  VerifiedBotDeveloper = 131072,
}

export class UserFlags extends BitField<UserFlagResolvable> {}

type UserFlagBit = UserFlag | keyof typeof UserFlag | number | BitFieldObject;
export type UserFlagResolvable = UserFlagBit | UserFlagBit[];

export class BitField<B extends BitResolvable> implements BitFieldObject {
  /**
   * Flags for this BitField (Should be implemented in child classes).
   *
   * @type {any}
   */
  static FLAGS: any;
  /**
   * The default flags for the bitfield
   *
   * @type {number}
   */
  static DEFAULT: number;
  /**
   * The bitfield data
   *
   * @type {number}
   */
  bitmask: number;

  /**
   * @param {BitResolvable} bits The bits to start to with.
   */
  constructor(bits?: B);

  /**
   * The value of all bits in this bitfield.
   *
   * @type {number}
   */
  static get ALL(): number;

  /**
   * Resolves a BitFieldResolvable into a number.
   *
   * @param {BitResolvable} bit The bit/s to resolve.
   * @returns {number}
   */
  static resolve<T extends BitResolvable>(bit?: T): number;

  /**
   * Checks whether the bitfield has a bit, or any of multiple bits.
   *
   * @param {number} bit Bit(s) to check for.
   * @returns {boolean}
   */
  any(bit: B): boolean;

  /**
   * Checks if this BitField matches another bitfield resolvable
   *
   * @param {BitResolvable} bit The bit(s) to check.
   * @returns {boolean}
   */
  equals(bit: B): boolean;

  /**
   * Checks if this BitField has a bit or bits
   *
   * @param {BitResolvable} bit The bit/s to check
   * @param {...any} args Arguments to pass when provided an array.
   * @returns {boolean}
   */
  has(bit: B, ...args: any[]): boolean;

  /**
   * Returns any bits this BitField is missing.
   *
   * @param {BitResolvable} bits The bit/s to check for.
   * @param {...any} args Additional params to pass to child has methods.
   * @returns {string[]}
   */
  missing(bits: B, ...args: any[]): string[];

  /**
   * Freezes this BitField
   */
  freeze(): this;

  /**
   * Adds a bit to this BitField or a new Bitfield if this is frozen
   *
   * @param {...BitResolvable} bits The bit(s) to add.
   * @returns {BitField}
   */
  add(...bits: B[]): BitField<B>;

  /**
   * Removes a bit to this BitField or a new Bitfield if this is frozen
   *
   * @param {...BitResolvable} bits The bit(s) to remove.
   * @returns {BitField}
   */
  remove(...bits: B[]): this;

  /**
   * Returns only the bits in common between this bitfield and the passed bits.
   *
   * @param {...BitResolvable} bits The bit(s) to mask.
   * @returns {BitField}
   */
  mask(...bits: B[]): this;

  /**
   * Returns an object of flags: boolean.
   *
   * @param {...*} args Additional params to pass to child has methods.
   * @returns {Dictionary<boolean>} The serialized of bitmask.
   */
  serialize(...args: any[]): Dictionary<boolean>;

  /**
   * Returns an array of Flags that make up this BitField.
   *
   * @param {...any} args Additional params to pass to child has methods.
   * @returns {string[]}
   */
  toArray(...args: any[]): string[];

  /**
   * The JSON representation of this bitfield.
   *
   * @returns {number}
   */
  toJSON(): number;

  /**
   * Defines value behavior of this BitField
   *
   * @returns {number}
   */
  valueOf(): number;
}

export interface BitFieldObject {
  bitmask: number;
}

type bit = keyof typeof BitField.FLAGS | number | BitFieldObject;
export type BitResolvable = bit | bit[];

/**
 * @credit Some methods taken from discord.js
 */
export abstract class Snowflake {
  /**
   * Transforms an ID into binary.
   *
   * @param {string} snowflake The ID to transform.
   * @returns {string}
   */
  static toBinary(snowflake: snowflake): string;

  /**
   * Transforms an ID from binary to a decimal string.
   *
   * @param {string} binary The binary string to be transformed.
   * @returns {string}
   */
  static fromBinary(binary: string): snowflake;

  /**
   * Deconstructs a Discord Snowflake.
   *
   * @param {snowflake} snowflake
   * @param {number} epoch The epoch to use when deconstructing.
   * @returns {DeconstructedSnowflake}
   */
  static deconstruct(
    snowflake: snowflake,
    epoch?: number
  ): DeconstructedSnowflake;

  /**
   * Generates a new snowflake.
   *
   * @param {GenerateSnowflakeOptions} options The options to use when generating a snowflake.
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
  /**
   * The timestamp to use.
   *
   * @type {?Date | null}
   * @default Date.now()
   */
  timestamp?: Date | number;
  /**
   * The EPOCH to use.
   *
   * @type {?number}
   * @default Discords Epoch
   */
  epoch?: number | Date;
}

export class Collection<K, V> extends Map<K, V> {
  ["constructor"]: typeof Collection;

  /**
   * Creates a collection from an array of values and the keys are the indexes.
   *
   * @param {Array} values The array of values.
   * @returns {Collection}
   */
  static from<V>(values: V[]): Collection<number, V>;
  /**
   *
   * Creates a collection from an array of tuples or object.
   *
   * @param {Tuple[] | Dictionary} tupleArrayOrObject The tuple array or dictionary.
   * @returns {Collection}
   */
  static from<K, V>(
    tupleArrayOrObject: Tuple<K, V>[] | Dictionary<V>
  ): Collection<K, V>;

  /**
   * Returns the first key in this collection.
   *
   * @returns {?any}
   */
  first(): Tuple<K, V> | null;
  /**
   * Returns an array of keys at the start of this collection.
   *
   * @param {number} amount The amount of values.
   * @returns {any[]}
   */
  first(amount: number): Tuple<K, V>[];

  /**
   * Returns the last key in this collection.
   *
   * @returns {?any}
   */
  last(): Tuple<K, V> | null;
  /**
   *
   * Returns an array of keys at the end of this collection.
   * @param {number} amount The amount of values.
   * @returns {any[]}
   */
  last(amount: number): Tuple<K, V>[];

  /**
   * Get an array of all values in this collection.
   * @returns {any[]}
   */
  array(): V[];

  /**
   * Tests whether or not an entry in this collection meets the provided predicate.
   *
   * @param {function} predicate A predicate that tests all entries.
   * @param {any} [thisArg] An optional binding for the predicate function.
   * @returns {boolean}
   */
  some(
    predicate: (value: V, key: K, col: this) => unknown,
    thisArg?: unknown
  ): boolean;

  /**
   * Creates a new collection with the items within the provided range.
   *
   * @param {number} [from] Where to stop.
   * @param {number} [end] Where to end.
   * @returns {Collection}
   */
  slice(from?: number, end?: number): Collection<K, V>;

  /**
   * Collection#forEach but it returns the collection instead of nothing.
   *
   * @param {function} fn The function to be ran on all entries.
   * @param {any} [thisArg] An optional binding for the fn parameter.
   * @returns {Collection}
   */
  each(fn: (value: V, key: K, col: this) => unknown, thisArg?: unknown): this;

  /**
   * Computes a value if it's absent in this collection.
   * @param {any} key The key.
   * @param {any} value The value to use if nothing is found.
   * @returns {any}
   */
  ensure(key: K, value: ((key: K) => V) | V): V;

  /**
   * Get a random value from this collection.
   *
   * @returns {any}
   */
  random(): V;

  /**
   * Get a random key from this collection.
   *
   * @returns {any}
   */
  randomKey(): K;

  /**
   * Get random entry from this collection.
   *
   * @returns {Tuple}
   */
  randomEntry(): Tuple<K, V>;

  /**
   * Sweeps entries from the collection.
   *
   * @param {function} fn The predicate.
   * @param {any} [thisArg] Optional binding for the predicate.
   * @returns {number}
   */
  sweep(
    fn: (value: V, key: K, col: this) => boolean,
    thisArg?: unknown
  ): number;

  /**
   * Finds a value using a predicate from this collection
   *
   * @param {function} fn Function used to find the value.
   * @param {any} [thisArg] Optional binding to use.
   * @returns {?any}
   */
  find(
    fn: (value: V, key: K, col: this) => boolean,
    thisArg?: unknown
  ): V | null;

  /**
   * Reduces this collection down into a single value.
   *
   * @param {function} fn The function used to reduce this collection.
   * @param {any} acc The accumulator.
   * @param {any} [thisArg] Optional binding for the reducer function.
   * @returns {any}
   */
  reduce<A>(
    fn: (acc: A, value: V, key: K, col: this) => A,
    acc: A,
    thisArg?: unknown
  ): A;

  /**
   * Partition this collection. First collection are the entries that returned true, second collection are the entries that returned false.
   *
   * @param {function} predicate The predicate function.
   * @param {any} [thisArg] Optional binding for the predicate.
   * @returns {[Collection, Collection]}
   */
  partition(
    predicate: (value: V, key: K, col: this) => boolean,
    thisArg?: unknown
  ): Tuple<Collection<K, V>, Collection<K, V>>;

  /**
   * Returns a filtered collection based on the provided predicate.
   *
   * @param {function} fn The predicate used to determine whether or not an entry can be passed to the new collection.
   * @param {any} [thisArg] Optional binding for the predicate.
   * @returns {Collection}
   */
  filter(
    fn: (value: V, key: K, col: this) => boolean,
    thisArg?: unknown
  ): Collection<K, V>;

  /**
   * Maps this collection into an array. Array#map equivalent.
   *
   * @param {function} fn Function used to map values to an array.
   * @param {any} [thisArg] Optional binding for the map function.
   * @returns {any[]}
   */
  map<T>(fn: (value: V, key: K, col: this) => T, thisArg?: unknown): T[];

  /**
   * Sorts the entries in-place in this collection.
   *
   * @param {function} compareFunction Function to determine how this collection should be sorted.
   * @returns {Collection}
   */
  sort(
    compareFunction?: (
      firstValue: V,
      secondValue: V,
      firstKey?: K,
      secondKey?: K
    ) => number
  ): this;

  /**
   * Sorts entries in a new collection
   *
   * @param {function} compareFunction Function to determine how the resulting collection should be sorted
   * @returns {Collection}
   */
  sorted(
    compareFunction?: (
      firstValue: V,
      secondValue: V,
      firstKey?: K,
      secondKey?: K
    ) => number
  ): Collection<K, V>;

  /**
   * Returns a clone of this collection.
   *
   * @returns {Collection}
   */
  clone(): Collection<K, V>;

  /**
   * Get the string representation of this collection.
   *
   * @returns {string}
   */
  toString(): string;
}

export class List<V> extends Set<V> {
  ["constructor"]: typeof List;

  /**
   * The first item in this list.
   *
   * @type {?any}
   */
  get first(): V | null;

  /**
   * The last item in this list.
   *
   * @type {?any}
   */
  get last(): V | null;

  /**
   * The array representation of this list.
   *
   * @returns {Array}
   */
  array(): V[];

  /**
   * Maps each element in this list.
   *
   * @param {Map} callbackFn The callback function.
   * @param {any} [thisArg] Optional binding for the callback.
   * @returns {any[]}
   */
  map<U>(callbackFn: Map<V, U>, thisArg?: unknown): U[];

  /**
   * Check whether a value exists in this list.
   *
   * @param {Predicate} predicate The predicate.
   * @param {any} [thisArg] Optional binding for the predicate.
   * @returns {boolean} true if the predicate returns true
   */
  exists(predicate: Predicate<V, boolean>, thisArg?: unknown): boolean;

  /**
   * Filters items that pass the predicate into a new list.
   *
   * @param {Filter} predicate The filter predicate.
   * @param {any} [thisArg] Optional binding for the predicate.
   */
  filter(predicate: Filter<V>, thisArg?: unknown): List<V>;

  /**
   * Finds a value in this list using the predicate.
   *
   * @param {Predicate} predicate The predicate.
   * @param {any} [thisArg] Optional binding for the predicate.
   */
  find(predicate: Predicate<V>, thisArg?: unknown): V | null;

  /**
   * Determines whether the specified callback function returns true for any element of an array.
   *
   * @param {Predicate} predicate The predicate.
   * @param {any} [thisArg] Optional binding for the predicate.
   */
  some(predicate: Predicate<V>, thisArg?: unknown): boolean;

  /**
   * Reduces this list into a single value.
   *
   * @param {Reducer} reducer The reducer function.
   * @param {any} acc The accumulator.
   * @param {any} [thisArg] Optional binding for the reducer function.
   * @returns {any}
   */
  reduce<A>(reducer: Reducer<A, V>, acc: A, thisArg?: unknown): A;

  /**
   * Clones this list.
   *
   * @returns {List}
   */
  clone(): List<V>;

  /**
   * Get the string representation of this collection.
   *
   * @returns {string}
   */
  toString(): string;
}

type Reducer<A, V> = (acc: A, value: V, index: number, list: List<V>) => A;
type Predicate<V, R = unknown> = (value: V, index: number, list: List<V>) => R;
type Filter<V> = Predicate<V, boolean>;
type Map<V, R> = Predicate<V, R>;

export class Pair<A, B> {
  /**
   * @param {?any} a The first value of this pair.
   * @param {?any} b The second value of this pair.
   */
  constructor(a?: A, b?: B);

  /**
   * The first value of this pair.
   *
   * @type {?any}
   */
  get a(): A | null;

  /**
   * The second value of this pair.
   *
   * @type {?any}
   */
  get b(): B | null;

  /**
   * Creates an immutable pair of values.
   *
   * @param {any} a Value A of the pair.
   * @param {any} b Value B of the pair.
   * @constructor
   */
  static Immutable<A, B>(a: A, b: B): Pair<A, B>;

  /**
   * Set the first value of this pair.
   *
   * @param {any} value The value.
   * @returns {Pair} this pair.
   */
  setA(value: A): this;

  /**
   * Set the second value of this pair.
   *
   * @param {any} value The value.
   * @returns {Pair} this pair.
   */
  setB(value: B): this;

  /**
   * Get the string representation of this pair.
   *
   * @type {string}
   */
  toString(): string;
}

export class AsyncQueue {
  /**
   * The remaining promises that are in the queue.
   *
   * @type {number}
   */
  get remaining(): number;

  /**
   * Waits for the last promise to resolve and queues a new one.
   *
   * @returns {Promise<void>}
   */
  wait(): Promise<void>;

  /**
   * Enqueues a new promise.
   *
   * @returns {Promise<void>}
   */
  enqueue(): void;

  /**
   * Frees the queue's lock so the next promise can resolve.
   *
   * @returns {void}
   */
  next(): void;
}

export class Bucket {
  /**
   * How many tokens the bucket has consumed in this interval.
   *
   * @type {number}
   */
  tokens: number;
  /**
   * Timestamp of last token cleaning.
   *
   * @type {number}
   */
  lastReset: number;
  /**
   * Timestamp of last token consumption.
   *
   * @type {number}
   */
  lastSend: number;
  /**
   * The max number tokens the bucket can consume per interval.
   *
   * @type {number}
   */
  tokenLimit: number;
  /**
   * How long (in ms) to wait between clearing used tokens.
   *
   * @type {number}
   */
  interval: number;
  /**
   * A latency reference object.
   *
   * @type {BucketLatencyRef}
   */
  latencyRef: BucketLatencyRef;
  /**
   * The number of reserved tokens.
   *
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
   *
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
  latency: number;
}

/**
 * @file modified version of https://github.com/Naval-Base/ms
 */
export enum Unit {
  NANOSECOND = 0.000001,
  MILLISECOND = 1,
  SECOND = 1000,
  MINUTE = 60000,
  HOUR = 3600000,
  DAY = 86400000,
  WEEK = 604800000,
  YEAR = 31557600000,
}

export class Duration {
  /**
   * Parses a number into a string.
   *
   * @param {number} number The number to parse.
   * @param {boolean} [long=false] Whether or not to return the long version.
   * @returns {string}
   */
  static parse(number: number, long?: boolean): string;
  /**
   * Parses a string into milliseconds.
   *
   * @param {string} string The string to parse.
   * @returns {number}
   */
  static parse(string: string): number;
}

export class Emitter implements EventEmitterLike {
  /**
   * Creates a new instanceof Emitter.
   */
  constructor();

  /**
   * Adds a listener to this emitter.
   *
   * @param {string} event The event to listen for.
   * @param {Listener} listener The event listener.
   * @returns {Emitter}
   */
  on(event: string | symbol, listener: Listener): this;

  /**
   * Adds a listener to this emitter then removes it when an event is dispatched.
   *
   * @param {string} event The event to listen for.
   * @param {Listener} listener The event listener.
   * @returns {Emitter}
   */
  once(event: string | symbol, listener: Listener): this;

  /**
   * Adds a listener to this emitter.
   *
   * @param {string} event The event to listen for.
   * @param {Listener} listener The event listener.
   * @returns {Emitter}
   */
  addListener(event: string | symbol, listener: Listener): this;

  /**
   * Removes a listener from an event.
   *
   * @param {string} event The event to remove the listener from.
   * @param {Listener} listener The listener to remove.
   * @returns {boolean}
   */
  removeListener(event: string | symbol, listener: Listener): boolean;

  /**
   * Dispatch an event.
   *
   * @param {string} event The event to dispatch.
   * @param {...any} [args] The arguments to provide.
   * @returns {number} The number of listeners that were successful
   */
  emit(event: string | symbol, ...args: any[]): number;

  /**
   * Get the total listener count of this emitter or of a single event.
   *
   * @param {string} [event] The event.
   * @returns {number} The amount of listeners for the event or all listeners.
   */
  listenerCount(event?: string | symbol): number;
}

export type Listener = (...args: any[]) => unknown;

export class Extender<S extends Dictionary<Class>> {
  /**
   * All of the structures that can be extended.
   *
   * @type {Map<string, Class>}
   */
  readonly structures: Map<keyof S, Class>;

  /**
   * @param {Dictionary} structures Pre-defined structures.
   */
  constructor(structures?: S);

  /**
   * Creates a new immutable extender.
   *
   * @param {Dictionary} structures The pre-defined structures.
   * @returns {Extender}
   * @constructor
   */
  static Immutable<S extends Dictionary<Class>>(structures: S): Extender<S>;

  /**
   * Adds a new structure to this extender.
   *
   * @param {string} name The name of this extender.
   * @param {any} structure The structure to add.
   * @returns {Extender}
   */
  add(name: string, structure: any): this;

  /**
   * Get a structure from this extender.
   *
   * @param {string} name The structures name.
   * @returns {Class}
   */
  get<K extends keyof S>(name: K): S[K];

  /**
   * Extend a defined structures.
   *
   * @param {string} name The structure to extend.
   * @param {ExtenderFunction} extender The extender function.
   * @returns {Promise<Extender>}
   */
  extend<K extends keyof S, E extends S[K]>(
    name: K,
    extender: ExtenderFunction<S[K], E>
  ): Promise<this>;
}

export type ExtenderFunction<S, E> = (base: S) => E | Promise<E>;

export type Class<T = any> = new (...args: any[]) => T;

export abstract class Timers {
  /**
   * Clears all of the current intervals and timeouts.
   */
  static clear(): void;

  /**
   * Set an interval.
   * @param {Fn} fn The function to call.
   * @param {number} delay The delay between each call.
   * @param {...any} [args] The args to pass.
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
   * @param {...any} args The args to pass.
   */
  static setTimeout(fn: Fn, delay: number, ...args: any[]): NodeJS.Timeout;

  /**
   * Clears an interval.
   * @param {NodeJS.Timeout} interval The interval to clear.
   */
  static clearTimeout(interval: NodeJS.Timeout): typeof Timers;
}

type Fn = (...args: any[]) => any;

/**
 * A helper function for determining whether something is a class.
 *
 * @param {any} input
 * @returns {boolean} Whether the input was a class.
 */
export function isClass(input: unknown): input is Class;

/**
 * A helper function for capitalizing the first letter in the sentence.
 *
 * @param {string} str
 * @param {boolean} [lowerRest=true]
 * @returns {string}
 */
export function capitalize(str: string, lowerRest?: boolean): string;

/**
 * A helper function for determining if a value is an event emitter.
 *
 * @param {any} input
 * @returns {boolean} Whether the input was an emitter.
 */
export function isEmitter(input: unknown): input is EventEmitterLike;

/**
 * Returns an array.
 *
 * @template {T} The value.
 *
 * @param {T[] | T[]} value
 * @returns {T[]}
 */
export function array<T>(value: T | T[]): T[];

/**
 * A helper function for determining if a value is a string.
 *
 * @param {any} input
 * @returns {boolean} Whether the input was a string.
 */
export function isString(input: unknown): input is string;

/**
 * A helper function for determining whether or not a value is a promise,
 *
 * @param {any} input
 * @returns {boolean} Whether the input was a promise.
 */
export function isPromise<V = unknown>(input: unknown): input is Promise<V>;

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
): obj is O & Required<Pick<O, K>>;

/**
 * Pauses the event loop for a set duration of time.
 *
 * @param {number} ms The duration in milliseconds.
 * @returns {Promise<NodeJS.Timeout>}
 */
export function sleep(ms: number): Promise<NodeJS.Timeout>;

/**
 * Walks a directory.
 *
 * @param {string} directory The directory to walk.
 * @param {WalkOptions} options Options for declaring the depth and extensions.
 * @returns {string[]} The found files.
 */
export function walk(directory: string, options?: WalkOptions): string[];

/**
 * Merges objects into one.
 *
 * @param {Dictionary} objects The objects to merge.
 */
export function mergeObjects<
  O extends Record<PropertyKey, any> = Record<PropertyKey, any>
>(...objects: Partial<O>[]): O;

/**
 * Determines whether a value in an object.
 * @param input
 */
export function isObject(input: unknown): input is Dictionary;

/**
 * Calls Object#defineProperty on a method or property.
 *
 * @param {PropertyDescriptor} descriptor The descriptor to pass.
 */
export function define(descriptor: PropertyDescriptor): PropertyDecorator;

/**
 * Flatten an object.
 *
 * @param {Record<PropertyKey, any>} obj
 * @param {...any} [props] The properties to include.
 * @returns {Record<PropertyKey, any>}
 */
export function flatten(
  obj: any,
  ...props: PropertyKey[]
): Record<PropertyKey, any>;

export interface WalkOptions {
  depth?: number;
  extensions?: string[];
}

/**
 * @file Originally made by the dirigeants team.
 */
export class Type {
  /**
   * The value to generate a deep type of.
   *
   * @type {any}
   */
  value: unknown;
  /**
   * The shallow type of the value.
   *
   * @type {string}
   */
  is: string;

  /**
   * @param {any} value The value to generate a type of.
   * @param {Type | null} [parent] The parent type.
   */
  constructor(value: unknown, parent?: Type | null);

  /**
   * Resolves the type name that defines the input.
   *
   * @param {any} value The value to get the type name of.
   * @returns {string}
   */
  static resolve(value: any): string;

  /**
   * Get the string representation of this Type.
   *
   * @returns {string}
   */
  toString(): string;
}
