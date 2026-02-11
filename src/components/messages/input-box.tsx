"use client";

import { LoaderCircle, Paperclip, Send } from "lucide-react";
import { use, useRef, useState, useEffect } from "react";
import throttle from "lodash.throttle";
import FileUpload from "../form/file-upload";
import AttachmentPreview from "./attachment-preview";
import {
  ChatSocketControlsContext,
  CurrentRoomNameContext,
} from "../providers/chatroom-state.provider";
import TextArea from "../form/text-area";
import { useQueryClient } from "@tanstack/react-query";
import { messageQueryOption } from "@/utils/queryOptions";
import { ChatStateContext } from "../providers/chat-state.provider";
import { ReplyMessageCardWithCancel } from "./reply-message-card";
import EditMessageCard from "./edit-message-card";
import { UUID } from "crypto";
import useSocketState from "@/hooks/useSocketState.hook";
import { uploadAttachment } from "@/utils/helpers/client-helper";

type AttachmentState = {
  file: File;
} & (
  | { uploadStatus: "pending" }
  | { uploadStatus: "success"; attachmentId: number }
  | { uploadStatus: "error"; errorMessage: string }
);

const InputBox = () => {
  const chatsocketControls = use(ChatSocketControlsContext)!;
  const socketState = useSocketState();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [attachments, setAttachments] = useState<AttachmentState[]>([]);
  const queryClient = useQueryClient();
  const roomName = use(CurrentRoomNameContext);
  const { chatState, setChatState } = use(ChatStateContext);
  const iconSize = 22;

  useEffect(() => {});
  return (
    <div className="flex flex-col gap-4 py-2 px-6 md:px-8">
      {attachments.length > 0 && (
        <div className="flex overflow-x-auto gap-2 w-full">
          {attachments.map((attachment) => (
            <AttachmentPreview
              key={attachment.file.lastModified}
              attachment={attachment.file}
              onRemove={() => {
                setAttachments((prev) =>
                  prev.filter((file) => file !== attachmentFile),
                );
              }}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col">
        {chatState.mode === "reply" && chatState.messageObject ? (
          <ReplyMessageCardWithCancel
            {...chatState.messageObject}
            sender="You"
            onCancel={() => setChatState({ mode: "chat", messageObject: null })}
          />
        ) : chatState.mode === "edit" && chatState.messageObject ? (
          <EditMessageCard
            body={chatState.messageObject.body}
            onCancel={() => setChatState({ mode: "chat", messageObject: null })}
          />
        ) : null}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!inputValue) return;
            let uuid: UUID;
            if (chatState.mode == "edit" && chatState.messageObject) {
              chatsocketControls.update(
                chatState.messageObject.uuid,
                inputValue,
              );
            } else {
              uuid = chatsocketControls.send({
                message: inputValue,
                replyToId:
                  chatState.mode === "reply"
                    ? chatState.messageObject?.id
                    : undefined,
              });
            }
            setChatState({ mode: "chat", messageObject: null });
            queryClient.setQueryData(
              messageQueryOption(roomName).queryKey,
              (old) => {
                if (!old) return old;
                const newData = structuredClone(old);
                if (chatState.mode !== "edit")
                  newData.pages[0].results = [
                    {
                      body: inputValue,
                      uuid,
                      attachment: null,
                      reply_to:
                        chatState.mode === "reply"
                          ? { ...chatState.messageObject!, sender: "You" }
                          : null,
                      created_at: new Date().toString(),
                    },
                    ...newData.pages[0].results,
                  ];

                return newData;
              },
            );

            setInputValue("");
            if (inputRef.current) {
              inputRef.current.focus();
              inputRef.current.style.height = "auto";
            }
          }}
          className="flex items-center rounded-xl py-0.5 px-2 text-sm bg-neutral-100 border border-neutral-500/10"
        >
          <TextArea
            name="chat-message-input"
            ref={inputRef}
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
              throttle(() => {
                chatsocketControls?.typing();
              }, 1000)();
            }}
          />
          <div className="flex gap-1 md:gap-2 self-end items-center *:p-2 *:[&:hover,&:active]:text-theme *:[&:hover,&:active]:scale-110 *:rounded-full *:transition-all">
            <FileUpload
              onUpload={(files) => {
                const newAttachments: AttachmentState[] = [];
                files?.forEach((file) => {
                  const onUploadComplete = (attachmentId: number) => {
                    setAttachments((prev) =>
                      prev.map((attachment) => {
                        if (attachment.file === file) {
                          return {
                            ...attachment,
                            uploadStatus: "success",
                            attachmentId,
                          };
                        }
                        return attachment;
                      }),
                    );
                  };
                  const onUploadError = (errorMessage: string) => {
                    setAttachments((prev) =>
                      prev.map((attachment) => {
                        if (attachment.file === file) {
                          return {
                            ...attachment,
                            uploadStatus: "error",
                            errorMessage,
                          };
                        }
                        return attachment;
                      }),
                    );
                  };
                  uploadAttachment(file, onUploadComplete, onUploadError);
                  newAttachments.push({ file, uploadStatus: "pending" });
                });
                setAttachments((prev) => [...newAttachments, ...prev]);
              }}
              labelChildren={<Paperclip size={iconSize} />}
              multiple
            />
            {socketState.is_connecting ? (
              <LoaderCircle
                className="animate-spin opacity-75"
                size={iconSize}
              />
            ) : (
              <button
                disabled={
                  !socketState.is_connected ||
                  attachments.some(
                    (attachment) =>
                      attachment.uploadStatus === "pending" ||
                      attachment.uploadStatus === "error",
                  )
                }
                type="submit"
                className="disabled:opacity-60"
              >
                <Send size={iconSize} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputBox;
