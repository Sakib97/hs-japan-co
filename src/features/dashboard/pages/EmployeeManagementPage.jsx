import { useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import EmployeeStatsComp from "../components/employeeManagement/EmployeeStatsComp";
import EmployeeDirectoryComp from "../components/employeeManagement/EmployeeDirectoryComp";
import CreateEmployeeModal from "../components/employeeManagement/CreateEmployeeModal";
import DeptDesignationComp from "../components/employeeManagement/DeptDesignationComp";
import styles from "../styles/EmployeeManagementPage.module.css";

const EmployeeManagementPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className={styles.pageWrapper}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle}>Employee Management</h1>
        {/* <Input
          placeholder="Search employees, roles, or IDs..."
          prefix={<SearchOutlined />}
          className={styles.searchInput}
          allowClear
        /> */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className={styles.createBtn}
          onClick={() => setModalOpen(true)}
        >
          Create Admin & Employee
        </Button>
      </div>

      {/* Create Employee Modal */}
      <CreateEmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Stats Cards */}
      <EmployeeStatsComp />

      {/* Employee Directory Table */}
      <EmployeeDirectoryComp />

      {/* Department & Designation Directories */}
      <DeptDesignationComp />
    </div>
  );
};

export default EmployeeManagementPage;
