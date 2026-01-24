"use client";

import { Check, LoaderCircle, Send } from "lucide-react";
import ProfilePicture from "../profile-picture";
import { sendFriendRequestMutationOption } from "@/utils/queryOptions";
import { useMutation } from "@tanstack/react-query";
import ErrorPopup from "../popups/error-popup";
import { cn } from "@/lib/utils";

interface Props {
  id: number;
  username: string;
  avatar: string;
  hasSentFriendRequest: boolean;
}

const UserInfo = ({ id, username, avatar, hasSentFriendRequest }: Props) => {
  const { mutate, error, status, reset } = useMutation(
    sendFriendRequestMutationOption,
  );
  return (
    <div className="flex flex-col self-center items-center gap-4">
      <div className="relative size-36">
        <ProfilePicture ownerName={username} src={avatar} fill sizes="288px" />
      </div>
      <div className="flex flex-col gap-3 mb-2 items-center">
        <p className="font-medium text-lg ">{username}</p>
        <button
          className={cn(
            "bg-theme rounded-md py-2 px-4 text-white text-sm font-medium flex gap-2 items-center disabled:opacity-70",
            status === "pending" && "cursor-wait",
          )}
          type="button"
          onClick={() => {
            mutate({ userId: id });
          }}
          disabled={status === "pending" || hasSentFriendRequest}
        >
          {status === "pending" ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : hasSentFriendRequest || status === "success" ? (
            <Check size={18} strokeWidth={2.5} />
          ) : (
            <Send size={18} />
          )}
          {hasSentFriendRequest || status === "success"
            ? "Friend request sent"
            : "Send Friend Request"}
        </button>
      </div>
      <ErrorPopup
        error={error}
        clearError={() => {
          reset();
        }}
      />
    </div>
  );
};

export default UserInfo;
