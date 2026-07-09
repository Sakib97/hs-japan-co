import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./ClampedTextWithSeeMore.module.css";

const ClampedTextWithSeeMore = ({
  text,
  onSeeMore,
  as: Tag = "p",
  textClassName = "",
  seeMoreClassName = "",
  lines = 2,
}) => {
  const textRef = useRef(null);
  const [isClamped, setIsClamped] = useState(false);

  const checkClamped = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    setIsClamped(el.scrollHeight > el.clientHeight + 1);
  }, []);

  useEffect(() => {
    checkClamped();
    const el = textRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;

    const ro = new ResizeObserver(checkClamped);
    ro.observe(el);
    return () => ro.disconnect();
  }, [checkClamped, text]);

  if (!text) return null;

  return (
    <div className={styles.wrap}>
      <Tag
        ref={textRef}
        className={`${styles.text} ${textClassName}`.trim()}
        style={{ WebkitLineClamp: lines, lineClamp: lines }}
      >
        {text}
      </Tag>
      {isClamped && (
        <button
          type="button"
          className={`${styles.seeMoreBtn} ${seeMoreClassName}`.trim()}
          onClick={(e) => {
            e.stopPropagation();
            onSeeMore();
          }}
        >
          See More
        </button>
      )}
    </div>
  );
};

export default ClampedTextWithSeeMore;
