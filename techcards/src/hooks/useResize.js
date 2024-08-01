import { useEffect, useState } from "react";

const useResize = ({ ref }) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      setSize({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });

      const resizeObserver = new ResizeObserver((entries) => {
        setSize({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height,
        });
      });

      resizeObserver.observe(ref.current);

      return () => resizeObserver.unobserve(ref.current);
    }
  }, [ref]);

  return size;
};

export default useResize;
