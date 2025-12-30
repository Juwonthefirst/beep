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
  Friend,
  GroupChatRoom,
  GroupMember,
  Message,
  PaginatedResponse,
  UserChatRoom,
} from "./types/server-response.type";
import { addGroupMembers, leaveGroup } from "./actions";

const SEARCH_QUERY_GC_TIME = 2.5 * 60 * 1000;

const api = axios.create({
  timeout: 5000,
  withCredentials: true,
});

interface PaginationQueryOptionParam {
  queryKey: unknown[];
  path: string;
  searchParam?: Record<string, string>;
  extraParams?: Record<string, string | number | undefined>;
}

const cursorPaginationQueryOption = <Type>({
  queryKey,
  path,
  extraParams,
  searchParam,
}: PaginationQueryOptionParam) => {
  const params = new URLSearchParams(searchParam);

  return infiniteQueryOptions({
    ...extraParams,
    queryKey,
    queryFn: async ({ pageParam }) => {
      if (pageParam) params.set("cursor", pageParam);

      const res = await api.get<PaginatedResponse<Type>>(
        path + "?" + params.toString()
      );
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return url.searchParams.get("cursor") || "";
      }
    },
    initialPageParam: "",
  });
};

const pagePaginationQueryOption = <Type>({
  queryKey,
  path,
  extraParams,
  searchParam,
}: PaginationQueryOptionParam) => {
  const params = new URLSearchParams(searchParam);

  return infiniteQueryOptions({
    ...extraParams,
    queryKey,
    queryFn: async ({ pageParam }) => {
      if (pageParam) params.set("page", pageParam);

      const res = await api.get<PaginatedResponse<Type>>(
        path + "?" + params.toString()
      );
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return url.searchParams.get("page") || "";
      }
    },
    initialPageParam: "",
  });
};

export const currentUserQueryOption = queryOptions({
  queryKey: ["currentuser"],
  queryFn: () =>
    api.get<CurrentUser>("/api/auth/user/").then((res) => res.data),
});

export const chatListQueryOption = (searchKeyword = "") =>
  cursorPaginationQueryOption<UserChatRoom | GroupChatRoom>({
    queryKey: ["chatrooms", { search: searchKeyword }],
    path: "/api/auth/user/rooms/",
    searchParam: { search: searchKeyword },
    extraParams: {
      gcTime: searchKeyword === "" ? undefined : SEARCH_QUERY_GC_TIME,
    },
  });

export const chatQueryOption = (roomName: string) =>
  queryOptions({
    queryKey: ["chatrooms", roomName],
    queryFn: () =>
      api
        .get<UserChatRoom | GroupChatRoom>(`/api/auth/user/rooms/${roomName}`)
        .then((res) => res.data),
    initialData: () => {
      const chatList = queryclient.getQueryData<
        InfiniteData<PaginatedResponse<UserChatRoom | GroupChatRoom>>
      >(chatListQueryOption().queryKey);
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
    queryKey: ["chatrooms", roomName, "messages"],
    path: `/api/chats/${roomName}/messages`,
  });

export const friendListQueryOption = (searchKeyword = "") =>
  pagePaginationQueryOption<Friend>({
    queryKey: ["friends", { search: searchKeyword }],
    path: "/api/auth/user/friends",
    searchParam: { search: searchKeyword },
    extraParams: {
      gcTime: searchKeyword === "" ? undefined : SEARCH_QUERY_GC_TIME,
    },
  });

export const retrieveUserQueryOption = (username: string) =>
  queryOptions({ queryKey: ["users", username] });

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
      queryKey: chatQueryOption(variables.roomName).queryKey,
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
