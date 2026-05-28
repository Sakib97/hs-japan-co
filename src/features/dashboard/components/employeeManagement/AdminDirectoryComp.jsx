import { useState } from "react";
import { Table, Avatar, Tag, Button, Spin, Tooltip, Modal } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { QK_ADMINS } from "../../../../config/queryKeyConfig";
import styles from "../../styles/EmployeeManagementPage.module.css";
import { useAuth } from "../../../../context/AuthProvider";
import {
  EMP_REGISTRATION_STATUS,
  EMP_REGISTRATION_STATUS_OPTIONS,
  EMP_REGISTRATION_STATUS_COLOR,
} from "../../../../config/statusAndRoleConfig";
import { showToast } from "../../../../components/layout/CustomToast";
import { generateToken } from "../../../../utils/generateToken";
import {
  sendInviteEmailEdgeFunction,
  sendPasswordResetEmail,
} from "../../../../utils/sendInviteEmail";

const PAGE_SIZE = 10;

const baseColumns = [
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
            (record.users_meta?.name?.charAt(0) ??
              record.email?.charAt(0) ??
              "?")}
        </Avatar>
        <div>
          <div className={styles.employeeName}>
            {record.users_meta?.name ?? "—"}
          </div>
          <div className={styles.employeeEmail}>{record.email ?? "—"}</div>
        </div>
      </div>
    ),
  },
  {
    title: "STATUS",
    key: "status",
    render: (_, record) =>
      record.users_meta?.is_active ? (
        <Tag color="success">Active</Tag>
      ) : (
        <Tag color="default">Inactive</Tag>
      ),
  },
  
];

const isAdminInviteResendStatus = (registrationStatus) =>
  registrationStatus === EMP_REGISTRATION_STATUS.ACCOUNT_CREATION_MAIL_SENT ||
  registrationStatus === EMP_REGISTRATION_STATUS.ACCOUNT_CREATION_MAIL_RESENT;

const isAdminPasswordResetStatus = (registrationStatus) =>
  registrationStatus === EMP_REGISTRATION_STATUS.ACCOUNT_CREATED ||
  registrationStatus === EMP_REGISTRATION_STATUS.PASSWORD_RESET_MAIL_SENT;

const getAdminMailActionLabel = (registrationStatus) => {
  if (isAdminInviteResendStatus(registrationStatus)) {
    return "Resend Invite Mail";
  }
  if (isAdminPasswordResetStatus(registrationStatus)) {
    return "Send Password Reset Mail";
  }
  return "Send Invite Mail";
};

const mapResendAdminInviteRpcError = (message = "") => {
  if (message.includes("ADMIN_NOT_FOUND_OR_INVALID_STATUS")) {
    return "Cannot resend invite. The admin must have a pending account setup (invite mail sent or resent).";
  }
  return message || "Failed to resend invite.";
};

const mapAdminPasswordResetRpcError = (message = "") => {
  if (message.includes("ADMIN_NOT_FOUND_OR_ACCOUNT_NOT_CREATED")) {
    return "Cannot send password reset. Admin must have an active, created account.";
  }
  return message || "Failed to send password reset mail.";
};

const AdminDirectoryComp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const { isSuperAdmin, user } = useAuth();
  const currentUserEmail = user?.email ?? "";

  const [inviteRecord, setInviteRecord] = useState(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [resetRecord, setResetRecord] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);

  const closeInvite = () => setInviteRecord(null);
  const closePasswordReset = () => setResetRecord(null);

  const onMailAction = (record) => {
    const status = record.registration_status;
    if (isAdminInviteResendStatus(status)) {
      setInviteRecord(record);
      return;
    }

    if (isAdminPasswordResetStatus(status)) {
      if (record.email && record.email === currentUserEmail) {
        showToast("You cannot send a password reset mail to yourself.", "error");
        return;
      }
      setResetRecord(record);
      return;
    }

    showToast("No mail action is available for this admin.", "warning");
  };

  const handleResendInvite = async () => {
    if (!inviteRecord?.email) return;
    setInviteLoading(true);
    try {
      const token = generateToken();
      const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const { error: rpcError } = await supabase.rpc(
        "resend_admin_invitation_mail",
        {
          p_email: inviteRecord.email,
          p_token: token,
          p_expires_at: expires_at.toISOString(),
        },
      );

      if (rpcError) {
        showToast(mapResendAdminInviteRpcError(rpcError.message), "error");
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

      queryClient.invalidateQueries({ queryKey: [QK_ADMINS] });
      closeInvite();
    } catch (err) {
      showToast("Unexpected error: " + err.message, "error");
    } finally {
      setInviteLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetRecord?.email) return;
    if (resetRecord.email === currentUserEmail) {
      showToast("You cannot send a password reset mail to yourself.", "error");
      return;
    }

    setResetLoading(true);
    try {
      const token = generateToken();
      const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const { error: rpcError } = await supabase.rpc(
        "send_admin_password_reset_mail",
        {
          p_email: resetRecord.email,
          p_token: token,
          p_expires_at: expires_at.toISOString(),
        },
      );

      if (rpcError) {
        showToast(mapAdminPasswordResetRpcError(rpcError.message), "error");
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

      queryClient.invalidateQueries({ queryKey: [QK_ADMINS] });
      closePasswordReset();
    } catch (err) {
      showToast("Unexpected error: " + err.message, "error");
    } finally {
      setResetLoading(false);
    }
  };

  const columns = isSuperAdmin
    ? [
        ...baseColumns,
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
          title: "ACTIONS",
          key: "actions",
          render: (_, record) => (
            <Tooltip title={getAdminMailActionLabel(record.registration_status)}>
              <span
                role="button"
                tabIndex={0}
                className={styles.mailActionBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onMailAction(record);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onMailAction(record);
                  }
                }}
              >
                <i
                  className={`fi fi-rr-paper-plane-launch ${styles.actionIcon}`}
                />
              </span>
            </Tooltip>
          ),
        },
      ]
    : baseColumns;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QK_ADMINS, currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from("admin")
        .select(
          "id, email, registration_status, users_meta(name, avatar_url, is_active)",
          { count: "exact" },
        )
        .order("created_at", { ascending: true })
        .range(from, to);
      if (error) throw new Error(error.message);
      return { rows: data ?? [], total: count ?? 0 };
    },
    keepPreviousData: true,
  });

  return (
    <div className={styles.directorySection}>
      <div className={styles.directoryHeader}>
        <div>
          <h2 className={styles.directoryTitle}>Admin Directory</h2>
          <p className={styles.directorySubtitle}>
            System administrators with full access
          </p>
        </div>
        <Button
          icon={<i className="fi fi-rr-refresh"></i>}
          size="medium"
          // loading={isFetching && !isLoading}
          onClick={() => {
            setCurrentPage(1);
            queryClient.invalidateQueries({ queryKey: [QK_ADMINS] });
          }}
          // style={{ marginLeft: "auto" }}
          className={styles.adminRefreshBtn}
        >
          Refresh
        </Button>
      </div>

      <Spin spinning={isFetching} size="medium">
        <Table
          columns={columns}
          dataSource={data?.rows ?? []}
          rowKey="id"
          loading={isLoading}
          size="small"
          scroll={{ x: "max-content" }}
          pagination={{
            current: currentPage,
            pageSize: PAGE_SIZE,
            total: data?.total ?? 0,
            showTotal: (total, range) =>
              `Showing ${range[0]}–${range[1]} of ${total.toLocaleString()} admins`,
            onChange: (page) => setCurrentPage(page),
          }}
          className={styles.employeeTable}
        />
      </Spin>

      <Modal
        open={!!inviteRecord}
        title="Resend Invite Mail"
        onCancel={closeInvite}
        footer={[
          <Button
            key="send"
            type="primary"
            loading={inviteLoading}
            onClick={handleResendInvite}
          >
            Resend Invite
          </Button>,
          <Button key="cancel" onClick={closeInvite}>
            Cancel
          </Button>,
        ]}
      >
        {inviteRecord && (
          <div style={{ padding: "8px 0" }}>
            <p style={{ marginBottom: 8, fontSize: "0.85rem", color: "#555" }}>
              Admin: <strong>{inviteRecord.users_meta?.name ?? "—"}</strong>
            </p>
            <p style={{ marginBottom: 16, fontSize: "0.85rem", color: "#555" }}>
              Email: <strong>{inviteRecord.email}</strong>
            </p>
            <p style={{ fontSize: "0.88rem", color: "#374151" }}>
              A new account setup link will be generated. Any previous invite
              link will no longer work. You can resend the invite as many times
              as needed while setup is not complete.
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
            disabled={resetRecord?.email === currentUserEmail}
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
              Admin: <strong>{resetRecord.users_meta?.name ?? "—"}</strong>
            </p>
            <p style={{ marginBottom: 16, fontSize: "0.85rem", color: "#555" }}>
              Email: <strong>{resetRecord.email}</strong>
            </p>
            <p style={{ fontSize: "0.88rem", color: "#374151" }}>
              This will send a password reset link to the admin&apos;s email. The
              link will expire in <strong>24 hours</strong>. Registration status
              will be updated to &quot;Password Reset Mail Sent&quot;.
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
    </div>
  );
};

export default AdminDirectoryComp;
