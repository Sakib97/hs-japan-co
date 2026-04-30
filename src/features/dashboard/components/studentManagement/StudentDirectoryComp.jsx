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
import { QK_STUDENTS } from "../../../../config/queryKeyConfig";
import { getFormattedTime } from "../../../../utils/dateUtil";
import StudentProfileModal from "./StudentProfileModal";

const PAGE_SIZE = 10;

const statusLabelMap = Object.fromEntries(
  STUDENT_STATUS_OPTIONS.map(({ value, label }) => [value, label]),
);

const getColumns = (onViewProfile) => [
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
          {getFormattedTime(record.created_at)}
        </span>
      ) : (
        "—"
      ),
  },
  {
    // <i class="fi fi-rr-paper-plane-launch"></i>
    title: "ACTIONS",
    key: "actions",
    render: (_, record) => (
      <Space size="middle">
        <Tooltip title="Resend Invite Email">
          <i className={`${styles.actionIcon} fi fi-rr-paper-plane-launch`}></i>
        </Tooltip>

        <Tooltip title="View Profile">
          <i
            className={`${styles.actionIcon} fi fi-rr-overview`}
            onClick={() => onViewProfile(record.email)}
          ></i>
        </Tooltip>
        <Tooltip title="View Financial Details">
          <i className={`${styles.actionIcon} fi fi-rr-credit-card-eye`}></i>
        </Tooltip>

        {/* <Tooltip title="Resend Invite Email">
          <i className={`${styles.actionIcon} fi fi-rr-paper-plane-launch`}></i>
        </Tooltip>
        <Tooltip title="Resend Invite Email">
          <i className={`${styles.actionIcon} fi fi-rr-paper-plane-launch`}></i>
        </Tooltip> */}
        <Tooltip title="Change Status">
          <i className={`${styles.actionIcon} fi fi-rr-career-growth`}></i>
        </Tooltip>
      </Space>
    ),
  },
];

const StudentDirectoryComp = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [profileEmail, setProfileEmail] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const openProfile = (email) => {
    setProfileEmail(email);
    setProfileModalOpen(true);
  };

  const columns = getColumns(openProfile);

  const { data, isLoading } = useQuery({
    queryKey: [QK_STUDENTS, currentPage, searchQuery],
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
        // search by name, email, or phone using case-insensitive partial match
        query = query.or(
          `name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`,
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
          {/* <Button icon={<FilterOutlined />}>Filter</Button> */}
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

      <StudentProfileModal
        email={profileEmail}
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
};

export default StudentDirectoryComp;
