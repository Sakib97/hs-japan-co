import { useQuery } from "@tanstack/react-query";
import { Button, Grid } from "antd";
import { Link } from "react-router-dom";
import { supabase } from "../../../config/supabaseClient";
import { QK_HOME_HERO } from "../../../config/queryKeyConfig";
import styles from "./HeroSection2.module.css";

const { useBreakpoint } = Grid;
const DEFAULT_HERO_IMAGE =
  "https://ekaphxsmswixhcxiysiz.supabase.co/storage/v1/object/public/home_page_images/hero/hero_1.jpeg";
const HERO_SECTION = "homepage_hero";

const HeroSection2 = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

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

  const imageUrl = heroImage || DEFAULT_HERO_IMAGE;

  return (
    <>
      <section
        className={`${styles.hero} ${isMobile ? styles.heroMobile : ""}`}
        style={isMobile ? undefined : { backgroundImage: `url(${imageUrl})` }}
      >
        {isMobile && (
          <img src={imageUrl} alt="" className={styles.heroImg} />
        )}
      </section>

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
          {/* <p className={styles.subheadings}>
            Expert language training, visa consultancy, and immigration services
            tailored for ambitious students and professionals aiming for
            excellence in Japan.
          </p> */}
          {/* <div className={styles.btnGroup}>
            <Link to="/courses">
              <Button
                type="primary"
                size="large"
                className={styles.btnPrimary}
              >
                Explore Programs
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="large" className={styles.btnSecondary}>
                Free Consultation
              </Button>
            </Link>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default HeroSection2;
