import { Skeleton, Flex, Space, Grid } from "antd";

const { useBreakpoint } = Grid;

const AllActivitiesLoading = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <Space
      direction="vertical"
      size={18}
      style={{
        width: "100%",
        padding: isMobile ? 16 : 30,
      }}
    >
      {[1, 2].map((item) => (
        <div
          key={item}
          style={{
            background: "#ededf3",
            borderRadius: 18,
            padding: isMobile ? 16 : 22,
          }}
        >
          <Flex justify="space-between" align="center" gap={16}>
            {/* Left */}
            <Flex align="center" gap={16} flex={1}>
              {/* Date */}
              <Skeleton.Node
                active
                style={{
                  width: isMobile ? 100 : 170,
                  height: isMobile ? 100 : 110,
                  borderRadius: 14,
                  flexShrink: 0,
                }}
              />

              {/* Content */}
              <div style={{ flex: 1 }}>
                <Skeleton.Input
                  active
                  style={{
                    width: isMobile ? 100 : 260,
                    height: 24,
                    marginBottom: 12,
                  }}
                />
                <br />
                <Skeleton.Input
                  active
                  style={{
                    width: isMobile ? 180 : 360,
                    height: 14,
                    marginBottom: 12,
                  }}
                />
                <br />
                <Skeleton.Input
                  active
                  style={{
                    width: isMobile ? 100 : 160,
                    height:10,
                    marginBottom: 12,
                  }}
                />

                
              </div>
            </Flex>

          </Flex>
        </div>
      ))}
    </Space>
  );
};

export default AllActivitiesLoading;
