"use client";

import type { WebSocketConnectionState } from "@/utils/types/client.type";
import Logo from "./logos/logo";
import { cn } from "@/lib/utils";

const SplashScreen = ({
  connectionState,
}: {
  connectionState: WebSocketConnectionState;
}) => {
  return (
    <main className="relative w-screen h-dvh flex flex-col gap-6 items-center justify-center bg-white">
      <Logo className="text-6xl lg:text-7xl" />

      <p
        className={cn(
          "font-medium text-sm",
          connectionState === "disconnected" && "text-red-500",
        )}
      >
        {connectionState === "connecting"
          ? "Connecting to server..."
          : "Unable to connect to server"}
      </p>
      {connectionState === "disconnected" && (
        <button className="bg-black px-4 py-1.5 rounded-md font-medium text-white -mt-3 text-sm active:scale-95 hover:bg-black/80 transition-all duration-200">
          Retry
        </button>
      )}
    </main>
  );
};

export default SplashScreen;
