import { useState, useRef } from "react";
import {
  Table,
  Tag,
  Avatar,
  Button,
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
  LinkOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styles from "../../styles/EmployeeManagementPage.module.css";
import { supabase } from "../../../../config/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  QK_EMPLOYEES,
  QK_DEPT_AND_DESIG,
  QK_NOTIFICATIONS,
} from "../../../../config/queryKeyConfig";
import {
  EMP_ACCOUNT_STATUS_OPTIONS,
  EMP_ACCOUNT_STATUS_COLOR,
  EMP_REGISTRATION_STATUS,
  EMP_REGISTRATION_STATUS_OPTIONS,
  EMP_REGISTRATION_STATUS_COLOR,
  NOTIFICATION_TYPE,
} from "../../../../config/statusAndRoleConfig";
import { showToast } from "../../../../components/layout/CustomToast";
import { generateToken } from "../../../../utils/generateToken";
import {
  sendInviteEmailEdgeFunction,
  sendPasswordResetEmail,
} from "../../../../utils/sendInviteEmail";

const PAGE_SIZE = 10;

const RESEND_INVITE_REGISTRATION_STATUSES = [
  EMP_REGISTRATION_STATUS.ACCOUNT_CREATION_MAIL_SENT,
  EMP_REGISTRATION_STATUS.ACCOUNT_CREATION_MAIL_RESENT,
];

const getEmployeeMailActionLabel = (registrationStatus) => {
  if (RESEND_INVITE_REGISTRATION_STATUSES.includes(registrationStatus)) {
    return "Resend Invite Email";
  }
  if (registrationStatus === EMP_REGISTRATION_STATUS.ACCOUNT_CREATED) {
    return "Send Password Reset Mail";
  }
  return "Send Password Reset Mail";
};

const isPasswordResetMailAction = (registrationStatus) =>
  registrationStatus === EMP_REGISTRATION_STATUS.ACCOUNT_CREATED ||
  registrationStatus === EMP_REGISTRATION_STATUS.PASSWORD_RESET_MAIL_SENT;

const isResendInviteMailAction = (registrationStatus) =>
  RESEND_INVITE_REGISTRATION_STATUSES.includes(registrationStatus);

const mapResendEmployeeInviteRpcError = (message = "") => {
  if (message.includes("EMPLOYEE_NOT_FOUND_OR_INVALID_STATUS")) {
    return "Cannot resend invite. The employee must have a pending account setup (invite mail sent or resent).";
  }
  return message || "Failed to resend invite.";
};

const getColumns = (onChangeStatus, onChangeDeptDesig, onSendMail) => [
  {
    title: "NAME",
    key: "name",
    render: (_, record) => (
      <div className={styles.nameCell}>
        <Avatar
          size={36}
          className={styles.employeeAvatar}
          src={record.users_meta?.avatar_url ?? undefined}
        >
          {!record.users_meta?.avatar_url &&
            (record.users_meta?.name?.charAt(0) ?? record.email.charAt(0))}
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
    title: "DEPARTMENT",
    key: "department",
    render: (_, record) => (
      <span className={styles.cellText}>{record?.department_name ?? "—"}</span>
    ),
  },

  {
    title: "DESIGNATION",
    key: "designation",
    render: (_, record) => (
      <span className={styles.cellText}>{record?.designation_name ?? "—"}</span>
    ),
  },
  {
    title: "REGISTRATION STATUS",
    key: "registration_status",
    render: (_, record) => {
      const status = record.registration_status;
      const opt = EMP_REGISTRATION_STATUS_OPTIONS.find(
        (o) => o.value === status,
      );
      const color = EMP_REGISTRATION_STATUS_COLOR[status] ?? "default";
      return <Tag color={color}>{opt?.label ?? status ?? "—"}</Tag>;
    },
  },
  {
    title: "EMPLOYMENT STATUS",
    key: "activity_status",
    render: (_, record) => {
      const status = record.activity_status;
      const opt = EMP_ACCOUNT_STATUS_OPTIONS.find((o) => o.value === status);
      const color = EMP_ACCOUNT_STATUS_COLOR[status] ?? "default";
      return <Tag color={color}>{opt?.label ?? status ?? "—"}</Tag>;
    },
  },
  {
    title: "ACTIONS",
    key: "actions",
    fixed: "right",
    render: (_, record) => (
      <div style={{ display: "flex", gap: 18 }}>
        <Tooltip title={getEmployeeMailActionLabel(record.registration_status)}>
          <span
            role="button"
            tabIndex={0}
            className={styles.mailActionBtn}
            onClick={(e) => {
              e.stopPropagation();
              onSendMail(record);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onSendMail(record);
              }
            }}
          >
            <i className={`fi fi-rr-paper-plane-launch ${styles.actionIcon}`} />
          </span>
        </Tooltip>
        <Tooltip title="Change Employment Status">
          <span
            role="button"
            tabIndex={0}
            className={styles.mailActionBtn}
            onClick={(e) => {
              e.stopPropagation();
              onChangeStatus(record);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onChangeStatus(record);
              }
            }}
          >
            <i className={`fi fi-rr-career-growth ${styles.actionIcon}`} />
          </span>
        </Tooltip>
        <Tooltip title="Change Department/Designation">
          <span
            role="button"
            tabIndex={0}
            className={styles.mailActionBtn}
            onClick={(e) => {
              e.stopPropagation();
              onChangeDeptDesig(record);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onChangeDeptDesig(record);
              }
            }}
          >
            <i className={`fi fi-rr-pc-chair ${styles.actionIcon}`} />
          </span>
        </Tooltip>
      </div>
    ),
  },
];

const EmployeeDirectoryComp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef(null);
  const queryClient = useQueryClient();

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(val.trim());
      setCurrentPage(1);
    }, 400);
  };

  // ── Change Status Modal ──────────────────────────────────────────
  const [statusModal, setStatusModal] = useState({
    open: false,
    email: null,
    newStatus: null,
  });
  const [statusUpdating, setStatusUpdating] = useState(false);

  const openStatusModal = (record) => {
    setStatusModal({
      open: true,
      email: record.email,
      newStatus: record.activity_status ?? null,
    });
  };

  const handleStatusUpdate = async () => {
    if (!statusModal.email || statusModal.newStatus === null) return;
    setStatusUpdating(true);
    try {
      const { error } = await supabase
        .from("employees")
        .update({ activity_status: statusModal.newStatus })
        .eq("email", statusModal.email);
      if (error) throw error;

      const statusLabel =
        EMP_ACCOUNT_STATUS_OPTIONS.find(
          (o) => o.value === statusModal.newStatus,
        )?.label ?? statusModal.newStatus;
      await supabase.from("notifications").insert({
        recipient_email: statusModal.email,
        title: "Employment Status Updated",
        message: `Your activity status has been changed to "${statusLabel}".`,
        type: NOTIFICATION_TYPE.STATUS_CHANGE,
        redirection_link: "/dashboard",
        recipient_user_type: "employee",
      });

      queryClient.invalidateQueries({ queryKey: [QK_EMPLOYEES] });
      queryClient.invalidateQueries({
        queryKey: [QK_NOTIFICATIONS, statusModal.email],
      });
      setStatusModal({ open: false, email: null, newStatus: null });
      showToast("Employment status updated successfully!", "success");
    } catch (err) {
      showToast(
        "Failed to update employment status: " + err.message,
        "error",
      );
    } finally {
      setStatusUpdating(false);
    }
  };
  // ────────────────────────────────────────────────────────────────

  // ── Change Dept/Desig Modal ──────────────────────────────────────
  const [deptDesigModal, setDeptDesigModal] = useState({
    open: false,
    email: null,
    newDept: null,
    newDesig: null,
  });
  const [savingDept, setSavingDept] = useState(false);
  const [savingDesig, setSavingDesig] = useState(false);
  const [savingBoth, setSavingBoth] = useState(false);

  // ── Password reset confirmation ───────────────────────────────────
  const [resetRecord, setResetRecord] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);

  // ── Resend invite confirmation ────────────────────────────────────
  const [inviteRecord, setInviteRecord] = useState(null);
  const [inviteLoading, setInviteLoading] = useState(false);

  const openResendInvite = (record) => {
    setInviteRecord(record);
  };

  const closeResendInvite = () => {
    setInviteRecord(null);
  };

  const openPasswordReset = (record) => {
    setResetRecord(record);
  };

  const closePasswordReset = () => {
    setResetRecord(null);
  };

  const onSendMail = (record) => {
    if (isResendInviteMailAction(record.registration_status)) {
      openResendInvite(record);
      return;
    }
    if (isPasswordResetMailAction(record.registration_status)) {
      openPasswordReset(record);
      return;
    }
    showToast(
      "No mail action is available for this employee's registration status.",
      "warning",
    );
  };

  const handleResendInvite = async () => {
    if (!inviteRecord?.email) return;
    setInviteLoading(true);
    try {
      const token = generateToken();
      const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const { error: rpcError } = await supabase.rpc(
        "resend_employee_invitation_mail",
        {
          p_email: inviteRecord.email,
          p_token: token,
          p_expires_at: expires_at.toISOString(),
        },
      );

      if (rpcError) {
        showToast(mapResendEmployeeInviteRpcError(rpcError.message), "error");
        return;
      }

      try {
        await sendInviteEmailEdgeFunction(
          inviteRecord.email,
          token,
          inviteRecord.users_meta?.name ?? "",
        );
        showToast("Invite email resent successfully!", "success");
      } catch (emailErr) {
        showToast(
          "Invite token updated but failed to send email: " +
            (emailErr.message || emailErr),
          "error",
        );
      }

      queryClient.invalidateQueries({ queryKey: [QK_EMPLOYEES] });
      closeResendInvite();
    } catch (err) {
      showToast("Unexpected error: " + err.message, "error");
    } finally {
      setInviteLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetRecord?.email) return;
    setResetLoading(true);
    try {
      const token = generateToken();
      const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const { error: rpcError } = await supabase.rpc(
        "send_employee_password_reset_mail_request",
        {
          p_reset_email: resetRecord.email,
          p_reset_token: token,
          p_expires_at: expires_at.toISOString(),
        },
      );

      if (rpcError) {
        showToast(
          "Failed to initiate password reset: " + rpcError.message,
          "error",
        );
        return;
      }

      try {
        await sendPasswordResetEmail(
          resetRecord.email,
          token,
          resetRecord.users_meta?.name ?? "",
        );
        showToast("Password reset email sent successfully!", "success");
      } catch (emailErr) {
        showToast(
          "Reset initiated but failed to send email: " +
            (emailErr.message || emailErr),
          "error",
        );
      }

      queryClient.invalidateQueries({ queryKey: [QK_EMPLOYEES] });
      closePasswordReset();
    } catch (err) {
      showToast("Unexpected error: " + err.message, "error");
    } finally {
      setResetLoading(false);
    }
  };
  // ────────────────────────────────────────────────────────────────

  const openDeptDesigModal = (record) => {
    setDeptDesigModal({
      open: true,
      email: record.email,
      newDept: record.department_name ?? null,
      newDesig: record.designation_name ?? null,
    });
  };

  const closeDeptDesigModal = () =>
    setDeptDesigModal({
      open: false,
      email: null,
      newDept: null,
      newDesig: null,
    });

  const handleSaveDept = async () => {
    if (!deptDesigModal.email || !deptDesigModal.newDept) return;
    setSavingDept(true);
    try {
      const { error } = await supabase
        .from("employees")
        .update({ department_name: deptDesigModal.newDept })
        .eq("email", deptDesigModal.email);
      if (error) throw error;
      await supabase.from("notifications").insert({
        recipient_email: deptDesigModal.email,
        title: "Department Updated",
        message: `Your department has been changed to "${deptDesigModal.newDept}". Refresh your Profile to see the update.`,
        type: NOTIFICATION_TYPE.STATUS_CHANGE,
        redirection_link: "/dashboard",
        recipient_user_type: "employee",
      });
      queryClient.invalidateQueries({ queryKey: [QK_EMPLOYEES] });
      queryClient.invalidateQueries({
        queryKey: [QK_NOTIFICATIONS, deptDesigModal.email],
      });
      closeDeptDesigModal();
      showToast("Department updated successfully!", "success");
    } catch (err) {
      showToast("Failed to update department: " + err.message, "error");
    } finally {
      setSavingDept(false);
    }
  };

  const handleSaveDesig = async () => {
    if (!deptDesigModal.email || !deptDesigModal.newDesig) return;
    setSavingDesig(true);
    try {
      const { error } = await supabase
        .from("employees")
        .update({ designation_name: deptDesigModal.newDesig })
        .eq("email", deptDesigModal.email);
      if (error) throw error;
      await supabase.from("notifications").insert({
        recipient_email: deptDesigModal.email,
        title: "Designation Updated",
        message: `Your designation has been changed to "${deptDesigModal.newDesig}". Refresh your Profile to see the update.`,
        type: NOTIFICATION_TYPE.STATUS_CHANGE,
        redirection_link: "/dashboard",
        recipient_user_type: "employee",
      });
      queryClient.invalidateQueries({ queryKey: [QK_EMPLOYEES] });
      queryClient.invalidateQueries({
        queryKey: [QK_NOTIFICATIONS, deptDesigModal.email],
      });
      closeDeptDesigModal();
      showToast("Designation updated successfully!", "success");
    } catch (err) {
      showToast("Failed to update designation: " + err.message, "error");
    } finally {
      setSavingDesig(false);
    }
  };

  const handleSaveBoth = async () => {
    if (
      !deptDesigModal.email ||
      !deptDesigModal.newDept ||
      !deptDesigModal.newDesig
    )
      return;
    setSavingBoth(true);
    try {
      const { error } = await supabase
        .from("employees")
        .update({
          department_name: deptDesigModal.newDept,
          designation_name: deptDesigModal.newDesig,
        })
        .eq("email", deptDesigModal.email);
      if (error) throw error;
      await supabase.from("notifications").insert({
        recipient_email: deptDesigModal.email,
        title: "Department & Designation Updated",
        message: `Your department has been changed to "${deptDesigModal.newDept}" and your designation to "${deptDesigModal.newDesig}". Refresh your Profile to see the update.`,
        type: NOTIFICATION_TYPE.STATUS_CHANGE,
        redirection_link: "/dashboard",
        recipient_user_type: "employee",
      });
      queryClient.invalidateQueries({ queryKey: [QK_EMPLOYEES] });
      queryClient.invalidateQueries({
        queryKey: [QK_NOTIFICATIONS, deptDesigModal.email],
      });
      closeDeptDesigModal();
      showToast("Department and designation updated successfully!", "success");
    } catch (err) {
      showToast(
        "Failed to update department and designation: " + err.message,
        "error",
      );
    } finally {
      setSavingBoth(false);
    }
  };
  // ────────────────────────────────────────────────────────────────

  const { data: deptDesigData } = useQuery({
    queryKey: [QK_DEPT_AND_DESIG],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_departments_and_designations",
      );
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const departmentsData = deptDesigData?.departments ?? [];
  const designationsData = deptDesigData?.designations ?? [];

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      QK_EMPLOYEES,
      currentPage,
      selectedStatus,
      selectedDepartment,
      selectedDesignation,
      searchQuery,
    ],
    queryFn: async () => {
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Two-step search: find emails matching name in users_meta, then OR with email ilike
      let nameMatchEmails = [];
      if (searchQuery) {
        const { data: metaMatches } = await supabase
          .from("users_meta")
          .select("email")
          .ilike("name", `%${searchQuery}%`);
        nameMatchEmails = (metaMatches ?? []).map((m) => m.email);
      }

      let query = supabase
        .from("employees")
        .select(
          `
          email,
          activity_status,
          registration_status,
          department_name,
          designation_name,
          users_meta(name, avatar_url)
          `,
          { count: "exact" },
        )
        .order("created_at", { ascending: true })
        .range(from, to);

      if (searchQuery) {
        const orParts = [`email.ilike.%${searchQuery}%`];
        if (nameMatchEmails.length > 0) {
          orParts.push(`email.in.(${nameMatchEmails.join(",")})`);
        }
        query = query.or(orParts.join(","));
      }

      if (selectedStatus !== null) {
        query = query.eq("activity_status", selectedStatus);
      }
      if (selectedDepartment) {
        query = query.eq("department_name", selectedDepartment);
      }
      if (selectedDesignation) {
        query = query.eq("designation_name", selectedDesignation);
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
          <h2 className={styles.directoryTitle}>Employee Directory</h2>
          <p className={styles.directorySubtitle}>
            Manage personnel records and access permissions
          </p>
        </div>
        <Button
          icon={<i className="fi fi-rr-refresh"></i>}
          size={"medium"}
          // loading={isFetching}
          onClick={() => {
            setCurrentPage(1);
            queryClient.invalidateQueries({ queryKey: [QK_EMPLOYEES] });
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
              ...EMP_ACCOUNT_STATUS_OPTIONS.map((opt) => ({
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
            type={selectedStatus !== null ? "primary" : ""}
            icon={<i className="fi fi-rr-filter"></i>}
            size={"medium"}
          >
            {EMP_ACCOUNT_STATUS_OPTIONS.find((o) => o.value === selectedStatus)
              ?.label ?? "Status"}
          </Button>
        </Dropdown>

        <Dropdown
          menu={{
            items: [
              {
                key: "__all__",
                label: <span>All Departments</span>,
                onClick: () => {
                  setSelectedDepartment(null);
                  setCurrentPage(1);
                },
              },
              ...departmentsData.map((d) => ({
                key: d.department_name,
                label: <span>{d.department_name}</span>,
                onClick: () => {
                  setSelectedDepartment(d.department_name);
                  setCurrentPage(1);
                },
              })),
            ],
          }}
          placement="bottomLeft"
        >
          <Button
            type={selectedDepartment ? "primary" : ""}
            icon={<i className="fi fi-rr-filter"></i>}
            size={"medium"}
          >
            {selectedDepartment ?? "Department"}
          </Button>
        </Dropdown>

        <Dropdown
          menu={{
            items: [
              {
                key: "__all__",
                label: <span>All Designations</span>,
                onClick: () => {
                  setSelectedDesignation(null);
                  setCurrentPage(1);
                },
              },
              ...designationsData.map((d) => ({
                key: d.designation_name,
                label: <span>{d.designation_name}</span>,
                onClick: () => {
                  setSelectedDesignation(d.designation_name);
                  setCurrentPage(1);
                },
              })),
            ],
          }}
          placement="bottomLeft"
        >
          <Button
            type={selectedDesignation ? "primary" : ""}
            icon={<i className="fi fi-rr-filter"></i>}
            size={"medium"}
          >
            {selectedDesignation ?? "Designation"}
          </Button>
        </Dropdown>

        <Input
          placeholder="Search emp name or email..."
          prefix={<SearchOutlined />}
          className={styles.searchInput}
          allowClear
          value={searchInput}
          onChange={handleSearchChange}
        />
      </div>

      <Table
        columns={getColumns(openStatusModal, openDeptDesigModal, onSendMail)}
        dataSource={data?.rows ?? []}
        rowKey="email"
        loading={isLoading || isFetching}
        size="small"
        scroll={{ x: "max-content" }}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: data?.total ?? 0,
          showTotal: (total, range) =>
            `Showing ${range[0]}–${range[1]} of ${total.toLocaleString()} employees`,
          onChange: (page) => setCurrentPage(page),
        }}
        className={styles.employeeTable}
      />

      <Modal
        open={!!inviteRecord}
        title="Resend Invite Email"
        onCancel={closeResendInvite}
        footer={[
          <Button
            key="send"
            type="primary"
            loading={inviteLoading}
            onClick={handleResendInvite}
          >
            Resend Invite
          </Button>,
          <Button key="cancel" onClick={closeResendInvite}>
            Cancel
          </Button>,
        ]}
      >
        {inviteRecord && (
          <div style={{ padding: "8px 0" }}>
            <p style={{ marginBottom: 8, fontSize: "0.85rem", color: "#555" }}>
              Employee:{" "}
              <strong>{inviteRecord.users_meta?.name ?? "—"}</strong>
            </p>
            <p style={{ marginBottom: 16, fontSize: "0.85rem", color: "#555" }}>
              Email: <strong>{inviteRecord.email}</strong>
            </p>
            <p style={{ fontSize: "0.88rem", color: "#374151" }}>
              A new account setup link will be generated. Any previous invite
              link will no longer work. You can resend the invite as many times
              as needed while the employee has not completed setup.
            </p>
            <p
              style={{
                marginTop: 10,
                fontSize: "0.82rem",
                color: "#dc2626",
                fontWeight: 600,
              }}
            >
              Are you sure you want to proceed?
            </p>
          </div>
        )}
      </Modal>

      <Modal
        open={!!resetRecord}
        title="Send Password Reset Mail"
        onCancel={closePasswordReset}
        footer={[
          <Button
            key="confirm"
            type="primary"
            danger
            loading={resetLoading}
            onClick={handlePasswordReset}
          >
            Yes, Send Reset Mail
          </Button>,
          <Button key="cancel" onClick={closePasswordReset}>
            Cancel
          </Button>,
        ]}
      >
        {resetRecord && (
          <div style={{ padding: "8px 0" }}>
            <p style={{ marginBottom: 8, fontSize: "0.85rem", color: "#555" }}>
              Employee:{" "}
              <strong>{resetRecord.users_meta?.name ?? "—"}</strong>
            </p>
            <p style={{ marginBottom: 16, fontSize: "0.85rem", color: "#555" }}>
              Email: <strong>{resetRecord.email}</strong>
            </p>
            <p style={{ fontSize: "0.88rem", color: "#374151" }}>
              This will deactivate the employee&apos;s account and send a
              password reset link to their email. The link will expire in{" "}
              <strong>24 hours</strong>. Registration status will be updated to
              &quot;Password Reset Mail Sent&quot;.
            </p>
            <p
              style={{
                marginTop: 10,
                fontSize: "0.82rem",
                color: "#dc2626",
                fontWeight: 600,
              }}
            >
              Are you sure you want to proceed?
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Change Employee Status"
        open={statusModal.open}
        onOk={handleStatusUpdate}
        onCancel={() =>
          setStatusModal({ open: false, email: null, newStatus: null })
        }
        okText="Update"
        cancelText="Cancel"
        confirmLoading={statusUpdating}
        okButtonProps={{ danger: false }}
      >
        <p style={{ marginBottom: 8, color: "#555" }}>
          Employee: <strong>{statusModal.email}</strong>
        </p>
        <Select
          style={{ width: "100%" }}
          value={statusModal.newStatus}
          onChange={(val) =>
            setStatusModal((prev) => ({ ...prev, newStatus: val }))
          }
          options={EMP_ACCOUNT_STATUS_OPTIONS}
          placeholder="Select status"
        />
      </Modal>

      <Modal
        title="Change Department / Designation"
        open={deptDesigModal.open}
        onCancel={closeDeptDesigModal}
        footer={
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={closeDeptDesigModal}>Cancel</Button>
            <Button
              type="primary"
              loading={savingDept}
              disabled={!deptDesigModal.newDept}
              onClick={handleSaveDept}
            >
              Save Department
            </Button>
            <Button
              type="primary"
              loading={savingDesig}
              disabled={!deptDesigModal.newDesig}
              onClick={handleSaveDesig}
            >
              Save Designation
            </Button>
            <Button
              type="primary"
              loading={savingBoth}
              disabled={!deptDesigModal.newDept || !deptDesigModal.newDesig}
              onClick={handleSaveBoth}
            >
              Save Both
            </Button>
          </div>
        }
      >
        <p style={{ marginBottom: 12, color: "#555" }}>
          Employee: <strong>{deptDesigModal.email}</strong>
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <b>Department:</b>
          <Select
            style={{ flex: 1 }}
            value={deptDesigModal.newDept}
            onChange={(val) =>
              setDeptDesigModal((prev) => ({ ...prev, newDept: val }))
            }
            options={departmentsData
              .filter((d) => d.is_active === true)
              .map((d) => ({
                value: d.department_name,
                label: d.department_name,
              }))}
            placeholder="Select department"
          />
          <b>Designation:</b>
          <Select
            style={{ flex: 1 }}
            value={deptDesigModal.newDesig}
            onChange={(val) =>
              setDeptDesigModal((prev) => ({ ...prev, newDesig: val }))
            }
            options={designationsData
              .filter((d) => d.is_active === true)
              .map((d) => ({
                value: d.designation_name,
                label: d.designation_name,
              }))}
            placeholder="Select designation"
          />
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeDirectoryComp;
