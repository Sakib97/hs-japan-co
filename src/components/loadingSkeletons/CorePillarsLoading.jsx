import { Skeleton, Flex, Grid } from "antd";

const { useBreakpoint } = Grid;

const CARD_COUNT = 3;

const CorePillarsLoading = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  return (
    <section
      style={{
        padding: isMobile ? "2.5rem 5vw 4rem" : "2.5rem 8vw 4.5rem",
        background: "#ffffff",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <Skeleton.Input
          active
          style={{
            width: isMobile ? 200 : 260,
            height: 38,
            margin: "0 auto 0.75rem",
          }}
        />
        
      </div>

      <Flex
        wrap="wrap"
        justify="center"
        gap={24}
        style={{ width: "100%" }}
      >
        {Array.from({ length: CARD_COUNT }, (_, index) => (
          <div
            key={index}
            style={{
              flex: isMobile ? "1 1 100%" : "1 1 260px",
              maxWidth: isMobile ? "unset" : 340,
              padding: "2rem 1.75rem",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              background: "#f8fafc",
            }}
          >
            <Skeleton.Node
              active
              style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                marginBottom: 20,
              }}
            /> &nbsp; &nbsp;
            <Skeleton.Input
              active
              style={{
                width: "70%",
                height: 18,
                marginBottom: 12,
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
          </div>
        ))}
      </Flex>
    </section>
  );
};

export default CorePillarsLoading;
