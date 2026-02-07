"use client";

import { Paperclip, Send } from "lucide-react";
import { use, useRef, useState } from "react";
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

const InputBox = () => {
  const chatsocketControls = use(ChatSocketControlsContext)!;

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();
  const roomName = use(CurrentRoomNameContext);

  return (
    <div className="flex flex-col gap-4 py-2 px-6 md:px-8">
      <div className="flex overflow-x-auto gap-2 w-full">
        {attachmentFiles.map((attachmentFile) => (
          <AttachmentPreview
            key={attachmentFile.lastModified}
            attachment={attachmentFile}
            onRemove={() => {
              setAttachmentFiles((prev) =>
                prev.filter((file) => file !== attachmentFile),
              );
            }}
          />
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!inputValue) return;
          const uuid = chatsocketControls.send(inputValue);
          queryClient.setQueryData(
            messageQueryOption(roomName).queryKey,
            (old) => {
              if (!old) return old;
              const newData = structuredClone(old);

              newData.pages[0].results = [
                {
                  body: inputValue,
                  uuid,
                  attachment: null,
                  reply_to: null,
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
              if (files) setAttachmentFiles((prev) => [...files, ...prev]);
            }}
            labelChildren={<Paperclip size={22} />}
            multiple
          />
          <button type="submit">
            <Send size={22} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputBox;
