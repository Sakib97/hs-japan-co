import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input, Pagination, Modal, Image, Grid } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { supabase } from "../../../config/supabaseClient";
import { QK_ALL_ACTIVITIES } from "../../../config/queryKeyConfig";
import styles from "../styles/AllActivitiesPage.module.css";
import AllActivitiesLoading from "../../../components/loadingSkeletons/AllActivitiesLoading";

const PAGE_SIZE = 8;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const parseDate = (dateStr) => {
  if (!dateStr) return { day: "—", month: "", year: "" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { day: dateStr, month: "", year: "" };
  return {
    day: d.getDate(),
    month: MONTHS[d.getMonth()],
    year: d.getFullYear(),
  };
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatFullDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const { useBreakpoint } = Grid;

const AllActivitiesPage = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: [QK_ALL_ACTIVITIES, currentPage, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("activities_page")
        .select("id, activity_title, cover_url, activity_desc, activity_date", {
          count: "exact",
        })
        .eq("is_active", true)
        .order("activity_date", { ascending: false })
        .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);

      if (searchQuery.trim()) {
        query = query.or(
          `activity_title.ilike.%${searchQuery.trim()}%,activity_desc.ilike.%${searchQuery.trim()}%`,
        );
      }

      const { data, error, count } = await query;
      if (error) throw new Error(error.message);
      return { activities: data ?? [], total: count ?? 0 };
    },
    keepPreviousData: true,
  });

  const activities = data?.activities ?? [];
  const total = data?.total ?? 0;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openActivityModal = (activity) => setSelectedActivity(activity);
  const closeActivityModal = () => setSelectedActivity(null);

  const handleTileKeyDown = (e, activity) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openActivityModal(activity);
    }
  };

  const selectedDate = selectedActivity
    ? parseDate(selectedActivity.activity_date)
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>What We Do</p>
          <h1 className={styles.heroTitle}>Our Activities</h1>
          <p className={styles.heroSub}>
            Explore the events, workshops, and community initiatives we are
            proud to share.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.toolbar}>
          <Input
            className={styles.searchInput}
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            placeholder="Search activities…"
            value={searchQuery}
            onChange={handleSearch}
            allowClear
          />
          {!isLoading && (
            <span className={styles.count}>
              {total} activit{total !== 1 ? "ies" : "y"} found
            </span>
          )}
        </div>

        {isLoading ? (
          <div className={styles.loadingWrap}>
            <AllActivitiesLoading />
          </div>
        ) : activities.length === 0 ? (
          <div className={styles.empty}>
            <i className="fa-regular fa-folder-open" />
            <span>No activities found</span>
          </div>
        ) : (
          <div className={styles.list}>
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={styles.tile}
                role="button"
                tabIndex={0}
                onClick={() => openActivityModal(activity)}
                onKeyDown={(e) => handleTileKeyDown(e, activity)}
                aria-label={`View details for ${activity.activity_title ?? "activity"}`}
              >
                {activity.cover_url && (
                  <div className={styles.imageWrap}>
                    <Image
                      src={activity.cover_url}
                      alt={activity.activity_title ?? ""}
                      className={styles.tileImage}
                      width={isMobile ? undefined : 160}
                      height={isMobile ? undefined : 80}
                      style={{ objectFit: "cover", borderRadius: 10 }}
                      preview={false}
                    />
                    <div className={styles.zoomOverlay}>
                      <i className="fi fi-br-zoom-in" />
                    </div>
                  </div>
                )}
                <div className={styles.tileContent}>
                  <h3 className={styles.tileTitle}>
                    {activity.activity_title ?? "—"}
                  </h3>
                  {activity.activity_desc && (
                    <p className={styles.tileDesc}>{activity.activity_desc}</p>
                  )}
                  {activity.activity_date && (
                    <span className={styles.tileDate}>
                      <i className="fa-regular fa-calendar" />
                      {formatDate(activity.activity_date)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {total > PAGE_SIZE && (
          <div className={styles.paginationWrap}>
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>

      <Modal
        open={!!selectedActivity}
        onCancel={closeActivityModal}
        footer={null}
        width={680}
        centered
        destroyOnHidden
        className={styles.activityModal}
        title={ <div className={styles.modalTitle}>
                  {selectedActivity?.activity_title ?? "—"}
                  <hr />
                </div>}
        style={{
          top: isMobile ? "0px" : "25px",
          maxHeight: isMobile ? "calc(100vh - 120px)" : "calc(100vh - 160px)",
          overflowY: "auto",
          borderRadius: "6px",
          zIndex: 1000,
        }}
        closeIcon={
          <CloseOutlined
            style={{
              fontSize: 15,
              color: "black",
              backgroundColor: "white",
              borderRadius: "30%",
              padding: "4px",
              border: "3px solid rgb(36, 34, 34)",
            }}
          />
        }
      >
        {selectedActivity && (
          <div className={styles.modalContent}>
            {selectedActivity.cover_url && (
              <div className={styles.modalCoverWrap}>
                <Image
                  src={selectedActivity.cover_url}
                  alt={selectedActivity.activity_title ?? ""}
                  className={styles.modalCover}
                  preview={{ mask: "View full image" }}
                />
              </div>
            )}

            <div className={styles.modalBody}>
              {/* <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {selectedActivity.activity_title ?? "—"}
                </h2>
              </div> */}

              {selectedActivity.activity_date && (
                <div className={styles.modalMetaGrid}>
                  <div className={styles.modalMetaItem}>
                    <span className={styles.modalMetaIcon}>
                      <i className="fa-regular fa-calendar" />
                    </span>
                    <div style={{ transform: "translateY(5px)" }}>
                      {/* <span className={styles.modalMetaLabel}>Date</span> */}
                      <span className={styles.modalMetaValue}>
                        {formatFullDate(selectedActivity.activity_date)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedActivity.activity_desc && (
                <div className={styles.modalDescSection}>
                  <h3 className={styles.modalDescLabel}>About this activity</h3>
                  <p className={styles.modalDesc}>
                    {selectedActivity.activity_desc}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllActivitiesPage;
