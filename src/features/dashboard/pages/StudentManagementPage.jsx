import { useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import StudentStatsComp from "../components/studentManagement/StudentStatsComp";
import StudentDirectoryComp from "../components/studentManagement/StudentDirectoryComp";
import CreateStudentModal from "../components/studentManagement/CreateStudentModal";
import SessionDirectoryComp from "../components/studentManagement/SessionDirectoryComp";
import styles from "../styles/StudentManagementPage.module.css";
import { useAuth } from "../../../context/AuthProvider";

const StudentManagementPage = () => {
  const { userMeta } = useAuth();
  const isAdmin = userMeta?.role === "admin";
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={styles.pageWrapper}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle}>Student Management</h1>
        <Input
          placeholder="Search students by Phone, Email, or Name..."
          prefix={<SearchOutlined />}
          className={styles.searchInput}
          allowClear
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className={styles.createBtn}
          onClick={() => setModalOpen(true)}
        >
          Add Student
        </Button>
      </div>

      {/* Create Student Modal */}
      <CreateStudentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Stats Cards */}
      <StudentStatsComp />

      {/* Student Directory Table */}
      <StudentDirectoryComp searchQuery={searchQuery} />

      {/* Session Directory — admin only */}
      {isAdmin && <SessionDirectoryComp />}
    </div>
  );
};

export default StudentManagementPage;
