import Carousel from "react-bootstrap/Carousel";
import styles from "../styles/CarouselComp.module.css";
import { useQuery } from "@tanstack/react-query";
import { QK_HOMEPAGE_CAROUSEL } from "../../../config/queryKeyConfig";
import { supabase } from "../../../config/supabaseClient";

const fetchSlides = async () => {
  const { data, error } = await supabase
    .from("home_page")
    .select("id, image_link")
    .eq("image_section", "homepage_carousel");

  if (error) throw new Error(error.message);

  return data.map((row) => ({
    id: row.id,
    url: row.image_link,
  }));
};

const CarouselComp = () => {
  const { data: slides = [], isLoading } = useQuery({
    queryKey: [QK_HOMEPAGE_CAROUSEL],
    queryFn: fetchSlides,
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
