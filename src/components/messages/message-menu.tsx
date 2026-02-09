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
import { ChatSocketControlsContext } from "../providers/chatroom-state.provider";

interface Props {
  message: Message;
  sentByMe: boolean;
}

const MessageMenu = ({ message, sentByMe }: Props) => {
  const iconSize = 18;
  const DELETE_GRACE_PERIOD = 60 * 30 * 1000;
  const hasSurpassedGracePeriod =
    new Date(message.created_at).getTime() <
    new Date().getTime() - DELETE_GRACE_PERIOD;
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const { setChatState } = use(ChatStateContext);
  const chatControls = use(ChatSocketControlsContext);
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
                  "absolute z-10 flex flex-col gap-2 text-sm bg-stone-50 bottom-0  p-2 rounded-md w-fit min-w-42 shadow-lg",
                  { "left-8": !sentByMe, "right-8": sentByMe },
                )}
              >
                <div className="flex gap-1 text-xs opacity-85 whitespace-nowrap">
                  <p>
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

                {sentByMe && (
                  <>
                    <div className="flex flex-col gap-0.5 py-1 border-y border-neutral-300 *:flex *:items-center *:justify-between *:hover:bg-black/6 *:py-1.5 *:px-3 *:rounded-md *:disabled:opacity-60">
                      <button
                        onClick={() => {
                          setChatState({
                            mode: "edit",
                            messageObject: message,
                          });
                          setIsMenuOpened(false);
                        }}
                        type="button"
                        className=""
                        disabled={hasSurpassedGracePeriod}
                      >
                        Edit <Pen size={iconSize} />
                      </button>
                      <button
                        onClick={() => {
                          chatControls?.delete(message.uuid);
                          setIsMenuOpened(false);
                        }}
                        disabled={hasSurpassedGracePeriod}
                        type="button"
                        className="text-red-500"
                      >
                        Delete <Trash2 size={iconSize} />
                      </button>
                    </div>

                    <p className=" text-[10px] opacity-60 self-center text-center">
                      * messages cannot be deleted or edited after 30 minutes
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            className="hover:bg-black/6 p-1 rounded-full transition-all [&:hover,&:active]:scale-110"
            type="button"
            onClick={() => {
              setChatState({ mode: "reply", messageObject: message });
            }}
          >
            <Reply size={iconSize} />
          </button>
        </div>
      </>
    );
};

export default MessageMenu;
