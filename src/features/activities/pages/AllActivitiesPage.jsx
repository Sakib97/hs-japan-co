import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input, Pagination, Spin } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import { supabase } from "../../../config/supabaseClient";
import { QK_ALL_ACTIVITIES } from "../../../config/queryKeyConfig";
import styles from "../styles/AllActivitiesPage.module.css";

const PAGE_SIZE = 8;

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const AllActivitiesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [QK_ALL_ACTIVITIES, currentPage, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("activities_page")
        .select("id, activity_title, cover_url, activity_desc, activity_date", {
          count: "exact",
        })
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);

      if (searchQuery.trim()) {
        query = query.or(
          `activity_title.ilike.%${searchQuery.trim()}%,activity_desc.ilike.%${searchQuery.trim()}%`,
        );
      }

      const { data, error, count } = await query;
      if (error) throw new Error(error.message);
      return { activities: data ?? [], total: count ?? 0 };
    },
    keepPreviousData: true,
  });

  const activities = data?.activities ?? [];
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
          <p className={styles.heroEyebrow}>What We Do</p>
          <h1 className={styles.heroTitle}>Our Activities</h1>
          <p className={styles.heroSub}>
            Explore the events, workshops, and community initiatives we are
            proud to share.
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
            placeholder="Search activities…"
            value={searchQuery}
            onChange={handleSearch}
            allowClear
          />
          {!isLoading && (
            <span className={styles.count}>
              {total} activit{total !== 1 ? "ies" : "y"} found
            </span>
          )}
        </div>

        {/* List */}
        {isLoading ? (
          <div className={styles.loadingWrap}>
            <LoadingOutlined style={{ fontSize: 48, color: "#4f46e5" }} spin />
          </div>
        ) : activities.length === 0 ? (
          <div className={styles.empty}>
            <i className="fa-regular fa-folder-open" />
            <span>No activities found</span>
          </div>
        ) : (
          <div className={styles.list}>
            {activities.map((activity) => (
              <div key={activity.id} className={styles.tile}>
                {activity.cover_url && (
                  <div className={styles.imageWrap}>
                    <img
                      src={activity.cover_url}
                      alt={activity.activity_title ?? ""}
                      className={styles.tileImage}
                    />
                  </div>
                )}
                <div className={styles.tileContent}>
                  <h3 className={styles.tileTitle}>
                    {activity.activity_title ?? "—"}
                  </h3>
                  {activity.activity_desc && (
                    <p className={styles.tileDesc}>{activity.activity_desc}</p>
                  )}
                  {activity.activity_date && (
                    <span className={styles.tileDate}>
                      <i className="fa-regular fa-calendar" />
                      {formatDate(activity.activity_date)}
                    </span>
                  )}
                </div>
              </div>
            ))}
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

export default AllActivitiesPage;
