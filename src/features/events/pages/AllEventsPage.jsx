import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input, Pagination, Modal, Image, Grid } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import { supabase } from "../../../config/supabaseClient";
import { QK_ALL_EVENTS } from "../../../config/queryKeyConfig";
import styles from "../styles/AllEventsPage.module.css";
import AllEventsLoading from "../../../components/loadingSkeletons/AllEventsLoading";

const PAGE_SIZE = 8;

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

const { useBreakpoint } = Grid;

const AllEventsPage = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { data, isLoading } = useQuery({
    queryKey: [QK_ALL_EVENTS, currentPage, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("events_page")
        .select(
          "id, event_title, cover_url, event_date, event_time, event_place, event_speaker",
          { count: "exact" },
        )
        // is_active is true
        .eq("is_active", true)
        // .order("created_at", { ascending: false })
        .order("event_date", { ascending: false })
        .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);

      if (searchQuery.trim()) {
        query = query.or(
          `event_title.ilike.%${searchQuery.trim()}%,event_place.ilike.%${searchQuery.trim()}%,event_speaker.ilike.%${searchQuery.trim()}%`,
        );
      }

      const { data, error, count } = await query;
      if (error) throw new Error(error.message);
      return { events: data ?? [], total: count ?? 0 };
    },
    keepPreviousData: true,
  });

  const events = data?.events ?? [];
  const total = data?.total ?? 0;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  return (    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Stay in the Loop</p>
          <h1 className={styles.heroTitle}>All Events</h1>
          <p className={styles.heroSub}>
            Browse our upcoming and past events — seminars, workshops, and open
            days.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className={styles.container}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <Input
            className={styles.searchInput}
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            placeholder="Search by title, venue, or speaker…"
            value={searchQuery}
            onChange={handleSearch}
            allowClear
          />
          {!isLoading && (
            <span className={styles.count}>
              {total} event{total !== 1 ? "s" : ""} found
            </span>
          )}
        </div>

        {/* List */}
        {isLoading ? (
          <div className={styles.loadingWrap}>
            {/* <LoadingOutlined style={{ fontSize: 48, color: "#4f46e5" }} spin /> */}
            <AllEventsLoading />
          </div>
        ) : events.length === 0 ? (
          <div className={styles.empty}>
            <i className="fa-regular fa-calendar-xmark" />
            <span>No events found</span>
          </div>
        ) : (
          <div className={styles.list}>
            {/* <AllEventsLoading /> */}
            {events.map((event) => {
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
                    <div className={styles.dateBadge}>
                      <span className={styles.dateDay}>{day}</span>
                      <span className={styles.dateMonth}>
                        {month}
                        {year ? ` ${year}` : ""}
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
                  </div>

                  {event.cover_url && (
                    <div className={styles.coverWrap}>
                      <Image
                        src={event.cover_url}
                        alt={event.event_title ?? ""}
                        className={styles.coverThumb}
                        preview={false}
                      />
                      <div className={styles.zoomOverlay}>
                        <i className="fi fi-br-zoom-in" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}          </div>
        )}

        {/* Pagination */}
        {total > PAGE_SIZE && (
          <div className={styles.paginationWrap}>
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>

      <Modal
        open={!!selectedEvent}
        onCancel={closeEventModal}
        footer={null}
        width={680}
        centered
        destroyOnHidden
        className={styles.eventModal}
        title={null}
        style={{ 
          top:  isMobile ? "0px" : "25px", 
          // fixed width, scrollable within
          maxHeight: isMobile ? "calc(100vh - 120px)" : "calc(100vh - 160px)",
          overflowY: "auto",
          borderRadius: "6px",
          zIndex: 1000,
         }}
        //  closable={false}
         closeIcon={<CloseOutlined 
          style={{ fontSize: 15, color: "black", 
            backgroundColor: "white",
            borderRadius: "30%",
            padding: "4px",
            border: "3px solid rgb(36, 34, 34)",
           }} />}
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
    </div>
  );
};
export default AllEventsPage;
