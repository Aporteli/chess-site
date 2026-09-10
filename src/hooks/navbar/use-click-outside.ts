import { useEffect, RefObject } from "react";

export function useClickOutside(
  ref: RefObject<HTMLElement>,
  isOpen: boolean,
  onClose: () => void
) {
  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, ref]);
}