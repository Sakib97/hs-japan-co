import Carousel from "react-bootstrap/Carousel";
import styles from "../styles/CarouselComp.module.css";
import { useQuery } from "@tanstack/react-query";
import { QK_HOMEPAGE_CAROUSEL } from "../../../config/queryKeyConfig";
import { fetchHomepageCarouselSlides } from "../../../utils/homepageCarousel";

const CarouselComp = () => {
  const { data: slides = [], isLoading } = useQuery({
    queryKey: [QK_HOMEPAGE_CAROUSEL],
    queryFn: fetchHomepageCarouselSlides,
  });

  if (isLoading) return null;

  if (slides.length === 0) return null;

  return (
    <div className={styles.carouselContainer}>
      <Carousel fade>
        {slides.map((s) => (
          <Carousel.Item key={s.id} interval={2000}>
            <div className={styles.overlay}></div>
            <img
              className={`d-block w-100 ${styles.carouselImg}`}
              src={s.url}
              alt="Carousel slide"
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComp;
