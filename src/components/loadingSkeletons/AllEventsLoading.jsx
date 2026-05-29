import { Skeleton, Flex, Space, Grid } from "antd";

const { useBreakpoint } = Grid;

const AllEventsLoading = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <Space
      orientation="vertical"
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
          <Flex
            vertical={isMobile}
            justify="space-between"
            align={isMobile ? "stretch" : "center"}
            gap={16}
          >
            {/* Top: date + content */}
            <Flex align="flex-start" gap={16} flex={1}>
              <Skeleton.Node
                active
                style={{
                  width: isMobile ? 64 : 76,
                  height: isMobile ? 64 : 76,
                  borderRadius: 10,
                  flexShrink: 0,
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <Skeleton.Input
                  active
                  style={{
                    width: isMobile ? "80%" : 260,
                    height: 24,
                    marginBottom: 12,
                  }}
                />
                
                <br />
                <Skeleton.Input
                  active
                  style={{
                    width: isMobile ? "55%" : 200,
                    height: 14,
                    marginBottom: 8,
                  }}
                />
              <br />
                
                <Skeleton.Input
                  active
                  style={{
                    width: isMobile ? "70%" : 240,
                    height: 14,
                    marginBottom: 8,
                  }}
                />
                <br />
                <Skeleton.Input
                  active
                  style={{
                    width: isMobile ? "50%" : 180,
                    height: 14,
                  }}
                />
              </div>
            </Flex>

            {/* Bottom image on mobile, side image on desktop */}
            <Skeleton.Node
              active
              style={{
                width: isMobile ? "100%" : 150,
                height: isMobile ? 170 : 100,
                borderRadius: 12,
                flexShrink: 0,
              }}
            />
          </Flex>
        </div>
      ))}
    </Space>
  );
};

export default AllEventsLoading;
