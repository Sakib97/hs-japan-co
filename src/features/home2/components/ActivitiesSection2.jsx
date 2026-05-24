import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { List } from "antd";
import { FaArrowRightLong } from "react-icons/fa6";
import { supabase } from "../../../config/supabaseClient";
import { QK_ACTIVITIES } from "../../../config/queryKeyConfig";
import styles from "./ActivitiesSection2.module.css";
import AllActivitiesLoading from "../../../components/loadingSkeletons/AllActivitiesLoading";
import { Grid } from "antd";

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

const ActivitiesSection2 = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const { data: activities = [], isLoading } = useQuery({
    queryKey: [QK_ACTIVITIES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities_page")
        .select("id, activity_title, cover_url, activity_desc, activity_date")
        .order("activity_date", { ascending: true })
        .limit(4);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

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

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Our Activities</h2>
        <div className={styles.titleBar} />
      </div>

    

      <List
        dataSource={activities}
        className={styles.list}
        split={false}
        renderItem={(activity) => (
          <List.Item key={activity.id} className={styles.listItem}>
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

      <div className={styles.viewAllWrap}>
        <Link to="/activities" className={styles.viewAllLink}>
          View All Activities <FaArrowRightLong />
        </Link>
      </div>
    </section>
  );
};

export default ActivitiesSection2;
