import { useLayoutEffect, useRef } from "react";

const useAnimationFrame = (cb: (delta: number) => void) => {
  if (typeof performance === "undefined" || typeof window === "undefined") {
    return;
  }

  const cbRef = useRef<(delta: number) => void>(cb);
  const frame = useRef<number>();
  const last = useRef(performance.now());

  cbRef.current = cb;

  const animate = (now: number) => {
    cbRef.current((now - last.current) / 1000);
    last.current = now;
    frame.current = requestAnimationFrame(animate);
  };

  useLayoutEffect(() => {
    frame.current = requestAnimationFrame(animate);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);
};

export default useAnimationFrame;
