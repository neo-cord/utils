/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import { BitField, BitFieldObject } from "../Bitfield";

export enum MessageFlag {
  /**
   * This message has been published to subscribed channels (via Channel Following).
   */
  Crossposted = 1 << 0,

  /**
   * This message originated from a message in another channel (via Channel Following).
   */
  IsCrosspost = 1 << 1,

  /**
   * Do not include any embeds when serializing this message.
   */
  SuppressEmbeds = 1 << 2,

  /**
   * The source message for this crosspost has been deleted (via Channel Following).
   */
  SourceMessageDeleted = 1 << 3,

  /**
   * This message came from the urgent message system.
   *
   * @type {number}
   */
  Urgent = 1 << 4,
}

export class MessageFlags extends BitField<MessageFlagResolvable> {}

type MessageFlagBit =
  | MessageFlag
  | keyof typeof MessageFlag
  | number
  | BitFieldObject;
export type MessageFlagResolvable = MessageFlagBit | MessageFlagBit[];
