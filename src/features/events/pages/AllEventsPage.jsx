import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input, Pagination, Spin } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import { supabase } from "../../../config/supabaseClient";
import { QK_ALL_EVENTS } from "../../../config/queryKeyConfig";
import styles from "../styles/AllEventsPage.module.css";

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

const AllEventsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [QK_ALL_EVENTS, currentPage, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("events_page")
        .select(
          "id, event_title, cover_url, event_date, event_time, event_place, event_speaker",
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
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

  return (
    <div className={styles.page}>
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
            <LoadingOutlined style={{ fontSize: 48, color: "#4f46e5" }} spin />
          </div>
        ) : events.length === 0 ? (
          <div className={styles.empty}>
            <i className="fa-regular fa-calendar-xmark" />
            <span>No events found</span>
          </div>
        ) : (
          <div className={styles.list}>
            {events.map((event) => {
              const { day, month, year } = parseDate(event.event_date);
              return (
                <div key={event.id} className={styles.eventCard}>
                  {/* Date badge */}
                  <div className={styles.dateBadge}>
                    <span className={styles.dateDay}>{day}</span>
                    <span className={styles.dateMonth}>
                      {month}
                      {year ? ` ${year}` : ""}
                    </span>
                  </div>

                  {/* Info */}
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

                  {/* Cover thumbnail */}
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
    </div>
  );
};

export default AllEventsPage;
