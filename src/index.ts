/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import type { EventEmitter } from "events";
import type { Emitter } from "./classes/Emitter";

export { Timers } from "./classes/Timers";
export { Extender, Class } from "./classes/Extender";
export { Bucket } from "./classes/Bucket";
export { AsyncQueue } from "./classes/AsyncQueue";
export { Emitter } from "./classes/Emitter";
export { Snowflake, DiscordSnowflake } from "./classes/Snowflake";
export { Collection } from "./classes/Collection";
export { Duration, Unit } from "./classes/Duration";
export { BitField, BitFieldObject, BitFieldResolvable } from "./classes/Bitfield";
export * from "./functions";

declare global {
  // @ts-ignore
  type Dictionary<V = any> = Record<string, V>;
  // @ts-ignore
  type EventEmitterLike = Emitter | EventEmitter
  // @ts-ignore
  type Tuple<L = any, R = any> = [ L, R ];
}