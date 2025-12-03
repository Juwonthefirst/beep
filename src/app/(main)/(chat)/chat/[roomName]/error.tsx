"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col gap-4 items-center my-12 w-full">
      <h2>{error.message}</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
