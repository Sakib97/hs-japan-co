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
  Input,
} from "antd";
import {
  FilterOutlined,
  DownloadOutlined,
  SettingOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { MdAssignmentAdd } from "react-icons/md";
import styles from "../../styles/StudentManagementPage.module.css";
import { supabase } from "../../../../config/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  STUDENT_STATUS_COLOR,
  STUDENT_STATUS_OPTIONS,
  STUDENT_STATUS,
  NOTIFICATION_TYPE,
} from "../../../../config/statusAndRoleConfig";
import {
  QK_STUDENTS,
  QK_STUDENT_PERSONAL,
  QK_STUDENT_PROFILE,
  QK_STUDENT_STATS,
  QK_NOTIFICATIONS,
  QK_SESSIONS,
} from "../../../../config/queryKeyConfig";
import { getFormattedTime } from "../../../../utils/dateUtil";
import StudentProfileModal from "./StudentProfileModal";
import { showToast } from "../../../../components/layout/CustomToast";
import { generateToken } from "../../../../utils/generateToken";
import { sendInviteEmail } from "../../../../utils/sendInviteEmail";
import { useAuth } from "../../../../context/AuthProvider";

const PAGE_SIZE = 10;

const statusLabelMap = Object.fromEntries(
  STUDENT_STATUS_OPTIONS.map(({ value, label }) => [value, label]),
);

const getMailActionLabel = (status) => {
  if (status === STUDENT_STATUS.STUDENT_EXPRESSED_INTEREST)
    return "Send Invite Mail";
  if (status === STUDENT_STATUS.ACCOUNT_CREATION_MAIL_SENT)
    return "Resend Invite Mail";
  return "Send Password Reset Mail";
};

const getColumns = (
  onViewProfile,
  onChangeStatus,
  onSendMail,
  onAssignSession,
) => [
  {
    title: "NAME",
    key: "name",
    width: 200,
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
    width: 150,
    render: (_, record) => (
      <span className={styles.cellText}>{record.phone ?? "—"}</span>
    ),
  },
  {
    title: "Passport",
    key: "passport",
    width: 150,
    render: (_, record) => (
      <span className={styles.cellText}>{record.passport ?? "—"}</span>
    ),
  },
  {
    title: "Session",
    key: "session",
    width: 150,
    render: (_, record) => (
      <span className={styles.cellText}>{record.session ?? "—"}</span>
    ),
  },
  {
    title: "STATUS",
    key: "status",
    width: 200,
    render: (_, record) => (
      <Tag color={STUDENT_STATUS_COLOR[record.status] ?? "default"}>
        {statusLabelMap[record.status] ?? record.status ?? "—"}
      </Tag>
    ),
  },
  {
    title: "REGISTERED AT",
    key: "created_at",
    width: 200,
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
    fixed: "right",
    width: 150,
    render: (_, record) => (
      <Space size="middle">
        <Tooltip title={getMailActionLabel(record.status)}>
          <i
            className={`${styles.actionIcon} fi fi-rr-paper-plane-launch`}
            onClick={() => onSendMail(record)}
          ></i>
        </Tooltip>

        <Tooltip title="View Details">
          <i
            className={`${styles.actionIcon} fi fi-rr-overview`}
            onClick={() => onViewProfile(record.email)}
          ></i>
        </Tooltip>
        <Tooltip title="Assign Session">
          <i
            className={`${styles.actionIcon} fi fi-rr-lesson`}
            onClick={() => onAssignSession(record)}
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
  const { user } = useAuth();
  const currentUserEmail = user?.email || "";
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [profileEmail, setProfileEmail] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [statusRecord, setStatusRecord] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [inviteRecord, setInviteRecord] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteEmailError, setInviteEmailError] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  // ── Assign session state ──
  const [sessionRecord, setSessionRecord] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [assigningSession, setAssigningSession] = useState(false);

  const { data: sessionsData } = useQuery({
    queryKey: [QK_SESSIONS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("session")
        .select("id, session_name, order")
        .eq("is_active", true)
        .order("order", { ascending: true, nullsFirst: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const openAssignSession = (record) => {
    setSessionRecord(record);
    setSelectedSession(record.session ?? null);
  };

  const closeAssignSession = () => {
    setSessionRecord(null);
    setSelectedSession(null);
  };

  const handleAssignSession = async () => {
    if (!selectedSession) return;
    setAssigningSession(true);
    const { error } = await supabase
      .from("student")
      .update({ session: selectedSession })
      .eq("id", sessionRecord.id);
    setAssigningSession(false);
    if (error) {
      showToast(error.message || "Failed to assign session.", "error");
      return;
    }
    queryClient.invalidateQueries({ queryKey: [QK_STUDENTS] });
    try {
      await supabase.from("notifications").insert({
        recipient_email: sessionRecord.email,
        title: "Session Updated",
        message: `Your academic session has been set to "${selectedSession}". Refresh your dashboard to see the update.`,
        type: NOTIFICATION_TYPE.STATUS_CHANGE,
        redirection_link: "/dashboard",
        recipient_user_type: "student",
      });
      queryClient.invalidateQueries({
        queryKey: [QK_NOTIFICATIONS, sessionRecord.email],
      });
    } catch (_) {}
    showToast("Session assigned successfully.", "success");
    closeAssignSession();
  };

  const openInvite = (record) => {
    if (record.status !== STUDENT_STATUS.STUDENT_EXPRESSED_INTEREST) return;
    setInviteRecord(record);
    setInviteEmail(record.email);
    setInviteEmailError("");
  };

  const closeInvite = () => {
    setInviteRecord(null);
    setInviteEmail("");
    setInviteEmailError("");
  };

  const handleSendInvite = async () => {
    if (!inviteEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      setInviteEmailError("Please enter a valid email address");
      return;
    }
    setInviteLoading(true);
    try {
      const { error } = await supabase.rpc(
        "send_invite_to_interested_student",
        {
          p_email: inviteEmail,
          p_name: inviteRecord.name,
          p_created_by: currentUserEmail,
        },
      );
      if (error) {
        if (error.message.includes("users_meta_email_key")) {
          showToast("An account with this email already exists.", "error");
        } else {
          showToast("Failed to send invite: " + error.message, "error");
        }
        return;
      }

      const token = generateToken();
      const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const { error: tokenError } = await supabase
        .from("user_invite_tokens")
        .insert([{ email: inviteEmail, token, expires_at, role: "student" }]);
      if (tokenError) {
        showToast(
          "Failed to generate invite token: " + tokenError.message,
          "error",
        );
        return;
      }

      try {
        await sendInviteEmail(inviteEmail, token, inviteRecord.name);
        showToast("Invite email sent successfully!", "success");
      } catch (emailError) {
        showToast(
          "Invite created but failed to send email: " +
            (emailError.text || emailError.message || emailError),
          "error",
        );
      }

      queryClient.invalidateQueries({ queryKey: [QK_STUDENTS] });
      queryClient.invalidateQueries({ queryKey: [QK_STUDENT_STATS] });
      closeInvite();
    } catch (err) {
      showToast("Unexpected error: " + err.message, "error");
    } finally {
      setInviteLoading(false);
    }
  };

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
    onSuccess: async (_, { email, status }) => {
      const statusLabel = statusLabelMap[status] ?? status;
      await supabase.from("notifications").insert({
        recipient_email: email,
        title: "Student Status Updated",
        message: `Your enrollment status has been changed to "${statusLabel}".`,
        type: NOTIFICATION_TYPE.STATUS_CHANGE,
        redirection_link: "/dashboard",
        recipient_user_type: "student",
      });
      queryClient.invalidateQueries({ queryKey: [QK_STUDENTS] });
      queryClient.invalidateQueries({ queryKey: [QK_STUDENT_PERSONAL, email] });
      queryClient.invalidateQueries({ queryKey: [QK_STUDENT_PROFILE, email] });
      queryClient.invalidateQueries({ queryKey: [QK_NOTIFICATIONS, email] });
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

  const columns = getColumns(
    openProfile,
    openChangeStatus,
    openInvite,
    openAssignSession,
  );

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
          passport_no,
          session,
          phone,
          status,
          created_at,
          dob,
          avatar_url
          `,
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
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

      {/* Send Invite Mail modal — for STUDENT_EXPRESSED_INTEREST */}
      <Modal
        open={!!inviteRecord}
        title="Send Invite Mail"
        onCancel={closeInvite}
        footer={[
          <Button
            key="send"
            type="primary"
            loading={inviteLoading}
            onClick={handleSendInvite}
          >
            Send Invite
          </Button>,
          <Button key="cancel" onClick={closeInvite}>
            Cancel
          </Button>,
        ]}
      >
        {inviteRecord && (
          <div style={{ padding: "8px 0" }}>
            <p style={{ marginBottom: 4, fontSize: "0.85rem", color: "#555" }}>
              Student: <strong>{inviteRecord.name ?? "—"}</strong>
            </p>
            <p style={{ marginBottom: 16, fontSize: "0.85rem", color: "#555" }}>
              Phone: <strong>{inviteRecord.phone}</strong>
            </p>
            <p>
              Email: <strong>{inviteRecord.email}</strong>
            </p>
            <Input
              type="email"
              placeholder="Enter student email address *"
              value={inviteEmail}
              onChange={(e) => {
                setInviteEmail(e.target.value);
                setInviteEmailError("");
              }}
              status={inviteEmailError ? "error" : ""}
            />
            {inviteEmailError && (
              <p
                style={{
                  margin: "4px 0 0 2px",
                  fontSize: "12px",
                  color: "#dc2626",
                }}
              >
                {inviteEmailError}
              </p>
            )}
            <p style={{ marginTop: 12, fontSize: "0.8rem", color: "#888" }}>
              An invite email with account setup instructions will be sent to
              this address.
            </p>
          </div>
        )}
      </Modal>

      <Modal
        open={!!sessionRecord}
        title="Assign Session"
        onCancel={closeAssignSession}
        footer={[
          <Button
            key="save"
            type="primary"
            loading={assigningSession}
            disabled={
              !selectedSession || selectedSession === sessionRecord?.session
            }
            onClick={handleAssignSession}
          >
            Assign
          </Button>,
          <Button key="cancel" onClick={closeAssignSession}>
            Cancel
          </Button>,
        ]}
      >
        {sessionRecord && (
          <div style={{ padding: "8px 0" }}>
            <p style={{ marginBottom: 12, fontSize: "0.85rem", color: "#555" }}>
              Student:{" "}
              <strong>{sessionRecord.name ?? sessionRecord.email}</strong>
            </p>
            {sessionRecord.session && (
              <p
                style={{ marginBottom: 12, fontSize: "0.85rem", color: "#555" }}
              >
                Current session: <strong>{sessionRecord.session}</strong>
              </p>
            )}
            <Select
              style={{ width: "100%" }}
              placeholder="Select a session"
              value={selectedSession}
              onChange={setSelectedSession}
              options={(sessionsData ?? []).map((s) => ({
                value: s.session_name,
                label: s.session_name,
              }))}
            />
          </div>
        )}
      </Modal>

      <Modal
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
