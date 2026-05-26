import React, { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  ManOutlined,
  TeamOutlined,
  SolutionOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  CustomerServiceOutlined,
  MailOutlined,
  CopyOutlined,
  CheckOutlined,
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
import { TbEPassport } from "react-icons/tb";
import { BsPassport } from "react-icons/bs";
  
import { Layout, Input, Button, Avatar, Badge, Modal } from "antd";
import styles from "../styles/DashboardPage.module.css";
import { showToast } from "../../../components/layout/CustomToast";
import ScrollToTop from "../../../components/common/ScrollToTop";
import LogoutButton from "../../auth/components/LogoutButton";
import { useAuth } from "../../../context/AuthProvider";
import NotificationPanel from "../components/notifications/NotificationPanel";
import useNotification from "../../../hooks/useNotification";
import useNotificationRealTime from "../../../hooks/useNotificationRealTIme";
import { GoHome } from "react-icons/go";

const { Content } = Layout;

const SUPPORT_EMAIL = "seum@digitalarx.com";

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
    // icon:<i className="fi fi-rr-employees"></i>,
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
    // icon: <SolutionOutlined />,
    icon: <i className="fi fi-rr-graduation-cap"></i>,
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
    // icon: <SettingOutlined />,
    icon: <i className="fi fi-rr-e-learning"></i>,
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
    // icon: <FileImageOutlined />,
    icon: <i className="fi fi-rr-add-image"></i>,
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
    key: "/dashboard/announcements",
    icon: <i className="fi fi-rr-megaphone"></i>,
    label: "Announcements",
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
    key: "/dashboard/visa-page-management",
    icon: <TbEPassport />,
    label: "Visa Page Management",
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
    key: "/dashboard/home-page-management",
    icon: <i className="fi fi-rr-house-chimney"></i>,
    label: "Home Page Management",
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
    key: "/dashboard/daily-tasks",
    icon: <i className="fi fi-rr-to-do-alt"></i>,
    label: "Daily Tasks",
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

  // {
  //   key: "/dashboard/my-courses",
  //   icon: <ReadOutlined />,
  //   label: "My Courses",
  //   // studentOnly: true,
  //   visibleForRoles: [
  //     {
  //       role: "student",
  //       isActive: true,
  //       studentStatus: ["enrolled"],
  //     },
  //   ],
  // },

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
      // {
      //   role: "student",
      //   isActive: true,
      //   studentStatus: ["enrolled"],
      // },
    ],
  },
  // {
  //   key: "logout",
  //   icon: <LogoutOutlined />,
  //   label: "Logout",
  // },
];

const filterMenuItemsByVisibility = (
  items,
  { role, studentStatus, employeeStatus },
) =>
  items.filter((item) => {
    if (!item.visibleForRoles) return true;
    const match = item.visibleForRoles.find((r) => r.role === role);
    if (!match || !match.isActive) return false;
    if (match.studentStatus) return match.studentStatus.includes(studentStatus);
    if (match.employeeStatus)
      return match.employeeStatus.includes(employeeStatus);
    return true;
  });

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [supportEmailCopied, setSupportEmailCopied] = useState(false);
  const contentRef = useRef(null);
  const bellRef = useRef(null);
  const copyResetTimerRef = useRef(null);
  const {
    user,
    userMeta,
    loading,
    userMetaLoading,
    studentStatus,
    employeeStatus,
  } = useAuth();
  const { unreadCount } = useNotification(user?.email, { limit: 6 });
  useNotificationRealTime(user?.email);

  const handleMenuClick = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleBottomMenuClick = (key) => {
    if (key === "support") {
      setSupportModalOpen(true);
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (!supportModalOpen) {
      setSupportEmailCopied(false);
      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
        copyResetTimerRef.current = null;
      }
    }
  }, [supportModalOpen]);

  useEffect(
    () => () => {
      if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current);
    },
    [],
  );

  const handleCopySupportEmail = async () => {
    if (copyResetTimerRef.current) {
      clearTimeout(copyResetTimerRef.current);
      copyResetTimerRef.current = null;
    }

    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setSupportEmailCopied(true);
      showToast("Email copied to clipboard", "success");
      copyResetTimerRef.current = setTimeout(() => {
        setSupportEmailCopied(false);
        copyResetTimerRef.current = null;
      }, 5000);
    } catch {
      setSupportEmailCopied(false);
      showToast("Could not copy email", "error");
    }
  };

  if (loading || userMetaLoading) return null;

  const isAdmin = userMeta?.role === "admin";
  const isStudent = userMeta?.role === "student";
  const isEmployee = userMeta?.role === "employee";
  const visibilityContext = {
    role: userMeta?.role,
    studentStatus,
    employeeStatus,
  };
  const visibleMenuItems = filterMenuItemsByVisibility(
    mainMenuItems,
    visibilityContext,
  );
  const visibleBottomMenuItems = filterMenuItemsByVisibility(
    bottomMenuItems,
    visibilityContext,
  );

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
          {visibleBottomMenuItems.map((item) => (
            <div
              key={item.key}
              className={styles.menuItem}
              onClick={() => handleBottomMenuClick(item.key)}
            >
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
                <Badge
                  style={{ fontSize: "11px" }}
                  count={unreadCount}
                  overflowCount={99}
                  size="small"
                >
                  <BellOutlined
                    className={`${styles.headerIcon} ${notifOpen ? styles.headerIconActive : ""}`}
                  />
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

      <Modal
        open={supportModalOpen}
        onCancel={() => setSupportModalOpen(false)}
        footer={null}
        centered
        width={440}
        className={styles.supportModal}
        destroyOnHidden
      >
        <div className={styles.supportModalBody}>
          <div className={styles.supportModalHero}>
            <div className={styles.supportModalIconWrap}>
              <CustomerServiceOutlined className={styles.supportModalIcon} />
            </div>
            <h2 className={styles.supportModalTitle}>Technical Support</h2>
            <p className={styles.supportModalLead}>
              Experiencing a technical issue with the site?
            </p>
          </div>

          <div className={styles.supportModalCard}>
            <span className={styles.supportModalCardLabel}>
              Contact support
            </span>
            <p className={styles.supportModalCardHint}>
              For any technical difficulty, reach out the developer at:
            </p>
            <div className={styles.supportEmailRow}>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className={styles.supportEmailLink}
              >
                <MailOutlined className={styles.supportEmailIcon} />
                {SUPPORT_EMAIL}
              </a>
              <Button
                type="text"
                icon={
                  supportEmailCopied ? <CheckOutlined /> : <CopyOutlined />
                }
                className={`${styles.supportCopyBtn} ${
                  supportEmailCopied ? styles.supportCopyBtnCopied : ""
                }`}
                onClick={handleCopySupportEmail}
                aria-label={
                  supportEmailCopied ? "Email copied" : "Copy support email"
                }
              />
            </div>
          </div>

          <div className={styles.supportModalActions}>
            <Button
              className={styles.supportCloseBtn}
              onClick={() => setSupportModalOpen(false)}
            >
              Close
            </Button>
            <Button
              type="primary"
              danger
              icon={<MailOutlined />}
              href={`mailto:${SUPPORT_EMAIL}`}
              className={styles.supportEmailBtn}
            >
              Send Email
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
