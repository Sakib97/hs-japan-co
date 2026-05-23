import { useQuery } from "@tanstack/react-query";
import { Carousel } from "antd";
import { supabase } from "../../../config/supabaseClient";
import { QK_HOMEPAGE_CAROUSEL } from "../../../config/queryKeyConfig";
import styles from "./CarouselSection2.module.css";

const CarouselSection2 = () => {
  const { data: slides = [] } = useQuery({
    queryKey: [QK_HOMEPAGE_CAROUSEL],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("home_page")
        .select("id, image_link, image_order")
        .eq("image_section", "homepage_carousel")
        .order("image_order", { ascending: true });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  if (slides.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <Carousel
        arrows
        autoplay={{ dotDuration: true }}
        autoplaySpeed={8000}
        draggable
        dots
        className={styles.carousel}
      >
        {slides.map((s) => (
          <div key={s.id}>
            <div
              className={styles.slide}
              style={{ backgroundImage: `url(${s.image_link})` }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselSection2;
