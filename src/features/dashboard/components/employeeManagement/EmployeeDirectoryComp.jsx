import { useState } from "react";
import {
  Table,
  Tag,
  Avatar,
  Button,
  Input,
  Progress,
  Space,
  Tooltip,
  Rate,
} from "antd";
import {
  FilterOutlined,
  DownloadOutlined,
  SettingOutlined,
  LinkOutlined,
  StarFilled,
} from "@ant-design/icons";
import styles from "../../styles/EmployeeManagementPage.module.css";

const employeeData = [
  {
    key: "1",
    name: "Haruki Sato",
    email: "haruki.s@consulate.gov",
    avatar: null,
    role: "Senior Visa Officer",
    department: "Consular Affairs",
    assignedApplicants: 142,
    maxApplicants: 200,
    performanceScore: 4.9,
    status: "Active",
  },
  {
    key: "2",
    name: "Emi Nakamura",
    email: "emi.n@consulate.gov",
    avatar: null,
    role: "Language Specialist",
    department: "Education & Culture",
    assignedApplicants: 28,
    maxApplicants: 200,
    performanceScore: 4.7,
    status: "Away",
  },
  {
    key: "3",
    name: "Daisuke Tanaka",
    email: "d.tanaka@consulate.gov",
    avatar: null,
    role: "Legal Consultant",
    department: "Legal Compliance",
    assignedApplicants: 65,
    maxApplicants: 200,
    performanceScore: 5.0,
    status: "On Leave",
  },
  {
    key: "4",
    name: "Yuki Ito",
    email: "y.ito@consulate.gov",
    avatar: null,
    role: "Training Director",
    department: "Human Resources",
    assignedApplicants: 12,
    maxApplicants: 200,
    performanceScore: 4.8,
    status: "Active",
  },
];

const statusColorMap = {
  Active: "green",
  Away: "gold",
  "On Leave": "red",
};

const columns = [
  {
    title: "NAME",
    dataIndex: "name",
    key: "name",
    render: (_, record) => (
      <div className={styles.nameCell}>
        <Avatar size={36} className={styles.employeeAvatar}>
          {record.name.charAt(0)}
        </Avatar>
        <div>
          <div className={styles.employeeName}>{record.name}</div>
          <div className={styles.employeeEmail}>{record.email}</div>
        </div>
      </div>
    ),
  },
  {
    title: "ROLE",
    dataIndex: "role",
    key: "role",
    render: (text) => <span className={styles.cellText}>{text}</span>,
  },
  {
    title: "DEPARTMENT",
    dataIndex: "department",
    key: "department",
    render: (text) => <span className={styles.cellText}>{text}</span>,
  },
  {
    title: "ASSIGNED APPLICANTS",
    dataIndex: "assignedApplicants",
    key: "assignedApplicants",
    render: (val, record) => {
      const percent = Math.round((val / record.maxApplicants) * 100);
      return (
        <div className={styles.applicantCell}>
          <span className={styles.applicantCount}>{val}</span>
          <Progress
            percent={percent}
            showInfo={false}
            size="small"
            strokeColor={percent > 50 ? "#b91c1c" : "#b91c1c"}
            trailColor="#f0f0f0"
            className={styles.applicantBar}
          />
        </div>
      );
    },
  },
  {
    title: "PERFORMANCE SCORE",
    dataIndex: "performanceScore",
    key: "performanceScore",
    render: (val) => (
      <div className={styles.scoreCell}>
        <StarFilled style={{ color: "#faad14", fontSize: 13 }} />
        <span className={styles.scoreText}>{val}</span>
      </div>
    ),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={statusColorMap[status]} className={styles.statusTag}>
        {status}
      </Tag>
    ),
  },
  {
    title: "ACTIONS",
    key: "actions",
    render: () => (
      <Space size="middle">
        <Tooltip title="Settings">
          <SettingOutlined className={styles.actionIcon} />
        </Tooltip>
        <Tooltip title="Link">
          <LinkOutlined className={styles.actionIcon} />
        </Tooltip>
      </Space>
    ),
  },
];

const EmployeeDirectoryComp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  return (
    <div className={styles.directorySection}>
      <div className={styles.directoryHeader}>
        <div>
          <h2 className={styles.directoryTitle}>Employee Directory</h2>
          <p className={styles.directorySubtitle}>
            Manage personnel records and access permissions
          </p>
        </div>
        <div className={styles.directoryActions}>
          <Button icon={<FilterOutlined />}>Filter</Button>
          <Button icon={<DownloadOutlined />}>Export CSV</Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={employeeData}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: 1284,
          showTotal: (total, range) =>
            `Showing ${range[0]} - ${range[1]} of ${total.toLocaleString()} employees`,
          onChange: (page) => setCurrentPage(page),
        }}
        className={styles.employeeTable}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default EmployeeDirectoryComp;
