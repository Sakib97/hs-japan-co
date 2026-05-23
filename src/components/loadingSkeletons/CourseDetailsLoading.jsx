import { Skeleton, Flex, Space, Grid } from "antd";

const { useBreakpoint } = Grid;

const CourseDetailsLoading = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  return (
    <div
      style={{
        padding: isMobile ? "20px 16px" : "30px 10px",
        // background: "#f5f5f5",
      }}
    >
      {/* Title */}
      <Skeleton.Input
        active
        style={{
          width: isMobile ? "100%" : 360,
          height: isMobile ? 38 : 48,
          marginBottom: 28,
        }}
      />
      <br />

      {/* Banner Image */}
      <Skeleton.Node
        active
        style={{
          width: isMobile ? 300 : 700,
          height: isMobile ? 220 : 320,
          borderRadius: 18,
          marginBottom: 40,
        }}
      >
        <div />
      </Skeleton.Node>

      {/* Section Title */}
      <Flex align="center" gap={12} style={{ marginBottom: 24 }}>
        <div
          style={{
            width: 4,
            height: 28,
            background: "#e5e5e5",
            borderRadius: 4,
          }}
        />

        <Skeleton.Input
          active
          style={{
            width: isMobile ? 180 : 240,
            height: 30,
          }}
        />
      </Flex>

      {/* Paragraphs */}
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        {[1, 2, 3, 4].map((item) => (
          <Skeleton
            key={item}
            active
            title={false}
            paragraph={{
              rows: isMobile ? 3 : 4,
              width: ["100%", "98%", "92%", "80%"],
            }}
          />
        ))}
      </Space>
    </div>
  );
};

export default CourseDetailsLoading;
