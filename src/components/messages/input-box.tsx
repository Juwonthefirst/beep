"use client";

import useChatSocket from "@/hooks/useChatSocket.hook";
import { Paperclip, Send } from "lucide-react";
import { useRef, useState } from "react";
import throttle from "lodash.throttle";
import FileUpload from "../form/file-upload";

interface Props {
  roomName: string;
}

const InputBox = ({ roomName }: Props) => {
  const chatSocket = useChatSocket(roomName);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File[]>([]);

  return (
    <div className="py-2 px-8 shrink-0">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!inputValue) return;
          chatSocket.send(inputValue);
          setInputValue("");
          inputRef.current?.focus();
        }}
        className="flex items-center border border-black rounded-xl px-4 text-sm "
      >
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
            throttle(() => {
              chatSocket.typing();
            }, 1000)();
          }}
          className="focus:outline-0 w-full "
        />
        <div className="flex gap-2 items-center *:p-2 *:[&:hover,&:active]:bg-theme/20 *:rounded-full">
          <FileUpload
            name="attachment upload"
            onUpload={(files) => {
              if (files) setAttachmentFile((prev) => [...prev, ...files]);
            }}
            labelChildren={<Paperclip />}
            multiple
          />
          <button className="" type="submit">
            <Send />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputBox;
