import { useState } from "react";
import {
  Table,
  Tag,
  Avatar,
  Button,
  Space,
  Tooltip,
  Dropdown,
  Modal,
  Select,
} from "antd";
import {
  FilterOutlined,
  DownloadOutlined,
  SettingOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import styles from "../../styles/StudentManagementPage.module.css";
import { supabase } from "../../../../config/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  STUDENT_STATUS_COLOR,
  STUDENT_STATUS_OPTIONS,
} from "../../../../config/statusAndRoleConfig";
import {
  QK_STUDENTS,
  QK_STUDENT_PERSONAL,
  QK_STUDENT_PROFILE,
} from "../../../../config/queryKeyConfig";
import { getFormattedTime } from "../../../../utils/dateUtil";
import StudentProfileModal from "./StudentProfileModal";
import { showToast } from "../../../../components/layout/CustomToast";

const PAGE_SIZE = 10;

const statusLabelMap = Object.fromEntries(
  STUDENT_STATUS_OPTIONS.map(({ value, label }) => [value, label]),
);

const getColumns = (onViewProfile, onChangeStatus) => [
  {
    title: "NAME",
    key: "name",
    render: (_, record) => (
      <div className={styles.nameCell}>
        <Avatar
          size={36}
          className={styles.studentAvatar}
          src={record.avatar_url}
        >
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
        <Tooltip title="Change Status">
          <i
            className={`${styles.actionIcon} fi fi-rr-career-growth`}
            onClick={() => onChangeStatus(record)}
          ></i>
        </Tooltip>
      </Space>
    ),
  },
];

const StudentDirectoryComp = ({ searchQuery }) => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [profileEmail, setProfileEmail] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [statusRecord, setStatusRecord] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

  const openChangeStatus = (record) => {
    setStatusRecord(record);
    setNewStatus(record.status);
  };

  const closeChangeStatus = () => {
    setStatusRecord(null);
    setNewStatus(null);
  };

  const { mutate: updateStatus, isPending: statusUpdating } = useMutation({
    mutationFn: async ({ email, status }) => {
      const { error } = await supabase
        .from("student")
        .update({ status })
        .eq("email", email);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, { email }) => {
      queryClient.invalidateQueries({ queryKey: [QK_STUDENTS] });
      queryClient.invalidateQueries({ queryKey: [QK_STUDENT_PERSONAL, email] });
      queryClient.invalidateQueries({ queryKey: [QK_STUDENT_PROFILE, email] });
      showToast("Student status updated.", "success");
      closeChangeStatus();
    },
    onError: (err) => {
      showToast(err.message || "Failed to update status.", "error");
    },
  });

  const openProfile = (email) => {
    setProfileEmail(email);
    setProfileModalOpen(true);
  };

  const columns = getColumns(openProfile, openChangeStatus);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [QK_STUDENTS, currentPage, searchQuery, selectedStatus],
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
          dob,
          avatar_url
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

      if (selectedStatus) {
        query = query.eq("status", selectedStatus);
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
          {/* <Button icon={<DownloadOutlined />}>Export CSV</Button> */}
          <Button
            icon={<i className="fi fi-rr-refresh"></i>}
            size={"medium"}
            loading={isFetching}
            onClick={() => {
              if (currentPage !== 1) {
                setCurrentPage(1);
              } else {
                refetch();
              }
            }}
          >
            Refresh
          </Button>

          <Dropdown
            menu={{
              items: [
                {
                  key: "__all__",
                  label: <span>All Statuses</span>,
                  onClick: () => {
                    setSelectedStatus(null);
                    setCurrentPage(1);
                  },
                },
                ...STUDENT_STATUS_OPTIONS.map((opt) => ({
                  key: opt.value,
                  label: <span>{opt.label}</span>,
                  onClick: () => {
                    setSelectedStatus(opt.value);
                    setCurrentPage(1);
                  },
                })),
              ],
            }}
            placement="bottomLeft"
          >
            <Button
              type={selectedStatus ? "primary" : ""}
              icon={<i className="fi fi-rr-filter"></i>}
              size={"medium"}
            >
              {STUDENT_STATUS_OPTIONS.find((o) => o.value === selectedStatus)
                ?.label ?? "Status"}
            </Button>
          </Dropdown>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data?.rows ?? []}
        rowKey="id"
        loading={isLoading || isFetching}
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

      <Modal
        open={!!statusRecord}
        title="Change Student Status"
        onCancel={closeChangeStatus}
        footer={[
          <Button
            key="save"
            type="primary"
            loading={statusUpdating}
            disabled={!newStatus || newStatus === statusRecord?.status}
            onClick={() =>
              updateStatus({ email: statusRecord.email, status: newStatus })
            }
          >
            Save
          </Button>,
          <Button key="cancel" onClick={closeChangeStatus}>
            Cancel
          </Button>,
        ]}
      >
        {statusRecord && (
          <div style={{ padding: "8px 0" }}>
            <p style={{ marginBottom: 12, fontSize: "0.85rem", color: "#555" }}>
              Student:{" "}
              <strong>{statusRecord.name ?? statusRecord.email}</strong>
            </p>
            <Select
              style={{ width: "100%" }}
              options={STUDENT_STATUS_OPTIONS}
              value={newStatus}
              onChange={setNewStatus}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentDirectoryComp;
