"use client";

import { watchElementIntersecting } from "@/utils/helpers/client-helper";
import {
  ErrorResponse,
  PaginatedResponse,
} from "@/utils/types/server-response.type";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { type ReactNode, RefObject, useEffect } from "react";
import StatusCard from "./status-card";

interface Props<DataType, TQueryKey extends unknown[], TPageParam> {
  queryOption: UseInfiniteQueryOptions<
    PaginatedResponse<DataType>,
    Error,
    InfiniteData<PaginatedResponse<DataType>>,
    TQueryKey,
    TPageParam
  >;
  className?: string;
  emptyFallback: ReactNode;
  loadingFallback: ReactNode;
  triggerElementRef: RefObject<HTMLElement | null>;
  children: (item: DataType, isTriggerElement: boolean) => ReactNode;
  limit?: number;
}

function InifinteDataView<DataType, TQueryKey extends unknown[], TPageParam>({
  queryOption,
  className,
  children,
  emptyFallback,
  loadingFallback,
  triggerElementRef,
  limit = 5,
}: Props<DataType, TQueryKey, TPageParam>) {
  const {
    data,
    error,
    isPending,
    isError,
    isFetchNextPageError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(queryOption);

  useEffect(() => {
    if (isFetchingNextPage || !hasNextPage || isPending) return;

    const observer = watchElementIntersecting(triggerElementRef.current, () => {
      void fetchNextPage();
    });
    return () => observer?.disconnect();
  }, [
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isPending,
    triggerElementRef,
  ]);

  const pageSize = data?.pages[0].count || 0;

  return (
    <div className={className}>
      {data && data.pages[0].results.length === 0 && emptyFallback}
      {data &&
        data.pages.flatMap((response, currentPageParamIndex) =>
          response.results.map((result, index) =>
            children(
              result,
              data.pageParams.length * pageSize - limit ===
                currentPageParamIndex * pageSize + index
            )
          )
        )}
      {(isPending || isFetchingNextPage) && loadingFallback}
      {(isError || isFetchNextPageError) &&
        isAxiosError<ErrorResponse>(error) &&
        error.response && (
          <StatusCard
            status={error.response?.status}
            onRetry={() => refetch()}
            withRetry
          />
        )}
    </div>
  );
}

export default InifinteDataView;
