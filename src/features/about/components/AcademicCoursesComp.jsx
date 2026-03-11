import styles from "../styles/AcademicCoursesComp.module.css";

const courses = [
  {
    id: 1,
    icon: "fa-solid fa-briefcase",
    label: "Employment Opportunities",
    color: "#4f46e5",
  },
  {
    id: 2,
    icon: "fa-solid fa-flask",
    label: "Research and Education",
    color: "#e74c3c",
  },
  {
    id: 3,
    icon: "fa-solid fa-torii-gate",
    label: "Access to Japanese Market",
    color: "#f39c12",
  },
  {
    id: 4,
    icon: "fa-solid fa-user-tie",
    label: "Specified Skilled Worker (SSW)",
    color: "#2ecc71",
  },
  {
    id: 5,
    icon: "fa-solid fa-graduation-cap",
    label: "Professional Job",
    color: "#9b59b6",
  },
  {
    id: 6,
    icon: "fa-solid fa-file-lines",
    label: "Document Services",
    color: "#3498db",
  },
];

const AcademicCoursesComp = () => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Academic Courses</h3>
      <ul className={styles.list}>
        {courses.map((course) => (
          <li key={course.id} className={styles.item}>
            <span
              className={styles.iconWrapper}
              style={{ backgroundColor: course.color }}
            >
              <i className={course.icon} />
            </span>
            <span className={styles.label}>{course.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AcademicCoursesComp;
