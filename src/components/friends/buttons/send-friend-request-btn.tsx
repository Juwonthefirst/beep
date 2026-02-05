"use client";

import { cn } from "@/lib/utils";
import {
  sendFriendRequestMutationOption,
  cancelFriendRequestMutationOption,
} from "@/utils/queryOptions";
import { useMutation } from "@tanstack/react-query";
import ErrorPopup from "../../popups/error-popup";
import { LoaderCircle, UserCheck, UserPlus, Users } from "lucide-react";

const SendFriendRequestBtn = ({
  userId,
  is_followed_by_me,
  is_following_me,
}: {
  userId: number;
  is_following_me: boolean;
  is_followed_by_me: boolean;
}) => {
  const { mutate, error, status, reset } = useMutation(
    sendFriendRequestMutationOption,
  );
  const {
    mutate: cancelRequestMutate,
    error: cancelRequestError,
    status: cancelRequestStatus,
    reset: cancelRequestReset,
  } = useMutation(cancelFriendRequestMutationOption);
  const isFriend = is_following_me && is_followed_by_me;
  const Icon = isFriend
    ? Users
    : is_followed_by_me || status === "success"
      ? UserCheck
      : UserPlus;
  return (
    <>
      <button
        className={cn(
          "disabled:opacity-70 ",
          status === "pending" && "cursor-wait",
        )}
        type="button"
        onClick={() => {
          mutate({ userId });
        }}
        disabled={status === "pending" || isFriend || is_followed_by_me}
      >
        {status === "pending" ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <Icon size={20} />
        )}
      </button>
      <ErrorPopup
        error={error}
        clearError={() => {
          reset();
        }}
      />
    </>
  );
};

export default SendFriendRequestBtn;
