import { useState, useEffect, useRef } from 'react';

const SCROLL_DOWN_THRESHOLD = 50;
const SCROLL_UP_THRESHOLD = 20;

export function useNavigationScroll() {
  const [isScrolled, setIsScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        // Hysteresis: require crossing a higher threshold to activate,
        // but a lower one to deactivate — prevents rapid toggling
        if (!isScrolled && y > SCROLL_DOWN_THRESHOLD) {
          setIsScrolled(true);
        } else if (isScrolled && y < SCROLL_UP_THRESHOLD) {
          setIsScrolled(false);
        }
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  return isScrolled;
}
