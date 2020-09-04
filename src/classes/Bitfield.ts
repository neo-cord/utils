/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

export class BitField<T extends BitFieldResolvable> implements BitFieldObject {
  /**
   * Flags for this BitField (Should be implemented in child classes)
   */
  public static FLAGS: any = {} as const;

  /**
   * The default flags for the bitfield
   */
  public static DEFAULT = 0;

  /**
   * The bitfield data
   */
  public bitmask: number;

  /**
   * @param bits
   */
  public constructor(bits?: T) {
    const constructor = this.constructor as typeof BitField;
    this.bitmask = constructor.resolve<T>(bits);
  }

  /**
   * The value of all bits in this bitfield
   */
  public static get ALL(): number {
    return Object.values<number>(this.FLAGS).reduce((all, byte) => all | byte, 0);
  }

  /**
   * Resolves a BitFieldResolvable into a number
   * @param bit The bit/s to resolve
   */
  public static resolve<T extends BitFieldResolvable>(bit?: T): number {
    if (typeof bit === "undefined") return 0;
    if (typeof bit === "number" && bit >= 0) return bit;
    if (bit instanceof BitField) return bit.bitmask;
    if (Array.isArray(bit)) return (bit as (string | number | BitFieldObject)[]).map((byte) => this.resolve(byte)).reduce((bytes, byte) => bytes | byte, 0);
    if (typeof bit === "string") return this.FLAGS[bit];

    throw new RangeError(`An invalid bit was provided. Received: ${typeof bit}`);
  }

  /**
   * Checks whether the bitfield has a bit, or any of multiple bits.
   * @param bit Bit(s) to check for
   */
  public any(bit: T): boolean {
    return (this.bitmask & BitField.resolve(bit)) !== 0;
  }

  /**
   * Checks if this BitField matches another bitfield resolvable
   * @param bit The bit/s to check
   */
  public equals(bit: T): boolean {
    const constructor = this.constructor as typeof BitField;
    return this.bitmask === constructor.resolve(bit);
  }

  /**
   * Checks if this BitField has a bit or bits
   * @param bit The bit/s to check
   * @param hasParams
   */
  public has(bit: T, ...hasParams: any[]): boolean {
    const constructor = this.constructor as typeof BitField;
    if (Array.isArray(bit)) return (bit as (T)[]).every((byte) => this.has(byte, ...hasParams));
    const bits = constructor.resolve<T>(bit);
    return (this.bitmask & bits) === bits;
  }

  /**
   * Returns any bits this BitField is missing
   * @param bits The bit/s to check for
   * @param hasParams Additional params to pass to child has methods
   */
  public missing(bits: T, ...hasParams: any[]): string[] {
    const constructor = this.constructor as typeof BitField;
    const strings = new constructor(bits).toArray(false);
    return strings.filter((byte) => !this.has(byte as T, ...hasParams));
  }

  /**
   * Freezes this BitField
   */
  public freeze(): this {
    return Object.freeze(this);
  }

  /**
   * Adds a bit to this BitField or a new Bitfield if this is frozen
   * @param bits The bit/s to add
   */
  public add(...bits: T[]): BitField<T> {
    const constructor = this.constructor as typeof BitField;
    let total = 0;

    for (const bit of bits) total |= constructor.resolve<T>(bit);
    if (Object.isFrozen(this)) return new constructor<T>((this.bitmask | total) as T);

    this.bitmask |= total;
    return this;
  }

  /**
   * Removes a bit to this BitField or a new Bitfield if this is frozen
   * @param bits The bit/s to remove
   */
  public remove(...bits: T[]): BitField<T> {
    const constructor = this.constructor as typeof BitField;
    let total = 0;

    for (const bit of bits) total |= constructor.resolve<T>(bit);
    if (Object.isFrozen(this)) return new constructor<T>((this.bitmask & ~total) as T);

    this.bitmask &= ~total;
    return this;
  }

  /**
   * Returns only the bits in common between this bitfield and the passed bits.
   * @param bits The bit/s to mask
   */
  public mask(...bits: T[]): BitField<T> {
    const total = bits.reduce((acc, bit) => acc | (this.constructor as typeof BitField).resolve<T>(bit), 0);
    if (Object.isFrozen(this)) return new (this.constructor as typeof BitField)<T>((this.bitmask & total) as T);
    this.bitmask &= total;
    return this;
  }

  /**
   * Returns an object of flags: boolean
   * @param hasParams Additional params to pass to child has methods
   */
  public serialize(...hasParams: any[]): Record<string, boolean> {
    const constructor = this.constructor as typeof BitField;
    const serialized: Record<string, boolean> = {};
    for (const bit of Object.keys(constructor.FLAGS)) serialized[bit] = this.has(bit as T, ...hasParams);
    return serialized;
  }

  /**
   * Returns an array of Flags that make up this BitField
   * @param hasParams Additional params to pass to child has methods
   */
  public toArray(...hasParams: any[]): string[] {
    const constructor = this.constructor as typeof BitField;
    return Object.keys(constructor.FLAGS).filter((bit) => this.has(bit as T, ...hasParams));
  }

  /**
   * Defines what this Bitfield is when converted to JSON
   * @since 1.0.0
   */
  public toJSON(): number {
    return this.bitmask;
  }

  /**
   * Defines value behavior of this BitField
   * @since 1.0.0
   */
  public valueOf(): number {
    return this.bitmask;
  }
}

export interface BitFieldObject {
  bitmask: number;
}

export type BitFieldResolvable =
  keyof typeof BitField.FLAGS
  | number
  | BitFieldObject
  | ((keyof typeof BitField.FLAGS) | number | BitFieldObject)[];
