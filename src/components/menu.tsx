"use client";

import { EllipsisVertical, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mr-2">
      <button onClick={() => setIsOpen(!isOpen)}>
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
            <Link className="flex gap-2 items-center" href="/chat/group">
              <Users className="text-theme " size={20} />
              <p>Create group</p>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
