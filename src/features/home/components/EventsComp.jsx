import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "../../../config/supabaseClient";
import { QK_EVENTS } from "../../../config/queryKeyConfig";
import styles from "../styles/EventsComp.module.css";
import { FaArrowRightLong } from "react-icons/fa6";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const parseDate = (dateStr) => {
  if (!dateStr) return { day: "—", month: "", year: "" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { day: dateStr, month: "", year: "" };
  return {
    day: d.getDate(),
    month: MONTHS[d.getMonth()],
    year: d.getFullYear(),
  };
};

const EventsComp = () => {
  const { data: events = [] } = useQuery({
    queryKey: [QK_EVENTS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events_page")
        .select(
          "id, event_title, cover_url, event_date, event_time, event_place, event_speaker",
        )
        .order("event_date", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    },
  });

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
              {events.map((event) => {
                const { day, month, year } = parseDate(event.event_date);
                return (
                  <div key={event.id} className={styles.eventCard}>
                    <div className={styles.dateBadge}>
                      <span className={styles.dateDay}>{day}</span>
                      <span className={styles.dateMonth}>
                        {month}
                        {year ? `, ${year}` : ""}
                      </span>
                    </div>
                    <div className={styles.eventInfo}>
                      <h3 className={styles.eventTitle}>
                        {event.event_title ?? "—"}
                      </h3>
                      <div className={styles.eventMeta}>
                        {event.event_time && (
                          <span className={styles.metaItem}>
                            <i className="fa-regular fa-clock" />
                            {event.event_time}
                          </span>
                        )}
                        {event.event_place && (
                          <span className={styles.metaItem}>
                            <i className="fa-solid fa-building-columns" />
                            {event.event_place}
                          </span>
                        )}
                        {event.event_speaker && (
                          <span className={styles.metaItem}>
                            <i className="fa-regular fa-user" />
                            {event.event_speaker}
                          </span>
                        )}
                      </div>
                    </div>
                    {event.cover_url && (
                      <img
                        src={event.cover_url}
                        alt={event.event_title ?? ""}
                        className={styles.coverThumb}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Decorative dot */}
            <div className={styles.decorDot} />

            {/* View All Events link */}
            <Link to="/events" className={styles.viewAllLink}>
              View All Events <FaArrowRightLong />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsComp;
