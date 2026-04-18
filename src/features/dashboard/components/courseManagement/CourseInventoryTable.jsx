import { useState } from "react";
import styles from "../../styles/CourseInventoryTable.module.css";

const LEVEL_COLORS = {
  N1: { bg: "#dcfce7", color: "#15803d" },
  N2: { bg: "#dbeafe", color: "#1d4ed8" },
  N3: { bg: "#fef9c3", color: "#a16207" },
  N4: { bg: "#f3e8ff", color: "#7e22ce" },
  N5: { bg: "#fee2e2", color: "#b91c1c" },
};

// Mock data – replace with real query results
const MOCK_COURSES = [
  {
    id: 1,
    name: "Essential Kanji Mastery",
    updatedAt: "2 days ago",
    level: "N5",
    duration: "3 Months",
    instructor: { name: "Kenji Tanaka", avatar: null },
    active: true,
    thumbnail: null,
  },
  {
    id: 2,
    name: "Business Etiquette & Keigo",
    updatedAt: "1 week ago",
    level: "N2",
    duration: "6 Months",
    instructor: { name: "Sayaka Sato", avatar: null },
    active: true,
    thumbnail: null,
  },
  {
    id: 3,
    name: "N1 Exam Preparation",
    updatedAt: "1 month ago",
    level: "N1",
    duration: "12 Months",
    instructor: { name: "Hiroshi Abe", avatar: null },
    active: false,
    thumbnail: null,
  },
];

const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const CourseInventoryTable = ({ courses = MOCK_COURSES, onEdit, onToggle }) => {
  const [rows, setRows] = useState(courses);

  const handleToggle = (id) => {
    setRows((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    );
    onToggle?.(id);
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Course Inventory</h2>
        <div className={styles.actions}>
          <button type="button" className={styles.outlineBtn}>
            &#9776;&nbsp; Filter
          </button>
          <button type="button" className={styles.outlineBtn}>
            &#8593;&nbsp; Export
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Course Name</th>
              <th className={styles.th}>Level</th>
              <th className={styles.th}>Duration</th>
              <th className={styles.th}>Instructor</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((course) => {
              const levelStyle = LEVEL_COLORS[course.level] ?? {};
              return (
                <tr key={course.id} className={styles.row}>
                  {/* Course name + thumbnail */}
                  <td className={styles.td}>
                    <div className={styles.courseCell}>
                      <div className={styles.thumbnail}>
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.name}
                            className={styles.thumbnailImg}
                          />
                        ) : (
                          <span className={styles.thumbnailPlaceholder}>
                            &#127979;
                          </span>
                        )}
                      </div>
                      <div>
                        <p className={styles.courseName}>{course.name}</p>
                        <p className={styles.courseUpdated}>
                          Updated {course.updatedAt}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Level badge */}
                  <td className={styles.td}>
                    <span
                      className={styles.badge}
                      style={{
                        background: levelStyle.bg,
                        color: levelStyle.color,
                      }}
                    >
                      {course.level}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className={`${styles.td} ${styles.muted}`}>
                    {course.duration}
                  </td>

                  {/* Instructor */}
                  <td className={styles.td}>
                    <div className={styles.instructorCell}>
                      <div className={styles.avatar}>
                        {course.instructor.avatar ? (
                          <img
                            src={course.instructor.avatar}
                            alt={course.instructor.name}
                            className={styles.avatarImg}
                          />
                        ) : (
                          <span>{initials(course.instructor.name)}</span>
                        )}
                      </div>
                      <span className={styles.instructorName}>
                        {course.instructor.name}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className={styles.td}>
                    <span
                      className={`${styles.status} ${course.active ? styles.statusActive : styles.statusInactive}`}
                    >
                      <span className={styles.statusDot} />
                      {course.active ? "Active" : "Deactivated"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className={styles.td}>
                    <div className={styles.actionsCell}>
                      <button
                        type="button"
                        className={styles.editBtn}
                        title="Edit"
                        onClick={() => onEdit?.(course)}
                      >
                        &#9998;
                      </button>
                      <button
                        type="button"
                        className={`${styles.toggle} ${course.active ? styles.toggleOn : styles.toggleOff}`}
                        onClick={() => handleToggle(course.id)}
                        title={course.active ? "Deactivate" : "Activate"}
                        aria-pressed={course.active}
                      >
                        <span className={styles.toggleThumb} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CourseInventoryTable;
