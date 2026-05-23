import { Skeleton, Grid } from "antd";

const { useBreakpoint } = Grid;

const TeamPageLoading = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  return (
    <div>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <Skeleton.Input active style={{ width: 220 }} />
      </div>

      {/* Top single card */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 220 }}>
          <Skeleton.Avatar active size={100} shape="circle" />
          <div style={{ marginTop: 16 }}>
            <Skeleton.Input active style={{ width: "80%" }} />
          </div>
          <div style={{ marginTop: 8 }}>
            <Skeleton.Input active style={{ width: "60%" }} />
          </div>
        </div>
      </div>

      {/* Bottom 3 cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 20,
          marginTop: 40,
        }}
      >
        {[1, 2, 3].map((_, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <Skeleton.Input active style={{ width: "70%" }} />
            <div style={{ marginTop: 8 }}>
              <Skeleton.Input active style={{ width: "50%" }} />
            </div>

            <div style={{ marginTop: 16 }}>
              <Skeleton.Avatar active size={80} shape="circle" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPageLoading;
