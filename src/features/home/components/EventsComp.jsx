import styles from "../styles/EventsComp.module.css";

const events = [
  {
    id: 1,
    day: 15,
    month: "Mar",
    year: 2023,
    title: "Certified Institute Meetup",
    time: "8:00 AM – 5:00 PM",
    location: "Online",
    speakers: 20,
  },
  {
    id: 2,
    day: 26,
    month: "Jan",
    year: 2023,
    title: "Fast Track Course Opening",
    time: "7:00 PM – 12:00 AM",
    location: "Online",
    speakers: 10,
  },
];

const EventsComp = () => {
  return (
    <section className={styles.section}>
      {/* Decorative crescent on right */}
      <div className={styles.crescentRight} />

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left image area */}
          <div className={styles.imageColumn}>
            <img
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=400&fit=crop"
              alt="Event"
              className={styles.eventImage}
            />
          </div>

          {/* Right content area */}
          <div className={styles.contentColumn}>
            <h2 className={styles.title}>Upcoming Events</h2>

            <div className={styles.eventsList}>
              {events.map((event) => (
                <div key={event.id} className={styles.eventCard}>
                  <div className={styles.dateBadge}>
                    <span className={styles.dateDay}>{event.day}</span>
                    <span className={styles.dateMonth}>
                      {event.month}, {event.year}
                    </span>
                  </div>
                  <div className={styles.eventInfo}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <div className={styles.eventMeta}>
                      <span className={styles.metaItem}>
                        <i className="fa-regular fa-clock" />
                        {event.time}
                      </span>
                      <span className={styles.metaItem}>
                        <i className="fa-solid fa-building-columns" />
                        {event.location}
                      </span>
                      <span className={styles.metaItem}>
                        <i className="fa-regular fa-user" />
                        {event.speakers} Speaker
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative dot */}
            <div className={styles.decorDot} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsComp;
