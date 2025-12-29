"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  paragraphClassName?: string;
}

const ExpandableText = ({ children, className, paragraphClassName }: Props) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = isExpanded ? ChevronUp : ChevronDown;
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    if (paragraphRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOverflowing(
        paragraphRef.current?.scrollHeight > paragraphRef.current?.clientHeight
      );
    }
  }, []);

  return (
    <motion.div className={cn(className, "flex flex-col")}>
      <p
        ref={paragraphRef}
        className={cn(paragraphClassName, { "line-clamp-3": !isExpanded })}
      >
        {children}
      </p>
      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex self-center items-center gap-1 text-theme text-xs"
          type="button"
        >
          {isExpanded ? "show less" : "show more"} <Icon size={18} />
        </button>
      )}
    </motion.div>
  );
};

export default ExpandableText;
