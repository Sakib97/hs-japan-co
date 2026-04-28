import { useState } from "react";
import { Table, Tag, Avatar, Button, Space, Tooltip } from "antd";
import {
  FilterOutlined,
  DownloadOutlined,
  SettingOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import styles from "../../styles/StudentManagementPage.module.css";
import { supabase } from "../../../../config/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import {
  STUDENT_STATUS_COLOR,
  STUDENT_STATUS_OPTIONS,
} from "../../../../config/statusAndRoleConfig";

const PAGE_SIZE = 10;

const statusLabelMap = Object.fromEntries(
  STUDENT_STATUS_OPTIONS.map(({ value, label }) => [value, label]),
);

const columns = [
  {
    title: "NAME",
    key: "name",
    render: (_, record) => (
      <div className={styles.nameCell}>
        <Avatar size={36} className={styles.studentAvatar}>
          {record.name?.charAt(0) ?? "S"}
        </Avatar>
        <div>
          <div className={styles.studentName}>{record.name ?? "—"}</div>
          <div className={styles.studentEmail}>{record.email}</div>
        </div>
      </div>
    ),
  },
  {
    title: "PHONE",
    key: "phone",
    render: (_, record) => (
      <span className={styles.cellText}>{record.phone ?? "—"}</span>
    ),
  },
  //   {
  //     title: "EMAIL",
  //     key: "email",
  //     render: (_, record) => (
  //       <span className={styles.cellText}>
  //         {record.email?.eamil ?? "—"}
  //       </span>
  //     ),
  //   },
  {
    title: "STATUS",
    key: "status",
    render: (_, record) => (
      <Tag color={STUDENT_STATUS_COLOR[record.status] ?? "default"}>
        {statusLabelMap[record.status] ?? record.status ?? "—"}
      </Tag>
    ),
  },
  {
    title: "REGISTERED AT",
    key: "created_at",
    render: (_, record) =>
      record.created_at ? (
        <span className={styles.cellText}>
          {new Date(record.created_at).toLocaleDateString()}
        </span>
      ) : (
        "—"
      ),
  },
  {
    title: "ACTIONS",
    key: "actions",
    render: () => (
      <Space size="middle">
        <Tooltip title="View">
          <EyeOutlined className={styles.actionIcon} />
        </Tooltip>
        <Tooltip title="Settings">
          <SettingOutlined className={styles.actionIcon} />
        </Tooltip>
      </Space>
    ),
  },
];

const StudentDirectoryComp = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["student", currentPage, searchQuery],
    queryFn: async () => {
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("student")
        .select(
          `
          id,
          name,
          email,
          phone,
          status,
          created_at,
          dob
          `,
          { count: "exact" },
        )
        .range(from, to);

      if (searchQuery) {
        query = query.or(
          `name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
        );
      }

      const { data, error, count } = await query;
      if (error) throw new Error(error.message);
      return { rows: data, total: count };
    },
    keepPreviousData: true,
  });

  return (
    <div className={styles.directorySection}>
      <div className={styles.directoryHeader}>
        <div>
          <h2 className={styles.directoryTitle}>Student Directory</h2>
          <p className={styles.directorySubtitle}>
            Manage student records and enrollment statuses
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
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: data?.total ?? 0,
          showTotal: (total, range) =>
            `Showing ${range[0]}–${range[1]} of ${total.toLocaleString()} students`,
          onChange: (page) => setCurrentPage(page),
        }}
        className={styles.studentTable}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default StudentDirectoryComp;
