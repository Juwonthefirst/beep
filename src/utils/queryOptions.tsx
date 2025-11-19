import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import axios from "axios";
import {
  CurrentUser,
  GroupChatRoom,
  PaginatedResponse,
  UserChatRoom,
} from "./types/server-response.type";
import { URL } from "url";
const api = axios.create({
  timeout: 5000,
  withCredentials: true,
});

export const currentUserQueryOption = queryOptions({
  queryKey: ["currentuser"],
  queryFn: () =>
    api.get<CurrentUser>("/api/auth/user/").then((res) => res.data),
});

export const chatListQueryOption = infiniteQueryOptions({
  queryKey: ["chatRooms"],
  queryFn: ({ pageParam }) =>
    api
      .get<PaginatedResponse<UserChatRoom | GroupChatRoom>>(
        "/api/auth/user/rooms/" + pageParam ? `?cursor=${pageParam}` : ""
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
