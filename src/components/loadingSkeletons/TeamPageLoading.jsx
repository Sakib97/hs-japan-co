import { Skeleton, Grid } from "antd";

const { useBreakpoint } = Grid;

const cardShell = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  textAlign: "center",
  background: "#fff",
  border: "1px solid #eaeaea",
  borderRadius: 14,
  padding: "28px 24px 24px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
};

const chairmanShell = {
  ...cardShell,
  maxWidth: 640,
  borderRadius: 16,
  padding: "36px 40px 32px",
  boxShadow: "0 8px 28px rgba(79, 70, 229, 0.08)",
};

const MemberCardSkeleton = ({
  avatarSize,
  nameWidth,
  roleWidth,
  rows = 2,
  shellStyle = cardShell,
}) => (
  <div style={shellStyle}>
    <Skeleton.Node
      active
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: "50%",
        marginBottom: 16,
        flexShrink: 0,
      }}
    />
    <Skeleton.Input
      active
      style={{
        width: nameWidth,
        height: 16,
        marginBottom: 8,
      }}
    />
    <Skeleton.Input
      active
      style={{
        width: roleWidth,
        height: 10,
      }}
    />
    <div
      style={{
        width: "100%",
        marginTop: 14,
        paddingTop: 14,
        borderTop: "1px solid #f1f5f9",
      }}
    >
      <Skeleton
        active
        title={false}
        paragraph={{
          rows,
          width: rows === 3 ? ["100%", "95%", "82%"] : ["100%", "88%"],
        }}
      />
    </div>
  </div>
);

const TeamPageLoading = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.lg;

  const gridColumns = isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)";

  return (
    <section
      style={{
        padding: isMobile ? "40px 0 56px" : "40px 0 80px",
        background: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          
          <Skeleton.Input
            active
            style={{
              width: isMobile ? 220 : 280,
              height: isMobile ? 28 : 34,
              margin: "0 auto",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 48,
            width: "100%",
          }}
        >
          <MemberCardSkeleton
            shellStyle={{ ...chairmanShell, maxWidth: isMobile ? "100%" : "70%" }}
            avatarSize={isMobile ? 112 : 132}
            nameWidth={isMobile ? "72%" : "55%"}
            roleWidth={isMobile ? "48%" : "38%"}
            rows={3}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridColumns,
            gap: isMobile ? 20 : 28,
          }}
        >
          {[1, 2, 3].map((item) => (
            <MemberCardSkeleton
              key={item}
              avatarSize={96}
              nameWidth="75%"
              roleWidth="50%"
              rows={2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamPageLoading;
