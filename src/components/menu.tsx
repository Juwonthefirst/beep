"use client";

import { cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const Menu = ({
  children,
  iconSize,
  className,
  enterFrom,
}: {
  children: React.ReactNode;
  className?: string;
  iconSize?: number;
  enterFrom?: "top" | "left" | "right" | "bottom";
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mr-2">
      <button
        className="p-2 hover:bg-theme/5 hover:text-theme rounded-full hover:scale-110 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <EllipsisVertical size={iconSize} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ y: -30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "text-sm absolute top-8 right-2 z-50 bg-neutral-50 p-1 border border-black/5 rounded-lg flex flex-col gap-1 shadow-lg *:whitespace-nowrap *:px-3 *:py-1.5 *:rounded-md *:hover:bg-black/2 *:transition-all",
              className,
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
