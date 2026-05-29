import { useState } from "react";
import { RightOutlined, ReloadOutlined } from "@ant-design/icons";
import { Progress, Button, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../config/supabaseClient";
import styles from "../styles/AssetsManagement.module.css";
import {
  PAGES,
  STORAGE_TOTAL_GB,
} from "../components/assetsManagement/constants";
import HomepagePanel from "../components/assetsManagement/HomepagePanel";
import GalleryPanel from "../components/assetsManagement/GalleryPanel";
import TeamStaffPanel from "../components/assetsManagement/TeamStaffPanel";

const PANEL_MAP = {
  Homepage: <HomepagePanel />,
  Gallery: <GalleryPanel />,
  "Team Page": <TeamStaffPanel />,
};

const AssetsManagementPage = () => {
  const [activePage, setActivePage] = useState("Homepage");

  const {
    data: totalBytes,
    isLoading: storageLoading,
    refetch,
  } = useQuery({
    queryKey: ["storage-usage"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_total_image_storage_bytes",
      );
      if (error) throw new Error(error.message);
      return data ?? 0;
    },
  });

  // const storageUsedGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
  // const storagePercent = Math.round((storageUsedGB / STORAGE_TOTAL_GB) * 100);

  const safeBytes = totalBytes ?? 0;

  const storageUsedGB = Number((safeBytes / (1024 * 1024 * 1024)).toFixed(2));

  const storagePercent = Math.min(
    Math.round((storageUsedGB / STORAGE_TOTAL_GB) * 100),
    100,
  );

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <p className={styles.storageLabel}>Storage Usage</p>
            <Button
              type="text"
              size="small"
              // icon={<ReloadOutlined />}
              icon={<i className="fi fi-rr-refresh"></i>}
              onClick={() => refetch()}
              loading={storageLoading}
              title="Refresh storage usage"
            />
          </div>
          <Spin spinning={storageLoading} size="small">
            <Progress
              percent={storagePercent}
              showInfo={false}
              strokeColor="#b91c1c"
              railColor="#e5e7eb"
              size="small"
            />
            <p className={styles.storageInfo}>
              {storageUsedGB} GB of {STORAGE_TOTAL_GB} GB used <br />(
              {storagePercent}% used)
            </p>
          </Spin>
        </div>
      </aside>

      {/* Content */}
      <main className={styles.content}>{PANEL_MAP[activePage]}</main>
    </div>
  );
};

export default AssetsManagementPage;
