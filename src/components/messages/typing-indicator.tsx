import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { use } from "react";
import { TypingUsersContext } from "../providers/chatroom-state.provider";

const Dot = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "w-2 h-2 bg-black rounded-full animate-big-bounce duration-300 ",
      className
    )}
  ></div>
);

const TypingIndicator = () => {
  const typingUsers = use(TypingUsersContext);

  return (
    <AnimatePresence>
      {typingUsers.length > 0 && (
        <motion.div
          layout
          key="typing-indicator"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl w-fit p-3 bg-neutral-100 transition-all duration-150"
        >
          <div className="flex gap-1.5 items-center">
            <Dot />
            <Dot className="delay-175" />
            <Dot className="delay-350" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TypingIndicator;
