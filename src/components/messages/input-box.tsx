"use client";

import useChatSocket from "@/hooks/useChatSocket.hook";
import { Paperclip, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import throttle from "lodash.throttle";

interface Props {
  roomName: string;
}

const InputBox = ({ roomName }: Props) => {
  const chatSocket = useChatSocket(roomName);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File[]>([]);

  return (
    <div className=" py-2 px-8">
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
        <div className="flex gap-2 items-center *:p-2">
          <button type="button">
            <Paperclip />
          </button>
          <button
            className="[&:hover,&:active]:bg-theme/20 rounded-full"
            type="submit"
          >
            <Send />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputBox;
