import { useState } from "react";
import { RightOutlined } from "@ant-design/icons";
import { Progress } from "antd";
import styles from "../styles/AssetsManagement.module.css";
import {
  PAGES,
  STORAGE_USED_GB,
  STORAGE_TOTAL_GB,
  storagePercent,
} from "../components/assetsManagement/constants";
import HomepagePanel from "../components/assetsManagement/HomepagePanel";
import GalleryPanel from "../components/assetsManagement/GalleryPanel";
import TeamStaffPanel from "../components/assetsManagement/TeamStaffPanel";

const PANEL_MAP = {
  Homepage: <HomepagePanel />,
  Gallery: <GalleryPanel />,
  "Team Page": <TeamStaffPanel />,
//   "Contact Page": <ContactPagePanel />,
};

const AssetsManagementPage = () => {
  const [activePage, setActivePage] = useState("Homepage");

  return (
    <div className={styles.pageWrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <p className={styles.sidebarHeading}>PAGE SELECTION</p>
        <nav className={styles.sidebarNav}>
          {PAGES.map((page) => (
            <button
              key={page}
              className={`${styles.sidebarItem} ${
                activePage === page ? styles.sidebarItemActive : ""
              }`}
              onClick={() => setActivePage(page)}
            >
              {page}
              <RightOutlined className={styles.sidebarChevron} />
            </button>
          ))}
        </nav>

        <div className={styles.storageBox}>
          <p className={styles.storageLabel}>Storage Usage</p>
          <Progress
            percent={storagePercent}
            showInfo={false}
            strokeColor="#b91c1c"
            trailColor="#e5e7eb"
            size="small"
          />
          <p className={styles.storageInfo}>
            {STORAGE_USED_GB} GB of {STORAGE_TOTAL_GB} GB used
          </p>
        </div>
      </aside>

      {/* Content */}
      <main className={styles.content}>{PANEL_MAP[activePage]}</main>
    </div>
  );
};

export default AssetsManagementPage;
