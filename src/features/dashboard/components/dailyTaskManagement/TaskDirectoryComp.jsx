import { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Descriptions,
  Space,
  Input,
  DatePicker,
  Tooltip,
  Dropdown,
  Select,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import {
  DAILY_TASK_STATUS_OPTIONS,
  DAILY_TASK_STATUS_COLOR,
  DAILY_TASK_STATUS,
  NOTIFICATION_TYPE,
} from "../../../../config/statusAndRoleConfig";
import {
  QK_DAILY_TASKS,
  QK_NOTIFICATIONS,
} from "../../../../config/queryKeyConfig";
import { getFormattedTime } from "../../../../utils/dateUtil";
import styles from "./TaskDirectoryComp.module.css";
import { useAuth } from "../../../../context/AuthProvider";
import { showToast } from "../../../../components/layout/CustomToast";

const PAGE_SIZE = 10;

const taskStatusLabelMap = Object.fromEntries(
  DAILY_TASK_STATUS_OPTIONS.map(({ value, label }) => [value, label]),
);

const formatTaskDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const TaskDirectoryComp = () => {
  const { user, userMeta } = useAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewRecord, setViewRecord] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [statusChangeRecord, setStatusChangeRecord] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [reviewComments, setReviewComments] = useState("");

  const columns = [
    {
      title: "DATE",
      dataIndex: "created_at",
      key: "created_at",
      //   width: 120,
      render: (v) => <span className={styles.cell}>{formatTaskDate(v)}</span>,
    },
    {
      title: "TASK SUMMARY",
      dataIndex: "content",
      key: "content",
      width: 350,
      render: (val) => {
        const plain = val?.replace(/<[^>]*>/g, "") ?? "";
        const trimmed =
          plain.length > 100 ? plain.substring(0, 97) + "...." : plain;

        return <span className={styles.cellLink}>{trimmed || "—"}</span>;
      },
    },

    ...(userMeta?.role === "admin"
      ? [
          {
            title: "REPORTED BY",
            dataIndex: "created_by_name",
            key: "created_by_name",
            // width: 150,
            render: (v, record) => {
              const name = v ?? record.created_by_email ?? "—";
              const email = record.created_by_email ?? null;
              return (
                <div className={styles.cell}>
                  {name}
                  {email && <div className={styles.email}>{email}</div>}
                </div>
              );
            },
          },
        ]
      : []),

    {
      title: "Performance Review",
      dataIndex: "verification_comments",
      key: "verification_comments",
      //   width: 150,
      render: (v) => <span className={styles.cell}>{v ?? "—"}</span>,
    },

    ...(userMeta?.role === "admin"
      ? [
          {
            title: "Review By",
            dataIndex: "verified_by",
            key: "verified_by",
            //   width: 150,
            render: (v) => <span className={styles.cell}>{v ?? "—"}</span>,
          },
        ]
      : []),

    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      //   width: 150,
      render: (v) => (
        <Tag color={DAILY_TASK_STATUS_COLOR[v] ?? "default"}>
          {taskStatusLabelMap[v] ?? v ?? "—"}
        </Tag>
      ),
    },

    {
      title: "ACTIONS",
      key: "actions",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => setViewRecord(record)}
            />
          </Tooltip>

          {userMeta?.role === "admin" && (
            <Tooltip title="Change Status">
              <Button
                size="small"
                icon={<i className="fi fi-rr-career-growth"></i>}
                onClick={() => {
                  setStatusChangeRecord(record);
                  setNewStatus(record.status ?? null);
                  setReviewComments(record.verification_comments ?? "");
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [
      QK_DAILY_TASKS,
      currentPage,
      searchQuery,
      userMeta?.role,
      selectedStatus,
      selectedDate,
    ],
    queryFn: async () => {
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const selectFields =
        userMeta?.role === "admin"
          ? "id, created_at,content,status, created_by_email, created_by_name, verification_comments, verified_by"
          : "id, created_at,content,status, created_by_email, created_by_name, verification_comments";

      let query = supabase
        .from("daily_task")
        .select(selectFields, { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      // Filter by created_by only if user is an employee
      if (userMeta?.role === "employee") {
        query = query.eq("created_by_email", user?.email ?? null);
      }

      // Filter by status if selected
      if (selectedStatus) {
        query = query.eq("status", selectedStatus);
      }

      // Filter by single date if selected
      if (selectedDate) {
        const startOfDay = selectedDate.startOf("day").toISOString();
        const endOfDay = selectedDate.endOf("day").toISOString();
        query = query.gte("created_at", startOfDay).lte("created_at", endOfDay);
      }

      if (searchQuery) {
        if (userMeta?.role === "admin") {
          // For admins, search by reporter name or email
          query = query.or(
            `created_by_name.ilike.%${searchQuery}%,created_by_email.ilike.%${searchQuery}%`,
          );
        } else {
          // For employees, search by task content
          query = query.ilike("content", `%${searchQuery}%`);
        }
      }

      const { data: tasks, error, count } = await query;
      if (error) throw new Error(error.message);
      return { rows: tasks ?? [], total: count ?? 0 };
    },
    keepPreviousData: true,
  });

  // Force refetch when search query changes to avoid stale cached results
  useEffect(() => {
    if (searchQuery) {
      refetch();
    }
  }, [searchQuery, refetch]);

  const closeStatusModal = () => {
    setStatusChangeRecord(null);
    setNewStatus(null);
    setReviewComments("");
  };

  const { mutate: updateTaskStatus, isPending: isUpdatingStatus } = useMutation(
    {
      mutationFn: async ({
        taskId,
        status,
        verificationComments,
        reporterEmail,
        created_at,
      }) => {
        // Update task status
        const { error: updateError } = await supabase
          .from("daily_task")
          .update({
            status,
            verified_by: user?.email ?? null,
            verification_comments: verificationComments || null,
          })
          .eq("id", taskId);

        if (updateError) throw new Error(updateError.message);

        // Create notification for task reporter
        const statusLabel =
          DAILY_TASK_STATUS_OPTIONS.find((opt) => opt.value === status)
            ?.label || status;
        const message = `The status of your task report on "${formatTaskDate(created_at)}" has been updated to "${statusLabel}".`;

        const { error: notifError } = await supabase
          .from("notifications")
          .insert({
            recipient_email: reporterEmail,
            title: "Task Status Updated",
            message,
            type: NOTIFICATION_TYPE.STATUS_CHANGE,
            redirection_link: "/dashboard/daily-tasks",
            recipient_user_type: "employee",
          });

        if (notifError) throw new Error(notifError.message);
      },
      onSuccess: () => {
        showToast("Task status updated", "success");
        queryClient.invalidateQueries({ queryKey: [QK_DAILY_TASKS] });
        queryClient.invalidateQueries({ queryKey: [QK_NOTIFICATIONS] });
        closeStatusModal();
      },
      onError: (err) => {
        showToast(err.message ?? "Failed to update task status", "error");
      },
    },
  );

  const handleStatusSubmit = () => {
    if (!newStatus) {
      showToast("Please select a status", "warning");
      return;
    }
    updateTaskStatus({
      taskId: statusChangeRecord.id,
      status: newStatus,
      verificationComments: reviewComments,
      reporterEmail: statusChangeRecord.created_by_email,
      created_at: statusChangeRecord.created_at,
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>Reporting History</h3>
        <p className={styles.subtitle}>
          Review and audit your historical task submissions.
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Button
            type=""
            icon={<i className="fi fi-rr-refresh"></i>}
            size="middle"
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
                ...DAILY_TASK_STATUS_OPTIONS.map((opt) => ({
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
              {DAILY_TASK_STATUS_OPTIONS.find((o) => o.value === selectedStatus)
                ?.label ?? "Status"}
            </Button>
          </Dropdown>
          <DatePicker
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setCurrentPage(1);
            }}
            placeholder="Filter by date"
            format="DD/MM/YYYY"
          />
        </div>
        {userMeta?.role === "admin" && (
          <div className={styles.toolbarRight}>
            <Input
              placeholder="Search by reporter name or email..."
              prefix={<SearchOutlined />}
              className={styles.searchInput}
              allowClear
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              value={searchQuery}
            />
          </div>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={data?.rows ?? []}
        rowKey="id"
        loading={isLoading || isFetching}
        size="small"
        className={styles.taskTable}
        scroll={{ x: "max-content" }}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: data?.total ?? 0,
          onChange: (page) => setCurrentPage(page),
          showTotal: (t) => `${t} records`,
          showSizeChanger: false,
        }}
      />

      {/* View Details Modal */}
      <Modal
        open={!!viewRecord}
        onCancel={() => setViewRecord(null)}
        title="Task Details"
        width={700}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
        footer={[
          <Button key="close" onClick={() => setViewRecord(null)}>
            Close
          </Button>,
        ]}
      >
        {viewRecord && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Date">
              {formatTaskDate(viewRecord.created_at)}
            </Descriptions.Item>

            <Descriptions.Item label="Status">
              <Tag
                color={DAILY_TASK_STATUS_COLOR[viewRecord.status] ?? "default"}
              >
                {taskStatusLabelMap[viewRecord.status] ??
                  viewRecord.status ??
                  "—"}
              </Tag>
            </Descriptions.Item>

            {/* Report By */}
            {userMeta?.role === "admin" && (
              <>
                <Descriptions.Item label="Reported By">
                  <div className={styles.cell}>
                    {viewRecord.created_by_name ??
                      viewRecord.created_by_email ??
                      "—"}
                    {viewRecord.created_by_email && (
                      <div className={styles.email}>
                        {viewRecord.created_by_email}
                      </div>
                    )}
                  </div>
                </Descriptions.Item>

                {viewRecord.verified_by && (
                  <Descriptions.Item label="Reviewed By">
                    {viewRecord.verified_by}
                  </Descriptions.Item>
                )}
              </>
            )}

            {viewRecord.verification_comments && (
              <Descriptions.Item label="Performance Review">
                {viewRecord.verification_comments}
              </Descriptions.Item>
            )}

            <Descriptions.Item label="Task Report" span={1}>
              <div
                className={styles.contentDisplay}
                dangerouslySetInnerHTML={{ __html: viewRecord.content ?? "—" }}
              />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      {/* Change Status Modal - Admin Only */}
      <Modal
        open={!!statusChangeRecord}
        onCancel={closeStatusModal}
        title="Change Task Status"
        width={520}
        footer={[
          <Button
            key="cancel"
            onClick={closeStatusModal}
            disabled={isUpdatingStatus}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isUpdatingStatus}
            onClick={handleStatusSubmit}
          >
            Update Status
          </Button>,
        ]}
      >
        {statusChangeRecord && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginTop: 8,
            }}
          >
            <div style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>
              <strong>
                {/* {statusChangeRecord.created_by_name ??
                  statusChangeRecord.created_by_email ??
                  "Unknown"} */}
                {statusChangeRecord.created_by_name} (
                {statusChangeRecord.created_by_email})
              </strong>
              {" — "}
              {formatTaskDate(statusChangeRecord.created_at)}
            </div>

            <div>
              <label
                style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
              >
                Status <span style={{ color: "red" }}>*</span>
              </label>
              <Select
                value={newStatus}
                onChange={setNewStatus}
                options={DAILY_TASK_STATUS_OPTIONS}
                placeholder="Select a status"
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label
                style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
              >
                Review Comments{" "}
                <span style={{ color: "#999", fontWeight: 400 }}>
                  (optional)
                </span>
              </label>
              <Input.TextArea
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Add any review comments here..."
                rows={4}
                style={{ resize: "vertical" }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TaskDirectoryComp;
