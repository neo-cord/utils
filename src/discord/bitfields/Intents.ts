/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import { BitField, BitFieldObject } from "../Bitfield";

export enum Intent {
  Guilds = 1 << 0,
  GuildMembers = 1 << 1,
  GuildBans = 1 << 2,
  GuildEmojis = 1 << 3,
  GuildIntegrations = 1 << 4,
  GuildWebhooks = 1 << 5,
  GuildInvites = 1 << 6,
  GuildVoiceStates = 1 << 7,
  GuildPresences = 1 << 8,
  GuildMessages = 1 << 9,
  GuildMessageReactions = 1 << 10,
  GuildMessageTyping = 1 << 11,
  DirectMessages = 1 << 12,
  DirectMessageReactions = 1 << 13,
  DirectMessageTyping = 1 << 14,
}

export class Intents extends BitField<IntentResolvable> {
  /**
   * All intents that were provided by discord.
   *
   * @type {Intent}
   */
  public static FLAGS = Intent;

  /**
   * All privileged intents ORed together.
   *
   * @type {number}
   */
  public static PRIVILEGED = Intent.GuildMembers | Intent.GuildPresences;

  /**
   * All of the non-privileged intents.
   *
   * @type {number}
   */
  public static NON_PRIVILEGED = Intents.ALL & ~Intents.PRIVILEGED;

  /**
   * Intents recommended by NeoCord.
   *
   * @type {number}
   */
  public static DEFAULT =
    Intent.Guilds |
    Intent.GuildMessages |
    Intent.GuildBans |
    Intent.GuildEmojis |
    Intent.GuildInvites |
    Intent.GuildVoiceStates |
    Intent.DirectMessages;
}

type IntentBit = Intent | keyof typeof Intent | number | BitFieldObject;
export type IntentResolvable = IntentBit | IntentBit[];
