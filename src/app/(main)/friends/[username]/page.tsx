"use client";

import { retrieveUserQueryOption } from "@/utils/queryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const Page = () => {
  const { username } = useParams();
  const { data } = useSuspenseQuery(
    retrieveUserQueryOption(username as string)
  );
  return <section className="flex flex-col w-full">{username}</section>;
};

export default Page;
