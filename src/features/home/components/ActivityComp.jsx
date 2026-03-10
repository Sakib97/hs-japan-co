import styles from "../styles/ActivityComp.module.css";

const activities = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400&h=250&fit=crop",
    title: "Annual Cultural Festival 2023",
    date: "March 10, 2023",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
    title: "Japanese Speech Competition",
    date: "February 18, 2023",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop",
    title: "Student Workshop on JLPT Preparation",
    date: "January 25, 2023",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=250&fit=crop",
    title: "New Batch Orientation Program",
    date: "December 5, 2022",
  },
];

const ActivityComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Our Activities</h2>
        <div className={styles.list}>
          {activities.map((activity) => (
            <div key={activity.id} className={styles.tile}>
              <div className={styles.imageWrapper}>
                <img
                  src={activity.image}
                  alt={activity.title}
                  className={styles.tileImage}
                />
              </div>
              <div className={styles.tileContent}>
                <h3 className={styles.tileTitle}>{activity.title}</h3>
                <span className={styles.tileDate}>
                  <i className="fa-regular fa-calendar" />
                  {activity.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivityComp;
