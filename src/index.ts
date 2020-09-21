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
export { Snowflake, DeconstructedSnowflake } from "./classes/Snowflake";
export { Collection } from "./classes/Collection";
export { Duration, Unit } from "./classes/Duration";
export {
  BitField,
  BitFieldObject,
  BitFieldResolvable,
} from "./classes/Bitfield";
export * from "./functions";

declare global {
  type Dictionary<V = any> = Record<string, V>;
  type EventEmitterLike = Emitter | EventEmitter;
  type Tuple<L = any, R = any> = [L, R];
}
