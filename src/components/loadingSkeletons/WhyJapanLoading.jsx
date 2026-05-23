import { Skeleton, Grid } from "antd";

const { useBreakpoint } = Grid;

const WhyJapanLoading = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  return (
    <div
      style={{
        padding: isMobile ? "30px 20px" : "60px 70px",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1.3fr",
          gap: isMobile ? 24 : 50,
          alignItems: "start",
        }}
      >
        {/* Left Image */}
        <Skeleton.Image
          active
          style={{
            width: "100%",
            height: 280,
            borderRadius: 16,
          }}
        />

        {/* Right Content */}
        <div>
          {/* Heading */}
          <Skeleton.Input
            active
            style={{
              width: 100,
              height: 55,
              marginBottom: 18,
            }}
          />

          {/* Paragraph */}
          <Skeleton
            active
            title={false}
            paragraph={{
              rows: 3,
              width: ["100%", "95%", "85%"],
            }}
          />

          {/* List */}
          <div style={{ marginTop: 25, paddingLeft: 20 }}>
            {[1, 2].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 18,
                }}
              >
                <Skeleton.Input active style={{ width: 20, height: 20 }} />

                <Skeleton.Input active style={{ width: "65%", height: 20 }} />
              </div>
            ))}
          </div>

          {/* Bottom Paragraph */}
          <Skeleton
            active
            title={false}
            paragraph={{
              rows: 2,
              width: ["100%", "75%"],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WhyJapanLoading;
