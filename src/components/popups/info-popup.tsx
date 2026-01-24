"use client";

import { ReactNode, useRef, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

const InfoPopup = ({ open, onClose, className = "", children }: Props) => {
  const ref = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open && open) dialog.showModal();
    if (dialog.open && !open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      data-state={open ? "open" : "closed"}
      onClose={onClose}
      className={
        "w-2/3 border-white/30 bg-white dark:bg-black dark:text-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg " +
        className
      }
    >
      {children}
      <div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-md bg-black px-3 py-1.5 font-medium text-white dark:bg-white dark:text-black w-full text-lg"
        >
          Close
        </button>
      </div>
    </dialog>
  );
};

export default InfoPopup;
