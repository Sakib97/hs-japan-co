import { useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { supabase } from "../../../config/supabaseClient";
import { QK_HOME_HERO } from "../../../config/queryKeyConfig";
import styles from "./HeroSection2.module.css";

const DEFAULT_HERO_IMAGE =
  "https://ekaphxsmswixhcxiysiz.supabase.co/storage/v1/object/public/home_page_images/hero/hero_1.jpeg";
const HERO_SECTION = "homepage_hero";

const HeroSection2 = () => {
  const { data: heroImage } = useQuery({
    queryKey: [QK_HOME_HERO],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("home_page")
        .select("image_link")
        .eq("image_section", HERO_SECTION)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data?.image_link ?? null;
    },
  });

  return (
    <section
      className={styles.hero}
      style={{
        backgroundImage: `url(${heroImage || DEFAULT_HERO_IMAGE})`,
      }}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.heading}>
          Your Journey to
          <br />
          Japanese Fluency Starts Here
        </h1>
        <p className={styles.subheading}>
          Expert language training, visa consultancy, and immigration services
          tailored for ambitious students and professionals aiming for
          excellence in Japan.
        </p>
        <div className={styles.btnGroup}>
          <Link to="/courses">
            <Button type="primary" size="large" className={styles.btnPrimary}>
              Explore Programs
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="large" className={styles.btnSecondary}>
              Free Consultation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection2;
