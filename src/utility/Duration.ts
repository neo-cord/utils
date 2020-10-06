/**
 * @file modified version of https://github.com/Naval-Base/ms
 */

import { Collection } from "../store/Collection";

export enum Unit {
  NANOSECOND = 1 / 1e6,
  MILLISECOND = 1,
  SECOND = 1000,
  MINUTE = SECOND * 60,
  HOUR = MINUTE * 60,
  DAY = HOUR * 24,
  WEEK = DAY * 7,
  YEAR = DAY * 365.25,
}

const separators = [" ", ".", ",", "-"];
const regex = /^(-?(?:\d+)?\.?\d+)\s*([a-z]+)?$/;

export class Duration {
  private static conversions = new Collection<string[], number>([
    [["years", "year", "yrs", "yr", "y"], Unit.YEAR],
    [["weeks", "week", "wks", "wk", "w"], Unit.WEEK],
    [["days", "day", "d"], Unit.DAY],
    [["hours", "hour", "hrs", "hr", "h"], Unit.HOUR],
    [["minutes", "minute", "mins", "min", "m"], Unit.MINUTE],
    [["seconds", "second", "secs", "sec", "s"], Unit.SECOND],
    [["milliseconds", "millisecond", "ms"], Unit.MILLISECOND],
    [["nanoseconds", "nanosecond", "ns"], Unit.NANOSECOND],
  ]);

  /**
   * Parses a number into a string.
   * @param {number} number The number to parse.
   * @param {boolean} [long=false] Whether or not to return the long version.
   */
  public static parse(number: number, long?: boolean): string;
  /**
   * Parses a string into milliseconds.
   * @param string The string to parse.
   */
  public static parse(string: string): number;

  /**
   * Parses a string or number into a string or milliseconds.
   * @param {number | string} value The string or number to parse.
   * @param {boolean} [long=false] Whether to format the number longer.
   */
  public static parse(value: string | number, long = false): number | string {
    let abs,
      ms = 0;
    if (typeof value === "string" && value.length) {
      if (value.length < 101) {
        const units = Duration._tokenize(value.toLowerCase());
        for (const unit of units) {
          const fmt = regex.exec(unit);
          if (fmt) {
            abs = parseFloat(fmt[1]);
            ms += this._convert(abs, fmt[2]);
          }
        }

        return ms;
      }
    }

    if (typeof value === "number" && isFinite(value)) {
      abs = Math.abs(value);
      if (abs >= Unit.DAY)
        return Duration._pluralize(value, Unit.DAY, ["d", "day"], long);
      if (abs >= Unit.HOUR)
        return Duration._pluralize(value, Unit.HOUR, ["h", "hour"], long);
      if (abs >= Unit.MINUTE)
        return Duration._pluralize(value, Unit.MINUTE, ["m", "minute"], long);
      if (abs >= Unit.SECOND)
        return Duration._pluralize(value, Unit.SECOND, ["s", "second"], long);
      if (abs >= Unit.MILLISECOND)
        return Duration._pluralize(
          value,
          Unit.MILLISECOND,
          ["ms", "millisecond"],
          long
        );
      return `${value}${long ? " nanoseconds" : "ns"}`;
    }

    throw new Error("Value is an empty string or an invalid number");
  }

  /**
   * Tokenizes an input string.
   * @param {string} str
   * @private
   */
  private static _tokenize(str: string): string[] {
    const units = [];

    let buf = "",
      letter = false;
    for (const char of str) {
      if (separators.includes(char)) buf += char;
      else if (isNaN(parseInt(char, 10))) {
        buf += char;
        letter = true;
      } else {
        if (letter) {
          units.push(buf.trim());
          buf = "";
        }

        letter = false;
        buf += char;
      }
    }

    if (buf.length) {
      units.push(buf.trim());
    }

    return units;
  }

  /**
   * @private
   */
  private static _convert(num: number, unit: string): number {
    return (
      (Duration.conversions.find((_v, k) => k.includes(unit)) as number) * num
    );
  }

  /**
   * @private
   */
  private static _pluralize(
    ms: number,
    base: number,
    types: Tuple<string, string>,
    long = false
  ): string {
    const plural = Math.abs(ms) >= base * 1.5;
    return `${Math.round(ms / base)}${
      long ? ` ${types[1]}${plural ? "s" : ""}` : types[0]
    }`;
  }
}
