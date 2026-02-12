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
import {
  removeAttachment,
  uploadAttachment,
} from "@/utils/helpers/client-helper";
import { Attachment } from "@/utils/types/server-response.type";

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

  const getAttachmentsId = (attachments: AttachmentState[]) => {
    const attachmentIds: number[] = [];
    attachments.forEach((attachment) => {
      if (attachment.uploadStatus === "success") {
        attachmentIds.push(attachment.attachmentId);
      }
    });
    return attachmentIds;
  };

  useEffect(() => {
    const beforeWindowUnloadHandler = (event: BeforeUnloadEvent) => {
      const uploadedAttachmentIds = getAttachmentsId(attachments);
      removeAttachment(uploadedAttachmentIds, true);
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", beforeWindowUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeWindowUnloadHandler);
    };
  }, [attachments]);

  return (
    <div className="flex flex-col gap-4 py-2 px-6 md:px-8">
      {attachments.length > 0 && (
        <div className="flex overflow-x-auto gap-2 w-full">
          {attachments.map((attachment) => (
            <AttachmentPreview
              key={attachment.file.lastModified}
              attachment={attachment.file}
              uploadStatus={attachment.uploadStatus}
              onRemove={() => {
                if (attachment.uploadStatus === "success")
                  removeAttachment([attachment.attachmentId]);

                setAttachments((prev) =>
                  prev.filter(
                    (prevAttachment) => prevAttachment.file !== attachment.file,
                  ),
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
                attachmentsId: getAttachmentsId(attachments),
              });
            }
            setChatState({ mode: "chat", messageObject: null });
            setAttachments([]);
            setInputValue("");

            queryClient.setQueryData(
              messageQueryOption(roomName).queryKey,
              (old) => {
                if (!old) return old;
                const newData = structuredClone(old);
                const now = new Date().toString();
                if (chatState.mode !== "edit")
                  newData.pages[0].results = [
                    {
                      body: inputValue,
                      uuid,
                      attachments: attachments.map((attachment) => {
                        const kind = attachment.file.type.split("/")[0];
                        return {
                          id: 0,
                          filename: attachment.file.name,
                          path: "",
                          url: URL.createObjectURL(attachment.file),
                          mime_type: attachment.file.type,
                          size: attachment.file.size,
                          kind:
                            kind in ["image", "audio", "video"]
                              ? (kind as Attachment["kind"])
                              : "document",
                          uploaded_at: now,
                        };
                      }),
                      reply_to:
                        chatState.mode === "reply"
                          ? { ...chatState.messageObject!, sender: "You" }
                          : null,
                      created_at: now,
                    },
                    ...newData.pages[0].results,
                  ];

                return newData;
              },
            );

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
              {socketState.is_connecting ? (
                <LoaderCircle className="animate-spin" size={iconSize} />
              ) : (
                <Send size={iconSize} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputBox;
