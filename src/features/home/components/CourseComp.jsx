import styles from "../styles/CourseComp.module.css";

const courses = [
  {
    id: 1,
    level: "N5",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop",
    title: "Japanese language Learning",
    instructor: "PRIYA NAJMIN",
    rating: 5.0,
    students: 200,
    duration: "4 Months",
  },
  {
    id: 2,
    level: "N4",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop",
    title: "Japanese language Learning",
    instructor: "MAMIKO OGURA",
    rating: 5.0,
    students: 111,
    duration: "4 Months",
  },
  {
    id: 3,
    level: "N3",
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=250&fit=crop",
    title: "Japanese language Learning",
    instructor: "ZAHID IQBAL",
    rating: 5.0,
    students: 93,
    duration: "4 Months",
  },
];

const CourseComp = () => {
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

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Explore Courses</h2>
        <div className={styles.cardsContainer}>
          {courses.map((course) => (
            <div key={course.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={course.image}
                  alt={course.title}
                  className={styles.courseImage}
                />
                <span className={styles.levelBadge}>{course.level}</span>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.ratingWrapper}>
                  <div className={styles.stars}>
                    {renderStars(course.rating)}
                  </div>
                  <span className={styles.ratingText}>({course.rating})</span>
                </div>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.instructor}>BY {course.instructor}</p>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.footerItem}>
                  <i className="fa-solid fa-users" />
                  <span>{course.students} Students</span>
                </div>
                <div className={styles.footerItem}>
                  <i className="fa-solid fa-calendar-days" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseComp;
