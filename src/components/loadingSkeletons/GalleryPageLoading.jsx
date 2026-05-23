import { Skeleton, Grid } from "antd";

const { useBreakpoint } = Grid;

const GalleryPageLoading = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
        gap: 20,
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((_, i) => (
        <Skeleton.Image
          key={i}
          active
          style={{ width: "100%", height: 200, borderRadius: 8 }}
        />
      ))}
    </div>
  );
};

export default GalleryPageLoading;
