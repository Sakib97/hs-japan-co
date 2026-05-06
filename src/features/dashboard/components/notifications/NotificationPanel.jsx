import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useNotification from "../../../../hooks/useNotification";
import NotificationItem from "./NotificationItem";
import styles from "./NotificationPanel.module.css";

const NotificationPanel = ({ email, onClose, triggerRef }) => {
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const { notifications, isLoading, markAsRead, markAllAsRead } =
    useNotification(email, { limit: 6 });

  const hasUnread = notifications.some((n) => !n.is_read);

  // Close on outside click, but ignore clicks on the trigger (bell)
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !(triggerRef?.current && triggerRef.current.contains(e.target))
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [onClose, triggerRef]);

  return (
    <>
      <div className={styles.arrow} />
      <div className={styles.panel} ref={panelRef}>
        <div className={styles.header}>
          <span className={styles.heading}>Notifications</span>
          {hasUnread && (
            <button className={styles.markAll} onClick={markAllAsRead}>
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

        {notifications.length > 0 && (
          <button
            className={styles.viewAll}
            onClick={() => {
              navigate("/dashboard/all-notifications");
            //   onClose();
            }}
          >
            View all notifications
          </button>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;
