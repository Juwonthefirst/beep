"use client";

import { EllipsisVertical } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const Menu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mr-2">
      <button
        className="p-2 hover:bg-theme/5 hover:text-theme rounded-full hover:scale-110 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <EllipsisVertical />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ y: -30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="md:text-sm absolute top-8 right-2 z-50 bg-neutral-50 border border-black/5 px-2 py-1 rounded-lg flex flex-col shadow-lg *:whitespace-nowrap *:p-2 *:rounded-md *:hover:bg-black/5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
