"use client";

import { LoaderCircle, Send } from "lucide-react";
import { use, useRef, useState, useEffect } from "react";
import throttle from "lodash.throttle";
import AttachmentPreview from "../../attachments/attachment-preview";
import {
  ChatSocketControlsContext,
  CurrentRoomNameContext,
} from "../../providers/chatroom-state.provider";
import TextArea from "../../form/text-area";
import { useQueryClient } from "@tanstack/react-query";
import { messageQueryOption } from "@/utils/queryOptions";
import { ChatStateContext } from "../../providers/chat-state.provider";
import { ReplyMessageCardWithCancel } from "../reply-message-card";
import EditMessageCard from "../edit-message-card";
import { UUID } from "crypto";
import useSocketState from "@/hooks/useSocketState.hook";
import { getAttachmentsId } from "@/utils/helpers/client-helpers/attachments.helper";
import { removeAttachment } from "@/utils/helpers/client-helpers/attachments.helper";
import { AttachmentState } from "@/utils/types/client.type";
import { updateMessageCache } from "@/utils/helpers/client-helpers/messages.helper";
import AttachmentUploadBtn from "./attachment-upload-btn";
import useAudioRecorder from "@/hooks/useAudioRecorder.hook";
import { CancelBtn, RecordBtn, StopBtn } from "./audio-controls";
import AudioPreview from "./audio-preview";

// TODO: Style the audio component
// TODO: Remove microphone in use when done recording
// TODO: Add recording state
// TODO: allow upload cancel
const InputBox = () => {
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState<AttachmentState[]>([]);
  const [inputState, setInputState] = useState<"text" | "voice">("text");

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { chatState, setChatState } = use(ChatStateContext);
  const roomName = use(CurrentRoomNameContext);
  const chatsocketControls = use(ChatSocketControlsContext)!;

  const queryClient = useQueryClient();
  const socketState = useSocketState();
  const audioRecorder = useAudioRecorder();

  const iconSize = 22;

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
              key={attachment.uuid}
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
            sender=" "
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
            if (
              !(inputValue || audioRecorder.recordedAudio) &&
              attachments.some(
                (attachment) =>
                  attachment.uploadStatus === "pending" ||
                  attachment.uploadStatus === "error",
              )
            )
              return;
            let uuid: UUID | null = null;
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
              updateMessageCache(chatState, inputValue, uuid, attachments),
            );

            if (inputRef.current) {
              inputRef.current.focus();
              inputRef.current.style.height = "auto";
            }
          }}
          className="flex items-center rounded-xl py-0.5 px-2 text-sm bg-neutral-100 border border-neutral-500/10"
        >
          <AttachmentUploadBtn
            iconSize={iconSize}
            setAttachments={setAttachments}
          />
          {inputState === "text" ? (
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
          ) : (
            <AudioPreview
              recordingState={audioRecorder.recordingState}
              audioBlob={audioRecorder.recordedAudio}
              pauseRecording={audioRecorder.controls.pause}
              continueRecording={audioRecorder.controls.resume}
              iconSize={iconSize}
            />
          )}
          <div className="flex gap-1 md:gap-2 self-end items-center *:p-2 *:[&:hover,&:active]:text-theme *:[&:hover,&:active]:scale-110 *:rounded-full *:transition-all">
            {audioRecorder.recordingState === "idle" ? (
              audioRecorder.recordedAudio ? (
                <CancelBtn
                  iconSize={iconSize + 2}
                  clearAudioRecording={() => {
                    setInputState("text");
                    audioRecorder.controls.clear();
                  }}
                />
              ) : (
                <RecordBtn
                  iconSize={iconSize}
                  setInputStateToVoice={() => {
                    setInputState("voice");
                    audioRecorder.controls.start();
                  }}
                />
              )
            ) : (
              <StopBtn
                iconSize={iconSize}
                stopAudioRecording={audioRecorder.controls.stop}
              />
            )}
            <button
              disabled={
                !socketState.is_connected ||
                (!inputValue &&
                  attachments.some(
                    (attachment) =>
                      attachment.uploadStatus === "pending" ||
                      attachment.uploadStatus === "error",
                  ))
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
