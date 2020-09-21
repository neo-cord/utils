/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import type { EventEmitter } from "events";

import { Duration } from "./classes/Duration";
import { Timers } from "./classes/Timers";
import { Emitter } from "./classes/Emitter";
import { Snowflake } from "./classes/Snowflake";

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
  // @ts-ignore
  type Dictionary<V = any> = Record<string, V>;
  // @ts-ignore
  type EventEmitterLike = Emitter | EventEmitter;
  // @ts-ignore
  type Tuple<L = any, R = any> = [L, R];
}

const emitter = new Emitter().on(
  "xd",
  console.log.bind(console, "33231212121")
);

emitter.emit("xd");

console.log(Duration.parse("3m"));

Timers.setTimeout(() => console.log("xd"), 2000);
console.log(Snowflake.deconstruct("396096412116320258"));
