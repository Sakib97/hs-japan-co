import { useState } from "react";
import { Pagination } from "antd";
import { useAuth } from "../../../context/AuthProvider";
import useNotification from "../../../hooks/useNotification";
import NotificationItem from "../components/notifications/NotificationItem";
import styles from "./AllNotificationPage.module.css";

const PAGE_SIZE = 5;

const AllNotificationPage = () => {
  const { user } = useAuth();
  const email = user?.email;

  const [page, setPage] = useState(1);

  const {
    notifications,
    isLoading,
    unreadCount,
    totalCount,
    markAsRead,
    markAllAsRead,
  } = useNotification(email, { page, pageSize: PAGE_SIZE });

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Notifications</h2>
          <p className={styles.subtitle}>
            Stay updated with the latest activity regarding visa processing,
            applicant statuses, and academy announcements.
          </p>
        </div>
        {unreadCount > 0 && (
          <button className={styles.markAll} onClick={markAllAsRead}>
            <i className="fi fi-br-check" />
            Mark all as read
          </button>
        )}
      </div>

      <div className={styles.list}>
        {isLoading ? (
          <p className={styles.empty}>Loading…</p>
        ) : notifications.length === 0 ? (
          <p className={styles.empty}>No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkAsRead={markAsRead}
            />
          ))
        )}
      </div>

      {totalCount > PAGE_SIZE && (
        <div className={styles.paginationWrap}>
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={totalCount}
            onChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default AllNotificationPage;
