import { useState } from "react";
import { Table, Tag, Avatar, Button, Space, Tooltip } from "antd";
import {
  FilterOutlined,
  DownloadOutlined,
  SettingOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import styles from "../../styles/EmployeeManagementPage.module.css";
import { supabase } from "../../../../config/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

const statusColorMap = {
  true: "green",
  false: "red",
};

const columns = [
  {
    title: "NAME",
    key: "name",
    render: (_, record) => (
      <div className={styles.nameCell}>
        <Avatar size={36} className={styles.employeeAvatar}>
          {record.users_meta?.name?.charAt(0) ?? record.email.charAt(0)}
        </Avatar>
        <div>
          <div className={styles.employeeName}>
            {record.users_meta?.name ?? "—"}
          </div>
          <div className={styles.employeeEmail}>{record.email}</div>
        </div>
      </div>
    ),
  },
  {
    title: "DESIGNATION",
    key: "designation",
    render: (_, record) => (
      <span className={styles.cellText}>
        {record.designations?.designation_name ?? "—"}
      </span>
    ),
  },
  {
    title: "DEPARTMENT",
    key: "department",
    render: (_, record) => (
      <span className={styles.cellText}>
        {record.departments?.department_name ?? "—"}
      </span>
    ),
  },
  {
    title: "STATUS",
    key: "status",
    render: (_, record) => {
      const active = record.activity_status !== false;
      return (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      );
    },
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

  const { data, isLoading } = useQuery({
    queryKey: ["employees", currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from("employees")
        .select(
          `
          email,
          activity_status,
          departments(department_name),
          designations(designation_name),
          users_meta(name, avatar_url)
          `,
          { count: "exact" },
        )
        .range(from, to);

      if (error) throw new Error(error.message);
      return { rows: data, total: count };
    },
    keepPreviousData: true, // keeps old data visible while next page loads
  });

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
        dataSource={data?.rows ?? []}
        rowKey="email"
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: data?.total ?? 0,
          showTotal: (total, range) =>
            `Showing ${range[0]}–${range[1]} of ${total.toLocaleString()} employees`,
          onChange: (page) => setCurrentPage(page),
        }}
        className={styles.employeeTable}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default EmployeeDirectoryComp;
