import { Skeleton, Space, Flex, Grid } from "antd";

const { useBreakpoint } = Grid;

const EventsAndStoriesLoading = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr",
        width: "100%",
        gap: 0,
        overflow: "hidden",
      }}
    >
      {/* Left Side */}
      <div style={{ padding: isMobile ? "20px 16px" : 40, overflowX: "hidden" }}>
        <Skeleton.Input
          active
          style={{
            width: 220,
            height: 36,
            marginBottom: 30,
          }}
        />

        <Space direction="vertical" size={18} style={{ width: "100%" }}>
          {[1, 2].map((item) => (
            <div
              key={item}
              style={{
                background: "#e2e1e9",
                borderRadius: 18,
                padding: 18,
              }}
            >
              <Flex justify="space-between" align="center" gap={16}>
                <Flex align="center" gap={16} flex={1}>
                  <Skeleton.Node
                    active
                    style={{
                      width: 60,
                      height: 70,
                      borderRadius: 12,
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <Skeleton.Input
                      active
                      style={{
                        width: "70%",
                        height: 22,
                        marginBottom: 10,
                      }}
                    />
                    <br />

                    <Skeleton.Input
                      active
                      size="small"
                      style={{
                        width: "50%",
                        height: 14,
                      }}
                    />
                  </div>
                </Flex>

                <Skeleton.Node
                  active
                  style={{
                    width: isMobile ? 50 : 120,
                    height: 60,
                    borderRadius: 10,
                  }}
                />
              </Flex>
            </div>
          ))}
        </Space>
      </div>

      {/* Right Side */}
      <div
        style={{
          background: "#e2e1e9",
          padding: isMobile ? "20px 16px" : 40,
          overflowX: "hidden",
        }}
      >
        <Skeleton.Input
          active
          style={{
            width: 200,
            height: 34,
            marginBottom: 30,
          }}
        />

        <Skeleton
          active
          title={false}
          paragraph={{
            rows: 3,
            width: ["100%", "95%", "80%"],
          }}
        />

        <Flex align="center" gap={14} style={{ marginTop: 30 }}>
          <Skeleton.Avatar active size={54} />

          <div>
            <Skeleton.Input
              active
              style={{
                width: 140,
                height: 18,
                marginBottom: 8,
              }}
            />
            <br />

            <Skeleton.Input
              active
              size="small"
              style={{
                width: 100,
                height: 14,
              }}
            />
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default EventsAndStoriesLoading;
