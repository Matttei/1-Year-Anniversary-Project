import { useEffect, useState } from "react";

export function usePreloadImages(images: string[], minDuration = 400) {
  const [loaded, setLoaded] = useState(images.length === 0);

  useEffect(() => {
    if (images.length === 0) {
      setLoaded(true);
      return;
    }

    let cancelled = false;
    setLoaded(false); // reset 
    const start = Date.now();

    Promise.all(
      images.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.src = src;
            if (img.complete) return resolve();
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
      )
    ).then(() => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, minDuration - elapsed); 
      setTimeout(() => {
        if (!cancelled) setLoaded(true);
      }, wait);
    });

    return () => {
      cancelled = true;
    };
  }, [images]);

  return loaded;
}