import { useRef, useCallback } from "react";

const SECTIONS = ["home", "memories", "chat-bot"];
const MIN_SWIPE_DISTANCE = 80; 
const MAX_VERTICAL_RATIO = 0.5; 

export function useSwipe(
  activeSection: string,
  setActiveSection: (section: string) => void
) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchStartTarget = useRef<EventTarget | null>(null);

  const goToOffset = useCallback(
    (offset: number) => {
      const currentIndex = SECTIONS.indexOf(activeSection);
      const nextIndex = currentIndex + offset;
      if (nextIndex >= 0 && nextIndex < SECTIONS.length) {
        setActiveSection(SECTIONS[nextIndex]);
      }
    },
    [activeSection, setActiveSection]
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;


    if (target.closest("[data-no-tab-swipe]")) {
      touchStartTarget.current = null;
      touchStartX.current = null;
      return;
    }

    touchStartTarget.current = target;
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchEndX.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || touchEndX.current === null) return;

      const distanceX = touchStartX.current - touchEndX.current;
      const distanceY = touchStartY.current! - e.changedTouches[0].clientY;
      const absX = Math.abs(distanceX);
      const absY = Math.abs(distanceY);

      if (absX < MIN_SWIPE_DISTANCE) return;
      if (absY > absX * MAX_VERTICAL_RATIO) return;

      if (distanceX > 0) {
        goToOffset(1);
      } else {
        goToOffset(-1);
      }
    },
    [goToOffset]
  );

  return { onTouchStart, onTouchMove, onTouchEnd };
}