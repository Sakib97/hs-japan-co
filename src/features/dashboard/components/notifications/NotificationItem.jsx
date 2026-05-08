import { formatDistanceToNow } from "date-fns";
import {
  NOTIFICATION_TYPE_ICON,
  NOTIFICATION_TYPE_COLOR,
} from "../../../../config/statusAndRoleConfig";
import styles from "./NotificationItem.module.css";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const BG_COLOR = {
  purple: "#f5f3ff",
  blue: "#eff6ff",
  yellow: "#fefce8",
  green: "#f0fdf4",
  orange: "#fff7ed",
  red: "#fef2f2",
};

const ICON_COLOR = {
  purple: "#7c3aed",
  blue: "#2563eb",
  yellow: "#ca8a04",
  green: "#16a34a",
  orange: "#ea580c",
  red: "#dc2626",
};

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const { id, title, message, type, is_read, redirection_link, created_at } =
    notification;

  const iconClass = NOTIFICATION_TYPE_ICON[type] ?? "fi fi-br-bell";
  const colorKey = NOTIFICATION_TYPE_COLOR[type] ?? "blue";
  const iconBg = BG_COLOR[colorKey] ?? "#eff6ff";
  const iconColor = ICON_COLOR[colorKey] ?? "#2563eb";

  const timeAgo = created_at
    ? formatDistanceToNow(new Date(created_at), { addSuffix: true })
    : "";

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleClick = () => {
    if (!is_read) onMarkAsRead(id);
    if (redirection_link) {
      navigate(redirection_link);
      //   queryClient.invalidateQueries() with no arguments
      // marks all cached queries as stale,
      // so the moment the destination page becomes active,
      // every useQuery on it will refetch automatically —
      // no changes needed in any individual page.
      queryClient.invalidateQueries();
    }
  };

  return (
    <div
      className={`${styles.item} ${!is_read ? styles.unread : ""}`}
      onClick={handleClick}
    >
      <div
        className={styles.iconWrap}
        style={{ background: iconBg, color: iconColor }}
      >
        <i className={iconClass} />
      </div>
      <div className={styles.body}>
        <p className={`${styles.title} ${is_read ? styles.readTitle : ""}`}>
          {title}
        </p>
        {message && (
          <p
            className={`${styles.message} ${is_read ? styles.readMessage : ""}`}
          >
            {message}
          </p>
        )}
        <span className={styles.time}>{timeAgo}</span>
      </div>
      {!is_read && <div className={styles.dot} />}
    </div>
  );
};

export default NotificationItem;
