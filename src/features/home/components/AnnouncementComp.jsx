import { useEffect, useRef, useState } from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { supabase } from "../../../config/supabaseClient";
import {
  QK_HOME_ANNOUNCEMENTS,
  QK_ANNOUNCEMENTS,
} from "../../../config/queryKeyConfig";
import styles from "./AnnouncementComp.module.css";

const DEFAULT_SPEED = 4000;

const AnnouncementComp = () => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playSpeed, setPlaySpeed] = useState([]);
  const timerRef = useRef(null);

  const today = dayjs().format("YYYY-MM-DD");

  const { data: announcements = [] } = useQuery({
    queryKey: [QK_ANNOUNCEMENTS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        // .eq("is_active", true)
        .order("order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      setPlaySpeed(data?.[0]?.autoplay_speed ?? DEFAULT_SPEED);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Filter to slides whose date window includes today
  const activeSlides = announcements.filter((a) => {
    if (a.is_active === false) return false;
    if (a.start_date && a.start_date > today) return false;
    if (a.end_date && a.end_date < today) return false;

    return true;
  });

  if (activeSlides.length === 0) return null;
  console.log("autoplay: ", playSpeed);

  return (
    <div className={`containers ${styles.wrapper}`}>
      {/* Preload all banner images to avoid blank-frame flash */}
      <div aria-hidden="true" className={styles.preload}>
        {activeSlides.map((s) => (
          <img key={s.id} src={s.banner_url} alt="" />
        ))}
      </div>

      <Carousel
        autoplay={{ dotDuration: true }}
        autoplaySpeed={10000}
        arrows
        draggable
        adaptiveHeight
      >
        {activeSlides.map((slide) => (
          <div key={slide.id} className={styles.slide}>
            {slide.redirect_url ? (
              <a
                href={slide.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.slideLink}
              >
                <img
                  src={slide.banner_url}
                  alt="announcement"
                  className={styles.bannerImg}
                />
              </a>
            ) : (
              <img
                src={slide.banner_url}
                alt="announcement"
                className={styles.bannerImg}
              />
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default AnnouncementComp;
