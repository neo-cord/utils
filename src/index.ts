/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import type { EventEmitter } from "events";
import type { Emitter } from "./utility/Emitter";

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
  type EventEmitterLike = Emitter | EventEmitter;
  type Tuple<L = any, R = any> = [ L, R ];
}
