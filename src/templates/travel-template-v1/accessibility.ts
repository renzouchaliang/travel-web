import { useEffect, type RefObject } from "react";
export function useModal(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  close: () => void,
) {
  useEffect(() => {
    if (!open || !ref.current) return;
    const previous = document.activeElement as HTMLElement;
    const scrollY = window.scrollY;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const el = ref.current;
    const focusable = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, [tabindex="0"]',
        ),
      ).filter((e) => e.getClientRects().length);
    focusable()[0]?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === "Tab") {
        const items = focusable();
        const first = items[0],
          last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    el.addEventListener("keydown", key);
    return () => {
      el.removeEventListener("keydown", key);
      document.body.style.overflow = oldOverflow;
      previous?.focus({ preventScroll: true });
      window.scrollTo(0, scrollY);
    };
  }, [open, ref, close]);
}
export function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ block: "start", behavior: "instant" });
}
