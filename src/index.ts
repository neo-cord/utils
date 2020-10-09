/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

export * from "./discord/bitfields/Intents";
export * from "./discord/bitfields/MessageFlags";
export * from "./discord/bitfields/Permissions";
export * from "./discord/bitfields/UserFlags";
export * from "./discord/Bitfield";
export * from "./discord/Snowflake";

export * from "./store/Collection";
export * from "./store/List";
export * from "./store/Pair";

export * from "./utility/AsyncQueue";
export * from "./utility/Bucket";
export * from "./utility/Duration";
export * from "./utility/Emitter";
export * from "./utility/Extender";
export * from "./utility/Timers";
export * from "./utility/functions";
export * from "./utility/Type";

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
