"use client";

import { cn } from "@/lib/utils";
import { parseDateString } from "@/utils/helpers/client-helper";
import {
  isPendingMessage,
  isSentMessage,
  type Message,
} from "@/utils/types/server-response.type";
import { EllipsisVertical, Pen, Reply, Trash2 } from "lucide-react";
import { useState, use } from "react";
import { ChatStateContext } from "../providers/chat-state.provider";

interface Props {
  message: Message;
  sentByMe: boolean;
}

const MessageMenu = ({ message, sentByMe }: Props) => {
  const iconSize = 18;
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const { setChatState } = use(ChatStateContext);
  if (isSentMessage(message))
    return (
      <>
        <div
          className={cn(
            "absolute bottom-1 hidden group-hover:flex text-black items-center",
            {
              "-left-16": sentByMe,
              "-right-16 flex-row-reverse": !sentByMe,
              flex: isMenuOpened,
            },
          )}
        >
          <div className="relative">
            <button
              className={cn(
                "hover:bg-black/6 p-1 rounded-full transition-all [&:hover,&:active]:scale-110",
                isMenuOpened && "text-theme scale-110 bg-theme/10!",
              )}
              type="button"
              onClick={() => setIsMenuOpened(!isMenuOpened)}
            >
              <EllipsisVertical size={iconSize} />
            </button>
            {isMenuOpened && (
              <div
                className={cn(
                  "absolute z-10 flex flex-col gap-2 text-sm bg-neutral-50 bottom-0  p-2 rounded-md min-w-42 shadow-lg",
                  { "left-8": !sentByMe, "right-8": sentByMe },
                )}
              >
                <div className="flex gap-1 text-xs opacity-85">
                  <p className="">
                    {parseDateString({
                      dateString: message.created_at,
                      fullDate: true,
                    })}
                  </p>
                  {((isSentMessage(message) && message.is_edited) ||
                    isPendingMessage(message)) && <p>·</p>}
                  {isSentMessage(message) && message.is_edited && <p>Edited</p>}
                  {isPendingMessage(message) && <p>Sending</p>}
                </div>

                <div className="flex flex-col gap-0.5 py-1 border-y border-neutral-300 *:flex *:items-center *:justify-between *:hover:bg-black/6 *:py-1.5 *:px-3 *:rounded-md ">
                  <button type="button" className="">
                    Edit <Pen size={iconSize} />
                  </button>
                </div>
                <button
                  type="button"
                  className="text-red-500 py-1.5 flex items-center justify-between hover:bg-black/6 px-3 rounded-md"
                >
                  Delete <Trash2 size={iconSize} />
                </button>
              </div>
            )}
          </div>

          <button
            className="hover:bg-black/6 p-1 rounded-full transition-all [&:hover,&:active]:scale-110"
            type="button"
            onClick={() =>
              setChatState({ mode: "reply", messageObject: message })
            }
          >
            <Reply size={iconSize} />
          </button>
        </div>
      </>
    );
};

export default MessageMenu;
