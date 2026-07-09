import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./EventCardTitle.module.css";

const EventCardTitle = ({
  title,
  onSeeMore,
  as: Tag = "h4",
  titleClassName = "",
}) => {
  const titleRef = useRef(null);
  const [isClamped, setIsClamped] = useState(false);

  const checkClamped = useCallback(() => {
    const el = titleRef.current;
    if (!el) return;
    setIsClamped(el.scrollHeight > el.clientHeight + 1);
  }, []);

  useEffect(() => {
    checkClamped();
    const el = titleRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;

    const ro = new ResizeObserver(checkClamped);
    ro.observe(el);
    return () => ro.disconnect();
  }, [checkClamped, title]);

  return (
    <div className={styles.wrap}>
      <Tag
        ref={titleRef}
        className={`${styles.title} ${titleClassName}`.trim()}
      >
        {title ?? "—"}
      </Tag>
      {isClamped && (
        <button
          type="button"
          className={styles.seeMoreBtn}
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

export default EventCardTitle;
