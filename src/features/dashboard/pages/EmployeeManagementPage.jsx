import { Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import EmployeeStatsComp from "../components/employeeManagement/EmployeeStatsComp";
import EmployeeDirectoryComp from "../components/employeeManagement/EmployeeDirectoryComp";
import styles from "../styles/EmployeeManagementPage.module.css";

const EmployeeManagementPage = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle}>Employee Management</h1>
        <Input
          placeholder="Search employees, roles, or IDs..."
          prefix={<SearchOutlined />}
          className={styles.searchInput}
          allowClear
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className={styles.createBtn}
        >
          Create Employee
        </Button>
      </div>

      {/* Stats Cards */}
      <EmployeeStatsComp />

      {/* Employee Directory Table */}
      <EmployeeDirectoryComp />
    </div>
  );
};

export default EmployeeManagementPage;
