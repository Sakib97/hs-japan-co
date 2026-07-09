import { useQuery } from "@tanstack/react-query";
import { Carousel } from "antd";
import { QK_HOMEPAGE_CAROUSEL } from "../../../config/queryKeyConfig";
import { fetchHomepageCarouselSlides } from "../../../utils/homepageCarousel";
import styles from "./CarouselSection2.module.css";

const CarouselSection2 = () => {
  const { data: slides = [] } = useQuery({
    queryKey: [QK_HOMEPAGE_CAROUSEL],
    queryFn: fetchHomepageCarouselSlides,
  });

  if (slides.length === 0) return null;

  return (
    <div className={styles.carouselSection}>
      {/* <div className={styles.wrapper}> */}
      <div className={styles.hero}>
        <Carousel
          arrows
          autoplay={{ dotDuration: true }}
          autoplaySpeed={6000}
          draggable
          dots
          className={styles.carousel}
          // className={styles.heroImg}
        >
          {slides.map((s) => (
            <div key={s.id} className={styles.slideInner}>
              <img src={s.url} alt="" className={styles.heroImg} />
            </div>
          ))}
        </Carousel>
      </div>

      <section className={styles.contentSection}>
        <div className={styles.contentGlow} aria-hidden />
        <div className={styles.content}>
          <span className={styles.eyebrow}>HS Japan Academy</span>
          <div className={styles.titleBar} />
          <h1 className={styles.headings}>
            Your Journey to
            <br />
            <span className={styles.headingsAccent}>
              Japanese Fluency Starts Here
            </span>
          </h1>
        </div>
      </section>
    </div>
  );
};

export default CarouselSection2;
