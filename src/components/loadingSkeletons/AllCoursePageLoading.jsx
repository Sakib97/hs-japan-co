import { Spin, Skeleton, Flex, Space, Grid } from "antd";

const { useBreakpoint } = Grid;

const AllCoursePageLoading = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  return (
    <div
      style={{
        // padding: "20px",
        // background: "#f5f5f5",
      }}
    >
      <div className="course-skeleton-grid">
        {[1, 2, 3].map((item) => (
          <div key={item} className="course-skeleton-card">
            {/* Image */}
            <Skeleton.Image
              active
              style={{
                width: isMobile ? 390 : 400,
                height: 200,
              }}
            />

            {/* Content */}
            <div style={{ padding: 20 }}>
              {/* Tag */}
              <Skeleton.Input
                active
                size="small"
                style={{
                  width: 190,
                  height: 26,
                  marginBottom: 18,
                }}
              />

              {/* Title */}
              <Skeleton.Input
                active
                style={{
                  width: 100,
                  height: 28,
                  marginBottom: 16,
                }}
              />

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <Skeleton.Input
                  active
                  size="small"
                  style={{
                    width: 100,
                    height: 18,
                  }}
                />

                <Skeleton.Button
                  active
                  size="small"
                  style={{
                    width: 110,
                    height: 32,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Responsive Styles */}
      <style>{`
        .course-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .course-skeleton-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #f0f0f0;
          width: 100%;
        }

        @media (max-width: 992px) {
          .course-skeleton-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .course-skeleton-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AllCoursePageLoading;
