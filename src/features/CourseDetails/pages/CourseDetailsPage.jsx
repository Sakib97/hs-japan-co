import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QK_COURSE_DETAIL } from "../../../config/queryKeyConfig";
import { supabase } from "../../../config/supabaseClient";
import { useAuth } from "../../../context/AuthProvider";
import styles from "../styles/CourseDetailsPage.module.css";
import { decodeCourseID } from "../../../utils/generateToken";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const decodedId = decodeCourseID(id);
  if (!decodedId) {
    navigate(-1);
    return null;
  }

  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QK_COURSE_DETAIL, decodedId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course")
        .select(
          "id, course_code, course_name, course_level, course_duration, instructor_name, instructor_description, course_description, cover_image_url",
        )
        .eq("id", decodedId)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const initials = (name) =>
    (name || "?")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className={styles.errorWrapper}>
        <p>Course not found.</p>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ── Header ── */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            {course.course_name}
            {course.course_level && (
              <span className={styles.titleLevel}>
                {" "}
                ({course.course_level})
              </span>
            )}
          </h1>
        </div>

        {/* ── Hero image ── */}
        <div className={styles.heroWrapper}>
          <img
            src={course.cover_image_url}
            alt={course.course_name}
            className={styles.heroImg}
          />
          <div className={styles.heroOverlay}>
            {course.course_level && (
              <span className={styles.heroBadge}>
                {course.course_level} LEVEL CERTIFICATE
              </span>
            )}
            {course.course_code && (
              <span className={styles.heroBadge}>
                {course.course_code}
              </span>
            )}
            <p className={styles.heroSubtitle}>{course.course_name}</p>
          </div>
        </div>

        {/* ── Course Description ── */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Course Description</h2>
          <div
            className={styles.descriptionHtml}
            dangerouslySetInnerHTML={{ __html: course.course_description }}
          />
        </div>

        {/* ── Bottom grid: Metadata + Instructor ── */}
        <div className={styles.bottomGrid}>
          {/* Metadata card */}
          <div className={styles.metaCard}>
            <p className={styles.metaLabel}>COURSE METADATA</p>
            <div className={styles.metaTable}>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Level</span>
                <span className={styles.metaValueBadge}>
                  {course.course_level || "—"}
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Duration</span>
                <span className={styles.metaValueRed}>
                  {course.course_duration || "—"}
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Language</span>
                <span className={styles.metaValueRed}>Bengali / English / Japanese</span>
              </div>
              {/* <div className={styles.metaRow}>
                <span className={styles.metaKey}>Access</span>
                <span className={styles.metaValueRed}>Lifetime</span>
              </div> */}
            </div>
          </div>

          {/* Instructor card */}
          <div className={styles.instructorCard}>
            <div className={styles.instructorAvatar}>
              {initials(course.instructor_name)}
            </div>
            <div className={styles.instructorInfo}>
              <p className={styles.instructorName}>{course.instructor_name}</p>
              {/* <p className={styles.instructorRole}>SENIOR LINGUIST</p> */}
              {course.instructor_description && (
                <p className={styles.instructorBio}>
                  {course.instructor_description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
