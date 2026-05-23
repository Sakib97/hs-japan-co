import { useRef } from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { supabase } from "../../../config/supabaseClient";
import { QK_ANNOUNCEMENTS } from "../../../config/queryKeyConfig";
import styles from "./AnnouncementSection2.module.css";

const today = dayjs().format("YYYY-MM-DD");

const AnnouncementSection2 = () => {
  const carouselRef = useRef(null);

  const { data: announcements = [] } = useQuery({
    queryKey: [QK_ANNOUNCEMENTS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select(
          "id, banner_url, redirect_url, autoplay_speed, is_active, start_date, end_date",
        )
        .order("order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const activeSlides = announcements.filter((a) => {
    if (a.is_active === false) return false;
    if (a.start_date && a.start_date > today) return false;
    if (a.end_date && a.end_date < today) return false;
    return true;
  });

  if (activeSlides.length === 0) return null;

  const speed = activeSlides[0]?.autoplay_speed ?? 10000;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.badge}>Announcements</span>
        <div className={styles.controls}>
          <button
            className={styles.arrow}
            onClick={() => carouselRef.current?.prev()}
            aria-label="Previous"
          >
            <LeftOutlined />
          </button>
          <button
            className={styles.arrow}
            onClick={() => carouselRef.current?.next()}
            aria-label="Next"
          >
            <RightOutlined />
          </button>
        </div>
      </div>

      {/* Preload images to avoid blank-frame flash */}
      <div aria-hidden="true" className={styles.preload}>
        {activeSlides.map((s) => (
          <img key={s.id} src={s.banner_url} alt="" />
        ))}
      </div>

      <div className={styles.carouselWrap}>
        <Carousel
          ref={carouselRef}
          autoplay={{ dotDuration: true }}
          autoplaySpeed={speed}
          adaptiveHeight
          draggable
          dots
          className={styles.carousel}
        >
          {activeSlides.map((slide) => (
            <div key={slide.id}>
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
    </section>
  );
};

export default AnnouncementSection2;
