import React, { useState, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  ManOutlined,
  TeamOutlined,
  SolutionOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  BellOutlined,
  MessageOutlined,
  SearchOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  FileImageOutlined,
  DollarOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { Layout, Input, Button, Avatar, Badge } from "antd";
import styles from "../styles/DashboardPage.module.css";
import ScrollToTop from "../../../components/common/ScrollToTop";
import LogoutButton from "../../auth/components/LogoutButton";
import { useAuth } from "../../../context/AuthProvider";
import NotificationPanel from "../components/notifications/NotificationPanel";
import useNotification from "../../../hooks/useNotification";
import useNotificationRealTime from "../../../hooks/useNotificationRealTIme";

const { Content } = Layout;

const mainMenuItems = [
  {
    key: "/dashboard",
    icon: <UserOutlined />,
    label: "Profile",
    // visibleForRoles: ["admin", "student", "employee"],
    visibleForRoles: [
      {
        role: "admin",
        isActive: true,
      },
      {
        role: "employee",
        isActive: true,
      },
      {
        role: "student",
        isActive: true,
        // studentStatus: ["enrolled"],
      },
    ],
  },
  {
    key: "/dashboard/employee-management",
    icon: <TeamOutlined />,
    label: "Employee Management",
    // adminOnly: true,
    visibleForRoles: [
      {
        role: "admin",
        isActive: true,
      },
    ],
  },
  {
    key: "/dashboard/student-management",
    icon: <SolutionOutlined />,
    label: "Student Management",
    visibleForRoles: [
      {
        role: "admin",
        isActive: true,
      },
      {
        role: "employee",
        isActive: true,
        employeeStatus: ["full_time"],
      },
    ],
  },

  {
    key: "/dashboard/course-management",
    icon: <SettingOutlined />,
    label: "Course Management",
    visibleForRoles: [
      {
        role: "admin",
        isActive: true,
      },
      {
        role: "employee",
        isActive: true,
        employeeStatus: ["full_time"],
      },
    ],
  },
  // {
  //   key: "/dashboard/course-assignment",
  //   icon: <SettingOutlined />,
  //   label: "Course Assignment",
  //   visibleForRoles: [
  //     {
  //       role: "admin",
  //       isActive: true,
  //     },
  //     {
  //       role: "employee",
  //       isActive: true,
  //       employeeStatus: ["full_time"],
  //     },
  //   ],
  // },
  {
    key: "/dashboard/finances",
    icon: <DollarOutlined />,
    label: "Financials",
    // adminOnly: true,
    visibleForRoles: [
      {
        role: "admin",
        isActive: true,
      },
      {
        role: "employee",
        isActive: true,
        employeeStatus: ["full_time"],
      },
    ],
  },
  {
    key: "/dashboard/assets-management",
    icon: <FileImageOutlined />,
    label: "Assets Management",
    // adminOnly: true,
    visibleForRoles: [
      {
        role: "admin",
        isActive: true,
      },
    ],
  },

  {
    key: "/dashboard/events-activities",
    icon: <i className="fi fi-rr-calendar-star"></i>,
    label: "Events & Activities",
    // adminOnly: true,
    visibleForRoles: [
      {
        role: "admin",
        isActive: true,
      },
      {
        role: "employee",
        isActive: true,
        employeeStatus: ["full_time", "part_time"],
      },
    ],
  },


  {
    key: "/dashboard/my-courses",
    icon: <ReadOutlined />,
    label: "My Courses",
    // studentOnly: true,
    visibleForRoles: [
      {
        role: "student",
        isActive: true,
        studentStatus: ["enrolled"],
      },
    ],
  },

  {
    key: "/dashboard/my-finances",
    icon: <DollarOutlined />,
    label: "My Finances",
    // studentOnly: true,
    visibleForRoles: [
      {
        role: "student",
        isActive: true,
        studentStatus: ["enrolled"],
      },
    ],
  },
];

const bottomMenuItems = [
  {
    key: "support",
    icon: <QuestionCircleOutlined />,
    label: "Support",
  },
  // {
  //   key: "logout",
  //   icon: <LogoutOutlined />,
  //   label: "Logout",
  // },
];

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const contentRef = useRef(null);
  const bellRef = useRef(null);
  const { user, userMeta, loading, userMetaLoading, studentStatus, employeeStatus } = useAuth();
  const { unreadCount } = useNotification(user?.email , { limit: 6 });
  useNotificationRealTime(user?.email);

  const handleMenuClick = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  if (loading || userMetaLoading) return null;

  const isAdmin = userMeta?.role === "admin";
  const isStudent = userMeta?.role === "student";
  const isEmployee = userMeta?.role === "employee";
  const visibleMenuItems = mainMenuItems.filter((item) => {
    if (!item.visibleForRoles) return true;
    const match = item.visibleForRoles.find((r) => r.role === userMeta?.role);
    if (!match || !match.isActive) return false;
    if (match.studentStatus) return match.studentStatus.includes(studentStatus);
    if (match.employeeStatus) return match.employeeStatus.includes(employeeStatus);
    return true;
  });

  if (!user || !userMeta) {
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: "150px",
          minHeight: "40vh",
          fontSize: "2.0rem",
          fontWeight: "bold",
        }}
      >
        Not Logged In !
      </p>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
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
          {visibleMenuItems.map((item) => (
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
          <LogoutButton />
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
          </div>

          <div className={styles.headerRight}>
            <div className={styles.headerIcons}>
              <div
                className={`${styles.bellWrap} ${notifOpen ? styles.bellWrapActive : ""}`}
                ref={bellRef}
                onClick={() => setNotifOpen((o) => !o)}
              >
                <Badge count={unreadCount} size="small">
                  <BellOutlined className={`${styles.headerIcon} ${notifOpen ? styles.headerIconActive : ""}`} />
                </Badge>
                {notifOpen && (
                  <NotificationPanel
                    email={user?.email}
                    onClose={() => setNotifOpen(false)}
                    triggerRef={bellRef}
                  />
                )}
              </div>
              
              <Link to="/dashboard">
                <UserOutlined className={styles.headerIcon} />
              </Link>
            
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={styles.content} ref={contentRef}>
          <ScrollToTop containerRef={contentRef} />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
