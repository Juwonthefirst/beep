"use client";
import StatusCard from "@/components/status-card";
import { ErrorResponse } from "@/utils/types/server-response.type";
import { isAxiosError } from "axios";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const status =
    isAxiosError(error) && error.response ? error.response.status : 600;

  return (
    <StatusCard
      status={status}
      message={
        isAxiosError<ErrorResponse>(error) && error.response
          ? error.response.data.error
          : ""
      }
      onRetry={() => reset()}
      withRetry
      className="flex-1"
    />
  );
}
