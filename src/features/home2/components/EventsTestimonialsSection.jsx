import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Modal, Image, Grid, Divider } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { FaArrowRightLong } from "react-icons/fa6";
import { supabase } from "../../../config/supabaseClient";
import { QK_HOME_SUCCESS_STORIES } from "../../../config/queryKeyConfig";
import EventCardTitle from "../../../components/common/EventCardTitle";
import styles from "./EventsTestimonialsSection.module.css";
import EventsAndStoriesLoading from "../../../components/loadingSkeletons/EventsAndStoriesLoading";

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

const formatFullDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ACCENT_COLORS = ["#c0392b", "#e67e22", "#2980b9", "#16a085"];

const { useBreakpoint } = Grid;

const EventsTestimonialsSection = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: stories = [], isLoading: storiesLoading } = useQuery({
    queryKey: [QK_HOME_SUCCESS_STORIES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("success_stories")
        .select(
          "id, student_name, student_profession, student_image_url, content",
        )
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["home2_events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events_page")
        .select(
          "id, event_title, cover_url, event_date, event_time, event_place, event_speaker, is_active",
        )
        .eq("is_active", true)
        .order("event_date", { ascending: false })
        .limit(4);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const safeIdx = stories.length > 0 ? activeIdx % stories.length : 0;
  const prev = () =>
    setActiveIdx((i) => (i - 1 + stories.length) % Math.max(stories.length, 1));
  const next = () => setActiveIdx((i) => (i + 1) % Math.max(stories.length, 1));

  const t = stories[safeIdx] ?? null;

  const openEventModal = (event) => setSelectedEvent(event);
  const closeEventModal = () => setSelectedEvent(null);

  const handleCardKeyDown = (e, event) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEventModal(event);
    }
  };

  const selectedDate = selectedEvent
    ? parseDate(selectedEvent.event_date)
    : null;

  return (
    <section className={styles.section}>
      {storiesLoading || eventsLoading ? (
        <EventsAndStoriesLoading />

      ) : (
        <div className={styles.layout}>
          {/* Left: Events */}
          <div className={styles.eventsCol}>
            <h2 className={styles.eventsTitle}>Recent Events</h2>

            <div className={styles.eventsList}>
              {events.length === 0 && (
                <p className={styles.noEvents}>No recent events.</p>
              )}
              {events.map((event, i) => {
                const { day, month, year } = parseDate(event.event_date);
                return (
                  <div
                    key={event.id}
                    className={styles.eventCard}
                    role="button"
                    tabIndex={0}
                    onClick={() => openEventModal(event)}
                    onKeyDown={(e) => handleCardKeyDown(e, event)}
                    aria-label={`View details for ${event.event_title ?? "event"}`}
                  >
                    <div className={styles.eventCardTop}>
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
                        <EventCardTitle
                          title={event.event_title}
                          titleClassName={styles.eventTitle}
                          onSeeMore={() => openEventModal(event)}
                        />
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
                    </div>
                    {event.cover_url && (
                      <div className={styles.coverWrap}>
                        <img
                          src={event.cover_url}
                          alt={event.event_title ?? ""}
                          className={styles.coverThumb}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Link to="/events" className={styles.viewAllLink}>
              View All Events <FaArrowRightLong />
            </Link>
          </div>

          {/* Right: Success Stories */}
          <div className={styles.testimonialsCol}>
            <h2 className={styles.testimonialsTitle}>Our Success Stories</h2>

            {t === null ? (
              <p className={styles.noEvents}>No stories yet.</p>
            ) : (
              <>
                <p className={styles.quote}>
                  {t.content ? `"${t.content}"` : "—"}
                </p>
                <div className={styles.person}>
                  {t.student_image_url ? (
                    <img
                      src={t.student_image_url}
                      alt={t.student_name ?? ""}
                      className={styles.avatarImg}
                    />
                  ) : (
                    <div className={styles.avatar}>
                      {(t.student_name?.[0] ?? "?").toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className={styles.personName}>{t.student_name ?? "—"}</p>
                    <p className={styles.personRole}>
                      {t.student_profession ?? ""}
                    </p>
                  </div>
                </div>
                {stories.length > 1 && (
                  <div className={styles.navBtns}>
                    <button className={styles.navBtn} onClick={prev}>
                      <span>&#8249;</span>
                    </button>
                    <button className={styles.navBtn} onClick={next}>
                      <span>&#8250;</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <Modal
        open={!!selectedEvent}
        onCancel={closeEventModal}
        footer={null}
        width={680}
        centered
        destroyOnHidden
        className={styles.eventModal}
        title={
          <div>
            <div className={styles.modalDialogTitle}>Details</div>
            {/* <hr /> */}
            <Divider 
            size="large"
            style={{ margin: "10px", 
              borderColor: "black", 
              transform: "translateX(-2%)",
              // right: "0",
              }} />
          </div>
        }
        style={{
          top: isMobile ? "0px" : "25px",
          maxHeight: isMobile ? "calc(100vh - 120px)" : "calc(100vh - 160px)",
          overflowY: "auto",
          borderRadius: "6px",
          zIndex: 1000,
        }}
        closeIcon={
          <CloseOutlined
            style={{
              fontSize: 15,
              color: "black",
              backgroundColor: "white",
              borderRadius: "30%",
              padding: "4px",
              border: "3px solid rgb(36, 34, 34)",
            }}
          />
        }
      >
        {selectedEvent && (
          <div className={styles.modalContent}>
            {selectedEvent.cover_url && (
              <div className={styles.modalCoverWrap}>
                <Image
                  src={selectedEvent.cover_url}
                  alt={selectedEvent.event_title ?? ""}
                  className={styles.modalCover}
                  preview={{ mask: "View full image" }}
                />
              </div>
            )}

            <div className={styles.modalBody}>
              <div className={styles.modalHeader}>
                {selectedDate && (
                  <div className={styles.modalDateBadge}>
                    <span className={styles.modalDateDay}>
                      {selectedDate.day}
                    </span>
                    <span className={styles.modalDateMonth}>
                      {selectedDate.month}
                      {selectedDate.year ? ` ${selectedDate.year}` : ""}
                    </span>
                  </div>
                )}
                <h2 className={styles.modalTitle}>
                  {selectedEvent.event_title ?? "—"}
                </h2>
              </div>

              <div className={styles.modalMetaGrid}>
                <div className={styles.modalMetaItem}>
                  <span className={styles.modalMetaIcon}>
                    <i className="fa-regular fa-calendar" />
                  </span>
                  <div>
                    <span className={styles.modalMetaLabel}>Date</span>
                    <span className={styles.modalMetaValue}>
                      {formatFullDate(selectedEvent.event_date)}
                    </span>
                  </div>
                </div>

                {selectedEvent.event_time && (
                  <div className={styles.modalMetaItem}>
                    <span className={styles.modalMetaIcon}>
                      <i className="fa-regular fa-clock" />
                    </span>
                    <div>
                      <span className={styles.modalMetaLabel}>Time</span>
                      <span className={styles.modalMetaValue}>
                        {selectedEvent.event_time}
                      </span>
                    </div>
                  </div>
                )}

                {selectedEvent.event_place && (
                  <div className={styles.modalMetaItem}>
                    <span className={styles.modalMetaIcon}>
                      <i className="fa-solid fa-building-columns" />
                    </span>
                    <div>
                      <span className={styles.modalMetaLabel}>Venue</span>
                      <span className={styles.modalMetaValue}>
                        {selectedEvent.event_place}
                      </span>
                    </div>
                  </div>
                )}

                {selectedEvent.event_speaker && (
                  <div className={styles.modalMetaItem}>
                    <span className={styles.modalMetaIcon}>
                      <i className="fa-regular fa-user" />
                    </span>
                    <div>
                      <span className={styles.modalMetaLabel}>Speaker</span>
                      <span className={styles.modalMetaValue}>
                        {selectedEvent.event_speaker}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default EventsTestimonialsSection;
