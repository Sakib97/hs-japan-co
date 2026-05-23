import { Skeleton, Grid } from "antd";

const { useBreakpoint } = Grid;

const ContactPageLoading = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  return (
    <div>
      {/* Title */}
      <Skeleton.Input active style={{ width: 120, marginBottom: 20 }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 30,
        }}
      >
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i}>
            {/* Office Title */}
            <Skeleton.Input active style={{ width: 140 }} />

            <div style={{ marginTop: 12 }}>
              {/* 4 lines like address/phone/email */}
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactPageLoading;
