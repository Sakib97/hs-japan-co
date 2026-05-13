import { useState } from "react";
import AnnouncementCreateForm from "../components/announcementsManagement/AnnouncementCreateForm";
import AnnouncementDirectory from "../components/announcementsManagement/AnnouncementDirectory";
import styles from "./AnnouncementsPage.module.css";

const AnnouncementsPage = () => {
  const [editingRecord, setEditingRecord] = useState(null);

  const handleEdit = (record) => {
    setEditingRecord(record);
  };

  const handleEditComplete = () => {
    setEditingRecord(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Announcements</h1>
        <p className={styles.pageSubtitle}>
          Publish wide-format banners and manage active communications.
        </p>
      </div>

      <div className={styles.content}>
        <AnnouncementCreateForm
          key={editingRecord?.id ?? "new"}
          editingRecord={editingRecord}
          onEditComplete={handleEditComplete}
        />
        <AnnouncementDirectory onEdit={handleEdit} />
      </div>
    </div>
  );
};

export default AnnouncementsPage;
