import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { supabase } from "../../../config/supabaseClient";
import styles from "./EventsTestimonialsSection.module.css";

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

const ACCENT_COLORS = ["#c0392b", "#e67e22", "#2980b9", "#16a085"];

const TESTIMONIALS = [
  {
    quote:
      '"HS Japan Academy changed my life. From zero Japanese knowledge to working as a software engineer in Osaka, their guidance was impeccable at every step."',
    name: "Rakib Chowdhury",
    role: "Software Engineer, Osaka",
    initials: "RC",
  },
  {
    quote:
      '"The visa consultation service was incredibly thorough. They handled all my paperwork and I got my student visa approved within weeks."',
    name: "Nusrat Jahan",
    role: "Graduate Student, Tokyo",
    initials: "NJ",
  },
  {
    quote:
      '"Excellent JLPT preparation classes. The instructors are native-level speakers who make learning fun and effective."',
    name: "Mehedi Hassan",
    role: "JLPT N2 Certified",
    initials: "MH",
  },
];

const EventsTestimonialsSection = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const { data: events = [] } = useQuery({
    queryKey: ["home2_events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events_page")
        .select(
          "id, event_title, cover_url, event_date, event_time, event_place, event_speaker",
        )
        .order("event_date", { ascending: true })
        .limit(4);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const prev = () =>
    setActiveIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setActiveIdx((i) => (i + 1) % TESTIMONIALS.length);

  const t = TESTIMONIALS[activeIdx];

  return (
    <section className={styles.section}>
      <div className={styles.layout}>
        {/* Left: Events */}
        <div className={styles.eventsCol}>
          <h2 className={styles.eventsTitle}>Upcoming Events</h2>

          <div className={styles.eventsList}>
            {events.length === 0 && (
              <p className={styles.noEvents}>No upcoming events.</p>
            )}
            {events.map((event, i) => {
              const { day, month, year } = parseDate(event.event_date);
              return (
                <div key={event.id} className={styles.eventCard}>
                  <div
                    className={styles.dateBadge}
                    style={{
                      background: ACCENT_COLORS[i % ACCENT_COLORS.length],
                    }}
                  >
                    <span className={styles.dateDay}>{day}</span>
                    <span className={styles.dateMonthYear}>
                      {month}
                      {year ? `, ${year}` : ""}
                    </span>
                  </div>
                  <div className={styles.eventInfo}>
                    <h4 className={styles.eventTitle}>
                      {event.event_title ?? "—"}
                    </h4>
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

          <Link to="/events" className={styles.viewAllLink}>
            View All Events <FaArrowRightLong />
          </Link>
        </div>

        {/* Right: Testimonials */}
        <div className={styles.testimonialsCol}>
          <h2 className={styles.testimonialsTitle}>Success Stories</h2>
          <p className={styles.quote}>{t.quote}</p>
          <div className={styles.person}>
            <div className={styles.avatar}>{t.initials}</div>
            <div>
              <p className={styles.personName}>{t.name}</p>
              <p className={styles.personRole}>{t.role}</p>
            </div>
          </div>
          <div className={styles.navBtns}>
            <button className={styles.navBtn} onClick={prev}>
              &#8249;
            </button>
            <button className={styles.navBtn} onClick={next}>
              &#8250;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsTestimonialsSection;
