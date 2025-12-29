import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import axios from "axios";

import { queryclient } from "@/components/providers/query.provider";
import {
  CurrentUser,
  ServerResponse,
  Friend,
  GroupChatRoom,
  GroupMember,
  Message,
  PaginatedResponse,
  UserChatRoom,
} from "./types/server-response.type";
import { addGroupMembers, leaveGroup } from "./actions";

const handleServerRequestError = (
  serverAction: (...args: unknown[]) => Promise<ServerResponse<unknown>>
) => serverAction().then();

const api = axios.create({
  timeout: 5000,
  withCredentials: true,
});

interface CursorPaginationQueryOptionParam {
  queryKey: unknown[];
  path: string;
}

const cursorPaginationQueryOption = <Type>({
  queryKey,
  path,
}: CursorPaginationQueryOptionParam) =>
  infiniteQueryOptions({
    queryKey,
    queryFn: ({ pageParam }) =>
      api
        .get<PaginatedResponse<Type>>(
          path + (pageParam ? `?cursor=${pageParam}` : "")
        )
        .then((res) => res.data),
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return url.searchParams.get("cursor") || "";
      }
    },
    initialPageParam: "",
  });

export const currentUserQueryOption = queryOptions({
  queryKey: ["currentuser"],
  queryFn: () =>
    api.get<CurrentUser>("/api/auth/user/").then((res) => res.data),
});

export const chatListQueryOption = cursorPaginationQueryOption<
  UserChatRoom | GroupChatRoom
>({
  queryKey: ["chatrooms"],
  path: "/api/auth/user/rooms",
});

export const chatQueryOption = (roomName: string) =>
  queryOptions({
    queryKey: ["chats", roomName],
    queryFn: () =>
      api
        .get<UserChatRoom | GroupChatRoom>(`/api/auth/user/rooms/${roomName}`)
        .then((res) => res.data),
    initialData: () => {
      const chatList = queryclient.getQueryData<
        InfiniteData<PaginatedResponse<UserChatRoom | GroupChatRoom>>
      >(chatListQueryOption.queryKey);
      if (!chatList) return chatList;

      let chatRoomObject: UserChatRoom | GroupChatRoom | undefined;

      for (const response of chatList.pages) {
        const chatRoom = response.results.find(
          (chatRoom) => chatRoom.name === roomName
        );
        if (chatRoom) {
          chatRoomObject = chatRoom;
          break;
        }
      }
      return chatRoomObject;
    },
    select: (data) => {
      if (data.is_group) {
        data.group.mappedMembers = new Map<number, GroupMember>(
          data.group.members.map((member) => [member.id, member])
        );
      }
      return data;
    },
  });

export const messageQueryOption = (roomName: string) =>
  cursorPaginationQueryOption<Message>({
    queryKey: ["chats", roomName, "messages"],
    path: `/api/chats/${roomName}/messages`,
  });

export const friendsQueryOption = (searchKeyword: string) =>
  infiniteQueryOptions({
    queryKey: ["friends", searchKeyword],
    queryFn: ({ pageParam }) =>
      api
        .get<PaginatedResponse<Friend>>(
          `/api/auth/user/friends?page=${pageParam}&search=${searchKeyword}`
        )

        .then((res) => res.data),
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const nextPageUrl = new URL(lastPage.next);
        return nextPageUrl.searchParams.get("page") || "";
      }
    },
    initialPageParam: "",
  });

export const addMemberMutationOption = mutationOptions({
  mutationFn: ({
    groupId,
    memberIds,
  }: {
    roomName: string;
    groupId: number;
    memberIds: number[];
  }) =>
    addGroupMembers(groupId, memberIds).then((res) => {
      if (res.status === "error") throw new Error(res.error);
      return res;
    }),

  onSuccess(data, variables, onMutateResult, context) {
    context.client.invalidateQueries({
      queryKey: ["chats", variables.roomName],
    });
  },
});
export const leaveGroupMutationOption = mutationOptions({
  mutationFn: ({ groupId }: { groupId: number }) =>
    leaveGroup(groupId).then((res) => {
      if (res.status === "error") throw new Error(res.error);
      return res;
    }),
});
