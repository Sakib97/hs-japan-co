import { useState } from "react";
import styles from "../../styles/AssetsManagement.module.css";

const INITIAL_MEMBERS = [
  {
    id: 1,
    name: "Kenji Sato",
    position: "Chief Visa Officer",
    avatar: null,
    updated: "2 days ago",
  },
  {
    id: 2,
    name: "Emi Tanaka",
    position: "Language Specialist",
    avatar: null,
    updated: "1 week ago",
  },
];

const TeamStaffPanel = () => {
  const [members, setMembers] = useState(INITIAL_MEMBERS);

  const replaceAvatar = (id, file) => {
    const url = URL.createObjectURL(file);
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, avatar: url, updated: "just now" } : m,
      ),
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Team Staff</h2>
          <p className={styles.sectionSubtitle}>
            Update profile images for staff members shown on the website.
          </p>
        </div>
      </div>
      <div className={styles.staffTable}>
        <div className={`${styles.staffRow} ${styles.staffRowHeader}`}>
          <span>PROFILE IMAGE</span>
          <span>NAME &amp; POSITION</span>
          <span>LAST UPDATED</span>
          <span>ACTION</span>
        </div>
        {members.map((m) => (
          <div key={m.id} className={styles.staffRow}>
            <div className={styles.staffAvatar}>
              {m.avatar ? (
                <img src={m.avatar} alt={m.name} />
              ) : (
                <span>{m.name.charAt(0)}</span>
              )}
            </div>
            <div className={styles.staffInfo}>
              <span className={styles.staffName}>{m.name}</span>
              <span className={styles.staffPosition}>{m.position}</span>
            </div>
            <span className={styles.staffUpdated}>{m.updated}</span>
            <label className={styles.btnReplace}>
              REPLACE
              <input
                type="file"
                accept="image/*"
                className={styles.hiddenInput}
                onChange={(e) => replaceAvatar(m.id, e.target.files[0])}
              />
            </label>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamStaffPanel;
