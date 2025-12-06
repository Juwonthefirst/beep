"use client";

import { Paperclip, Send } from "lucide-react";
import { use, useRef, useState } from "react";
import throttle from "lodash.throttle";
import FileUpload from "../form/file-upload";
import AttachmentPreview from "./attachment-preview";
import { ChatSocketControlsContext } from "../providers/chatroom-state.provider";

const InputBox = () => {
  const chatsocketControls = use(ChatSocketControlsContext);

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);

  return (
    <div className="flex flex-col gap-4 py-2 px-6 md:px-8">
      <div className="flex overflow-auto gap-2">
        {attachmentFiles.map((attachmentFile) => (
          <AttachmentPreview
            key={attachmentFile.name}
            attachment={attachmentFile}
            onRemove={() => {
              setAttachmentFiles((prev) =>
                prev.filter((file) => file !== attachmentFile)
              );
            }}
          />
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!inputValue) return;
          chatsocketControls?.send(inputValue);
          setInputValue("");
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.style.height = "auto";
          }
        }}
        className="flex items-center rounded-xl py-0.5 px-2 text-sm bg-neutral-100 border border-neutral-500/10"
      >
        <textarea
          name="chat-message-input"
          ref={inputRef}
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
            throttle(() => {
              chatsocketControls?.typing();
            }, 1000)();
            event.target.style.height = "auto";
            event.target.style.height = event.target.scrollHeight + "px";
          }}
          className="focus:outline-0 w-full resize-none overflow-y-auto max-h-30"
          rows={1}
        />
        <div className="flex gap-1 md:gap-2 self-end items-center *:p-2 *:[&:hover,&:active]:text-theme *:[&:hover,&:active]:scale-110 *:rounded-full *:transition-all">
          <FileUpload
            name="attachment upload"
            onUpload={(files) => {
              if (files) setAttachmentFiles((prev) => [...prev, ...files]);
            }}
            labelChildren={<Paperclip size={22} />}
            multiple
          />
          <button className="" type="submit">
            <Send size={22} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputBox;
