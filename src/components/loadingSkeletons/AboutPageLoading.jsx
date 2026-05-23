import { Spin, Skeleton, Flex, Space, Grid } from "antd";

const { useBreakpoint } = Grid;

const AboutPageLoading = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  return (
    <div style={{ padding: isMobile ? "80px 5vw 2rem" : "120px 10vw 4rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 20,
        }}
      >
        {/* LEFT */}
        <div style={{ width: isMobile ? "100%" : 250 }}>
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>

        {/* RIGHT */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 20,
            flex: 1,
          }}
        >
          <Skeleton.Node active size={100} />
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    </div>
  );
};

export default AboutPageLoading;
