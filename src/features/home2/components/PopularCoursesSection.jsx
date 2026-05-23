import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button, Skeleton } from "antd";
import { FaArrowRightLong } from "react-icons/fa6";
import { supabase } from "../../../config/supabaseClient";
import { encodeCourseID } from "../../../utils/generateToken";
import styles from "./PopularCoursesSection.module.css";

const PopularCoursesSection = () => {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["home2_popular_courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course")
        .select(
          "id, course_name, course_level, cover_image_url, instructor_name, course_duration",
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Popular Courses</h2>
          <p className={styles.subtitle}>
            Start your journey with our top-rated training programmes
          </p>
        </div>
        <Link to="/courses" className={styles.viewAll}>
          View All Courses <FaArrowRightLong />
        </Link>
      </div>

      <div className={styles.cards}>
        {isLoading
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.card}>
                <Skeleton.Image active style={{ width: "100%", height: 160 }} />
                <div className={styles.cardBody}>
                  <Skeleton active paragraph={{ rows: 2 }} title={false} />
                </div>
              </div>
            ))
          : courses.map((course) => (
              <div key={course.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  {course.cover_image_url ? (
                    <img
                      src={course.cover_image_url}
                      alt={course.course_name}
                      className={styles.coverImg}
                    />
                  ) : (
                    <div className={styles.imageFallback}>No Image</div>
                  )}
                  {course.course_level && (
                    <span className={styles.levelBadge}>
                      {course.course_level}
                    </span>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.courseName}>{course.course_name}</h3>
                  {course.instructor_name && (
                    <p className={styles.instructor}>
                      By {course.instructor_name}
                    </p>
                  )}
                  {course.course_duration && (
                    <p className={styles.duration}>
                      <i className="fa-regular fa-clock" />
                      {course.course_duration}
                    </p>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <Link to={`/courses/${encodeCourseID(course.id)}`}>
                    <Button size="small" className={styles.detailsBtn}>
                      Details
                    </Button>
                  </Link>
                  <Link to="/admission">
                    <Button size="small" type="primary" danger>
                      Enroll
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default PopularCoursesSection;
