"use client";

import FriendInfo from "@/components/friends/friend-info";
import Popup from "@/components/popups/popup";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { userQueryOption, unFriendMutationOption } from "@/utils/queryOptions";
import {
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ErrorPopup from "@/components/popups/error-popup";
import UserInfo from "@/components/friends/user-info";

const Page = () => {
  const { username } = useParams<{ username: string }>();
  const { data } = useSuspenseQuery(userQueryOption(username));
  const { mutate, error, reset } = useMutation(unFriendMutationOption);
  if (!data.is_friend)
    return (
      <section className="pt-10 w-full">
        <UserInfo
          id={data.id}
          username={data.username}
          avatar={data.profile_picture}
          hasSentFriendRequest={data.is_followed_by_me}
        />
      </section>
    );
  return (
    <section className="flex flex-col pt-10 w-full h-screen">
      <FriendInfo {...data} />

      <Popup
        trigger={
          <button
            className="text-red-500 flex items-center gap-1.5  p-6 border-t border-neutral-200 mt-auto"
            type="button"
          >
            Unfriend
          </button>
        }
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Unfriend {username}?</AlertDialogTitle>
          <AlertDialogDescription>
            You may lose important messages and attachments if you unfriend{" "}
            {username}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={() => {
              mutate({ friendId: data.id });
            }}
          >
            Unfriend
          </AlertDialogAction>
        </AlertDialogFooter>
      </Popup>
      <ErrorPopup error={error} clearError={() => reset()} />
    </section>
  );
};

export default Page;
