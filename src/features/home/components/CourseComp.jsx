import { supabase } from "../../../config/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import styles from "../styles/CourseComp.module.css";

const CourseComp = () => {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["home-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course")
        .select(
          "id, course_name, course_level, cover_image_url, instructor_name, course_duration",
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <i
          key={index}
          className={`fa-solid fa-star ${index < Math.floor(rating) ? styles.starFilled : styles.starEmpty}`}
        />
      ));
  };

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Explore Courses</h2>
          <div className={styles.cardsContainer}>
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className={`${styles.card} ${styles.skeleton}`} />
              ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Explore Courses</h2>
        <div className={styles.cardsContainer}>
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className={styles.cardLink}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={course.cover_image_url}
                  alt={course.course_name}
                  className={styles.courseImage}
                />
                <span className={styles.levelBadge}>{course.course_level}</span>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.ratingWrapper}>
                  <div className={styles.stars}>{renderStars(5)}</div>
                  <span className={styles.ratingText}>(5.0)</span>
                </div>
                <h3 className={styles.courseTitle}>{course.course_name}</h3>
                <p className={styles.instructor}>
                  BY {(course.instructor_name ?? "").toUpperCase()}
                </p>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.footerItem}>
                  <i className="fa-solid fa-calendar-days" />
                  <span>{course.course_duration}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseComp;
