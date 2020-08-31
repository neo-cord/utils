/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

const EPOCH = 1420070400000n;

export class Snowflake {
  /**
   * The snowflake.
   */
  public readonly id: BigInt;

  /**
   * The timestamp in which this snowflake was created.
   */
  public readonly timestamp: number;

  /**
   * The worker id that generated this snowflake.
   */
  public readonly workerId: number;

  /**
   * The ID of the process that generated this snowflake.
   */
  public readonly processId: number;

  /**
   * The increment stored in the snowflake.
   */
  public readonly increment: number;

  /**
   * Creates a new Snowflake.
   * @param id
   */
  public constructor(id: string | BigInt) {
    const _id = this.id = BigInt(id);
    this.timestamp = Number((_id >> 22n) + EPOCH);
    this.workerId = Number((_id >> 17n) & 0b11111n);
    this.processId = Number((_id >> 12n) & 0b11111n);
    this.increment = Number(_id & 0b111111111111n);
  }

  /**
   * When this snowflake was created.
   */
  public get createdAt(): Date {
    return new Date(this.timestamp);
  }

  /**
   * The snowflake as binary.
   */
  public get binary(): string {
    return this.id.toString(2).padStart(64, "0");
  }

  /**
   * Resolves a snowflake into an object.
   * @param id The ID to resolve.
   */
  public static resolve(id: string | BigInt): DiscordSnowflake {
    return new (this)(id).toJSON();
  }

  /**
   * Get the snowflake as a string.
   */
  public toString(): string {
    return this.id.toString();
  }

  /**
   * JSON representation of this snowflake.
   */
  public toJSON(): DiscordSnowflake {
    return {
      id: `${this}`,
      increment: this.increment,
      workerId: this.workerId,
      processId: this.processId,
      timestamp: this.timestamp
    };
  }
}

export interface DiscordSnowflake {
  id: string;
  timestamp: number;
  workerId: number;
  processId: number;
  increment: number;
}
