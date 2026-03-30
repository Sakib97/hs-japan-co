import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  ManOutlined,
  TeamOutlined,
  SolutionOutlined,
  DollarOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  BellOutlined,
  MessageOutlined,
  SearchOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Layout, Input, Button, Avatar, Badge } from "antd";
import styles from "../styles/DashboardPage.module.css";

const { Content } = Layout;

const mainMenuItems = [
  {
    key: "/dashboard",
    icon: <UserOutlined />,
    label: "Profile",
  },
  {
    key: "/dashboard/employee-management",
    icon: <TeamOutlined />,
    label: "Employee Management",
  },
  {
    key: "/dashboard/applicant-management",
    icon: <SolutionOutlined />,
    label: "Applicant Management",
  },

  {
    key: "/dashboard/course-management",
    icon: <SettingOutlined />,
    label: "Course Management",
  },
  {
    key: "/dashboard/finances",
    icon: <DollarOutlined />,
    label: "Financials",
  },
];

const bottomMenuItems = [
  {
    key: "support",
    icon: <QuestionCircleOutlined />,
    label: "Support",
  },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Logout",
  },
];

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className={styles.dashboardWrapper}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            {/* <img src="/vite.svg" alt="Logo" className={styles.logoImg} /> */}
            <i className="fi fi-tr-dashboard-panel"></i>
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>Dashboard</span>
            <span className={styles.logoSubtitle}>HS Japan Academy</span>
          </div>
        </div>

        {/* Main Menu */}
        <nav className={styles.mainNav}>
          {mainMenuItems.map((item) => (
            <div
              key={item.key}
              className={`${styles.menuItem} ${
                location.pathname === item.key ? styles.menuItemActive : ""
              }`}
              onClick={() => handleMenuClick(item.key)}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuLabel}>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Bottom Menu */}
        <nav className={styles.bottomNav}>
          {bottomMenuItems.map((item) => (
            <div key={item.key} className={styles.menuItem}>
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuLabel}>{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <div className={styles.mainArea}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <MenuOutlined
              className={styles.hamburger}
              onClick={() => setSidebarOpen(true)}
            />
            <h1 className={styles.headerTitle}>HS Japan Academy</h1>
            <div className={styles.searchWrapper}>
              <Input
                prefix={<SearchOutlined style={{ color: "#999" }} />}
                placeholder="Search applicants..."
                className={styles.searchInput}
              />
            </div>
            <div className={styles.headerIcons}>
              <Badge dot>
                <BellOutlined className={styles.headerIcon} />
              </Badge>
              <Badge count={3} size="small">
                <MessageOutlined className={styles.headerIcon} />
              </Badge>
              <QuestionCircleOutlined className={styles.headerIcon} />
            </div>
          </div>
          <div className={styles.headerRight}>
            <Button type="link" className={styles.reportBtn}>
              Generate Report
            </Button>
            <Button type="primary" danger className={styles.createBtn}>
              Create Employee Account
            </Button>
            <Avatar
              size={36}
              icon={<UserOutlined />}
              className={styles.avatar}
            />
          </div>
        </header>

        {/* Content */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
