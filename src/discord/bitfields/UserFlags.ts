/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import { BitField, BitFieldObject } from "../Bitfield";

export enum UserFlag {
  DiscordEmployee = 1 << 0,
  DiscordPartner = 1 << 1,
  HypeSquadEvents = 1 << 2,
  BugHunterLevelOne = 1 << 3,
  HouseBravery = 1 << 6,
  HouseBrilliance = 1 << 7,
  HouseBalance = 1 << 8,
  EarlySupporter = 1 << 9,
  TeamUser = 1 << 10,
  System = 1 << 12,
  BugHunterLevelTwo = 1 << 14,
  VerifiedBot = 1 << 16,
  VerifiedBotDeveloper = 1 << 17,
}

export class UserFlags extends BitField<UserFlagResolvable> {}

type UserFlagBit = UserFlag | keyof typeof UserFlag | number | BitFieldObject;
export type UserFlagResolvable = UserFlagBit | UserFlagBit[];
