import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { List, Grid, Image, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { FaArrowRightLong } from "react-icons/fa6";
import { supabase } from "../../../config/supabaseClient";
import { QK_HOME_ACTIVITIES } from "../../../config/queryKeyConfig";
import styles from "./ActivitiesSection2.module.css";
import AllActivitiesLoading from "../../../components/loadingSkeletons/AllActivitiesLoading";

const { useBreakpoint } = Grid;

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

const ActivitiesSection2 = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [selectedActivity, setSelectedActivity] = useState(null);

  const { data: activities = [], isLoading } = useQuery({
    queryKey: [QK_HOME_ACTIVITIES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities_page")
        .select(
          "id, activity_title, cover_url, activity_desc, activity_date, is_active, is_pinned",
        )
        .eq("is_active", true)
        .order("is_pinned", { ascending: false })
        .order("activity_date", { ascending: false })
        .limit(4);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const openActivityModal = (activity) => setSelectedActivity(activity);
  const closeActivityModal = () => setSelectedActivity(null);

  const handleItemKeyDown = (e, activity) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openActivityModal(activity);
    }
  };

  if (isLoading)
    return (
      <div
        style={{
          padding: isMobile ? "0 10px" : "0 300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AllActivitiesLoading />
      </div>
    );
  if (activities.length === 0) return null;

  const pinned = activities.find((a) => a.is_pinned) ?? null;
  const listItems = activities;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Our Activities</h2>
        <div className={styles.titleBar} />
      </div>

      <div className={`${styles.layout} ${pinned ? styles.layoutWithPin : ""}`}>
        <div className={styles.listCol}>
          {listItems.length > 0 ? (
            <List
              dataSource={listItems}
              className={styles.list}
              split={false}
              renderItem={(activity) => (
                <List.Item
                  key={activity.id}
                  className={styles.listItem}
                  role="button"
                  tabIndex={0}
                  onClick={() => openActivityModal(activity)}
                  onKeyDown={(e) => handleItemKeyDown(e, activity)}
                  aria-label={`View details for ${activity.activity_title ?? "activity"}`}
                >
                  {activity.cover_url && (
                    <div className={styles.thumbWrap}>
                      <img
                        src={activity.cover_url}
                        alt={activity.activity_title ?? ""}
                        className={styles.thumbImg}
                      />
                    </div>
                  )}
                  <div className={styles.itemContent}>
                    <h3 className={styles.itemTitle}>
                      {activity.activity_title ?? "—"}
                    </h3>
                    {activity.activity_desc && (
                      <p className={styles.itemDesc}>{activity.activity_desc}</p>
                    )}
                    {activity.activity_date && (
                      <span className={styles.itemDate}>
                        <i className="fa-regular fa-calendar" />
                        {formatDate(activity.activity_date)}
                      </span>
                    )}
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <p className={styles.emptyHint}>No other activities yet.</p>
          )}

          <div className={styles.viewAllWrap}>
            <Link to="/activities" className={styles.viewAllLink}>
              View All Activities <FaArrowRightLong />
            </Link>
          </div>
        </div>

        {pinned && (
          <aside className={styles.pinnedCol}>
            <div className={styles.pinnedCard}>
              {pinned.cover_url ? (
                <div className={styles.pinnedImageWrap}>
                  <Image
                    src={pinned.cover_url}
                    alt={pinned.activity_title ?? ""}
                    className={styles.pinnedImage}
                  />
                </div>
              ) : (
                <div className={styles.pinnedImagePlaceholder} />
              )}
              <h3 className={styles.pinnedTitle}>
                {pinned.activity_title ?? "—"}
              </h3>
            </div>
          </aside>
        )}
      </div>

      <Modal
        open={!!selectedActivity}
        onCancel={closeActivityModal}
        footer={null}
        width={680}
        zIndex={10000}
        centered
        destroyOnHidden
        className={styles.activityModal}
        title={
          <div className={styles.modalDialogTitle}>
            Details
            <hr />
          </div>
        }
        style={{
          top: isMobile ? "0px" : "25px",
          maxHeight: isMobile ? "calc(100vh - 120px)" : "calc(100vh - 160px)",
          overflowY: "auto",
          borderRadius: "6px",
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
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {selectedActivity.activity_title ?? "—"}
                </h2>
              </div>

              {selectedActivity.activity_date && (
                <div className={styles.modalMetaGrid}>
                  <div className={styles.modalMetaItem}>
                    <span className={styles.modalMetaIcon}>
                      <i className="fa-regular fa-calendar" />
                    </span>
                    <div style={{ transform: "translateY(5px)" }}>
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
    </section>
  );
};

export default ActivitiesSection2;
