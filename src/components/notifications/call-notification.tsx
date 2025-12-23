import { use } from "react";
import ProfilePicture from "../profile-picture";
import type { CallNotification } from "@/utils/types/server-response.type";
import { CallControlsContext } from "../providers/call-provider";
import { Phone } from "lucide-react";
import { toast } from "sonner";
import { ChatSocketContext } from "../providers/chat-socket.provider";

const CallNotification = ({
  caller_username,
  caller_profile_picture,
  room_name,
  call_id,
  is_video,
  toastId,
}: CallNotification & { toastId: string | number }) => {
  const callControls = use(CallControlsContext);
  const { chatSocket } = use(ChatSocketContext);

  return (
    <div className="bg-white border border-black/10 shadow-lg py-1 px-2 rounded-3xl w-xs md:w-xs lg:w-sm mx-auto flex items-center justify-between gap-2">
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 rounded-full shadow-md overflow-hidden">
          <ProfilePicture
            ownerName={caller_username}
            src={caller_profile_picture}
            fill
            className="w-full h-full object-cover"
            sizes="112px"
          />
        </div>

        <p className="line-clamp-1 font-medium">{caller_username}</p>
      </div>

      <div className="flex gap-4 text-white">
        <button
          onClick={() => {
            toast.dismiss(toastId);
            callControls?.setCurrentCallState({
              roomName: room_name,
              callerInfo: {
                username: caller_username,
                avatar: caller_profile_picture,
              },
              callType: is_video ? "video" : "voice",
              startedCall: false,
              callId: call_id,
            });
          }}
          className="bg-green-500 p-2 rounded-full"
          type="button"
        >
          <Phone />
        </button>

        <button
          className="bg-red-500 p-2 rounded-full rotate-135"
          type="button"
          onClick={() => {
            toast.dismiss(toastId);
            chatSocket.declineCall(call_id);
          }}
        >
          <Phone />
        </button>
      </div>
    </div>
  );
};

export default CallNotification;
