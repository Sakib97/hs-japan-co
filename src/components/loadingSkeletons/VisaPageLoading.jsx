import { Skeleton, Grid } from "antd";

const { useBreakpoint } = Grid;

const VisaPageLoading = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          height: isMobile ? "auto" : "390px",
          padding: isMobile ? "40px 20px" : "80px 95px",
          background: "#2b2b2b",
        }}
      >
        <Skeleton.Input
          active
          style={{ width: 260, height: 50, marginBottom: 24 }}
        />

        <div style={{ maxWidth: 520 }}>
          <Skeleton
            active
            paragraph={{ rows: 4, width: ["100%", "95%", "90%", "75%"] }}
            title={false}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 30,
          }}
        >
          <Skeleton.Button active style={{ width: 170, height: 44 }} />
          <Skeleton.Button active style={{ width: 170, height: 44 }} />
        </div>
      </div>

      {/* Eligibility Section */}
      <div
        style={{
          padding: isMobile ? "40px 20px" : "70px 100px",
          background: "#f5f5f5",
        }}
      >
        {/* Section Title */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 50,
          }}
        >
          <Skeleton.Input
            active
            style={{ width: 320, height: 42, marginBottom: 18 }}
          />

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Skeleton.Input active style={{ width: 350, height: 20 }} />
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 24,
              }}
            >
              <Skeleton.Avatar
                active
                shape="square"
                size={46}
                style={{ marginBottom: 20, marginRight: 10 }}
              />

              <Skeleton.Input
                active
                style={{ width: "65%", height: 24, marginBottom: 20 }}
              />

              <Skeleton
                active
                title={false}
                paragraph={{
                  rows: 4,
                  width: ["100%", "95%", "90%", "70%"],
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisaPageLoading;
