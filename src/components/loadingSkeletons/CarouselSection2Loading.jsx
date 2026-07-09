import { Skeleton, Grid } from "antd";
import styles from "./CarouselSection2Loading.module.css";

const { useBreakpoint } = Grid;

const CarouselSection2Loading = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <div className={styles.section} aria-busy="true" aria-label="Loading carousel">
      <div className={styles.heroWrap}>
        <Skeleton.Node
          active
          style={{ width: '100vw', 
            height: isMobile ? '50vh' : '75vh', 
            borderRadius: 0 }}
        />
      </div>

      <section className={styles.contentSection}>
        <Skeleton.Input
          active
          style={{ width: isMobile ? 120 : 160, height: isMobile ? 10 : 12 }}
        />
        <Skeleton.Node
          active
          style={{
            width: isMobile ? 32 : 52,
            height: isMobile ? 2 : 3,
            borderRadius: 2,
            margin: isMobile ? "0.5rem 0 0.75rem" : "0.75rem 0 1.25rem",
          }}
        />
        <Skeleton.Input
          active
          style={{
            width: isMobile ? 72 : 58,
            height: isMobile ? 16 : 22,
            marginBottom: 8,
          }}
        />
        <Skeleton.Input
          active
          style={{ width: isMobile ? "58%" : "48%", height: isMobile ? 16 : 22 }}
        />
      </section>
    </div>
  );
};

export default CarouselSection2Loading;
