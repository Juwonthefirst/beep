"use client";

import { useEffect, useRef } from "react";

type BindArgs = {
  messagesEl: HTMLElement | null;
  composerEl: HTMLElement | null;
};

export default function ChatViewportProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const setAppHeight = () => {
      const vv = window.visualViewport;
      const height = vv ? vv.height : window.innerHeight;
      document.documentElement.style.setProperty(
        "--app-viewport-height",
        `${height}px`
      );
    };

    const onVVChange = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setAppHeight();
      });
    };

    setAppHeight();
    window.addEventListener("resize", onVVChange);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onVVChange);
      window.visualViewport.addEventListener("scroll", onVVChange);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onVVChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onVVChange);
        window.visualViewport.removeEventListener("scroll", onVVChange);
      }
    };
  }, []);

  return <>{children}</>;
}

// Optional helper to bind composer/messages behavior
export function bindComposerKeyboard({ messagesEl, composerEl }: BindArgs) {
  if (!messagesEl || !composerEl) return () => {};

  const getKeyboardHeight = () => {
    const vv = window.visualViewport;
    const layoutH = window.innerHeight;
    const visualH = vv ? vv.height : window.innerHeight;
    const offsetTop = vv ? vv.offsetTop : 0;
    const keyboardHeight = Math.max(0, layoutH - visualH - offsetTop);
    return keyboardHeight;
  };

  const updateLayout = () => {
    const keyboard = getKeyboardHeight();
    const composerHeight = composerEl.offsetHeight;
    composerEl.style.transform = keyboard ? `translateY(-${keyboard}px)` : "";
    messagesEl.style.paddingBottom = `${composerHeight + keyboard}px`;
  };

  const onResize = () => updateLayout();

  window.addEventListener("resize", onResize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", onResize);
    window.visualViewport.addEventListener("scroll", onResize);
  }

  const inputs = Array.from(
    composerEl.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "input, textarea, [contenteditable]"
    )
  );
  const onFocus = () => {
    setTimeout(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
      updateLayout();
    }, 70);
  };
  inputs.forEach((i) => i.addEventListener("focus", onFocus));

  // initial
  setTimeout(updateLayout, 20);

  return () => {
    window.removeEventListener("resize", onResize);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", onResize);
      window.visualViewport.removeEventListener("scroll", onResize);
    }
    inputs.forEach((i) => i.removeEventListener("focus", onFocus));
  };
}
