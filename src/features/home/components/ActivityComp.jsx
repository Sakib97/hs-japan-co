import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "../../../config/supabaseClient";
import { QK_ACTIVITIES } from "../../../config/queryKeyConfig";
import styles from "../styles/ActivityComp.module.css";
import { FaArrowRightLong } from "react-icons/fa6";

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

const ActivityComp = () => {
  const { data: activities = [] } = useQuery({
    queryKey: [QK_ACTIVITIES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities_page")
        .select("id, activity_title, cover_url, activity_desc, activity_date")
        .order("activity_date", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Our Activities</h2>
        <div className={styles.list}>
          {activities.map((activity) => (
            <div key={activity.id} className={styles.tile}>
              {activity.cover_url && (
                <div className={styles.imageWrapper}>
                  <img
                    src={activity.cover_url}
                    alt={activity.activity_title ?? ""}
                    className={styles.tileImage}
                  />
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
        <div className={styles.viewAllWrap}>
          <Link to="/activities" className={styles.viewAllLink}>
            View All Activities <FaArrowRightLong />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ActivityComp;
