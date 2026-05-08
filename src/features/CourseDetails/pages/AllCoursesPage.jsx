import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Pagination, Input, Spin } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import { supabase } from "../../../config/supabaseClient";
import { QK_ALL_COURSES } from "../../../config/queryKeyConfig";
import styles from "../styles/AllCoursesPage.module.css";
import { encodeCourseID } from "../../../utils/generateToken";

const PAGE_SIZE = 10;

const LEVEL_COLORS = {
  N1: { bg: "#dcfce7", color: "#15803d" },
  N2: { bg: "#dbeafe", color: "#1d4ed8" },
  N3: { bg: "#fef9c3", color: "#a16207" },
  N4: { bg: "#f3e8ff", color: "#7e22ce" },
  N5: { bg: "#fee2e2", color: "#b91c1c" },
};

const AllCoursesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [QK_ALL_COURSES, currentPage, searchQuery],
    queryFn: async () => {
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("course")
        .select(
          "id, course_name, course_level, course_duration, instructor_name, cover_image_url, created_at",
          { count: "exact" },
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (searchQuery.trim()) {
        query = query.or(
          `course_name.ilike.%${searchQuery.trim()}%,instructor_name.ilike.%${searchQuery.trim()}%,course_level.ilike.%${searchQuery.trim()}%`,
        );
      }

      const { data, error, count } = await query.range(from, to);
      if (error) throw new Error(error.message);
      return { rows: data ?? [], total: count ?? 0 };
    },
    keepPreviousData: true,
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  return (
    <div className={styles.page}>
      {/* ── Hero banner ── */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Explore our curriculum</p>
          <h1 className={styles.heroTitle}>All Courses</h1>
          <p className={styles.heroSub}>
            Discover Japanese language courses crafted to take you from beginner
            to fluency.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        {/* ── Search bar ── */}
        <div className={styles.toolbar}>
          <Input
            placeholder="Search by course name, instructor or level…"
            prefix={<SearchOutlined />}
            allowClear
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          {!isLoading && (
            <span className={styles.count}>
              {total} course{total !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* ── Grid ── */}
        {isLoading ? (
          <div className={styles.loadingWrap}>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </div>
        ) : rows.length === 0 ? (
          <div className={styles.empty}>
            <i className="fa-solid fa-graduation-cap" />
            <p>No courses found.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {rows.map((course) => {
              const levelStyle = LEVEL_COLORS[course.course_level] ?? {
                bg: "#f3f4f6",
                color: "#374151",
              };
              return (
                <Link
                  key={course.id}
                  to={`/courses/${encodeCourseID(course.id)}`}
                  className={styles.card}
                >
                  <div className={styles.imageWrap}>
                    {course.cover_image_url ? (
                      <img
                        src={course.cover_image_url}
                        alt={course.course_name}
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <i className="fa-solid fa-graduation-cap" />
                      </div>
                    )}
                    {course.course_level && (
                      <span
                        className={styles.levelBadge}
                        style={{
                          background: levelStyle.bg,
                          color: levelStyle.color,
                        }}
                      >
                        {course.course_level}
                      </span>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.courseName}>{course.course_name}</h3>
                    {course.instructor_name && (
                      <p className={styles.instructor}>
                        BY {course.instructor_name.toUpperCase()}
                      </p>
                    )}
                    <div className={styles.meta}>
                      {course.course_duration && (
                        <span className={styles.metaItem}>
                          <i className="fa-solid fa-calendar-days" />
                          {course.course_duration}
                        </span>
                      )}
                      <span className={styles.viewMore}>View Details →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {total > PAGE_SIZE && (
          <div className={styles.paginationWrap}>
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              showSizeChanger={false}
              showTotal={(t) => `${t} courses`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCoursesPage;
