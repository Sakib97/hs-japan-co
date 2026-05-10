import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Descriptions,
  Space,
  Input,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import {
  DAILY_TASK_STATUS_OPTIONS,
  DAILY_TASK_STATUS_COLOR,
} from "../../../../config/statusAndRoleConfig";
import { QK_DAILY_TASKS } from "../../../../config/queryKeyConfig";
import { getFormattedTime } from "../../../../utils/dateUtil";
import styles from "./TaskDirectoryComp.module.css";
import { useAuth } from "../../../../context/AuthProvider";

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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewRecord, setViewRecord] = useState(null);

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
      render: (val) => {
        const stripped = val?.replace(/<[^>]*>/g, "").substring(0, 100) ?? "—";
        return (
          <span className={styles.cellLink}>
            {stripped.length > 100
              ? stripped.substring(0, 97) + "..."
              : stripped}
          </span>
        );
      },
    },
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
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setViewRecord(record)}
            title="View Details"
          />
        </Space>
      ),
    },
  ];

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [QK_DAILY_TASKS, currentPage, searchQuery],
    queryFn: async () => {
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("daily_task")
        .select("created_at,content,status", { count: "exact" })
        .eq("created_by", user?.email ?? null)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (searchQuery) {
        query = query.ilike("content", `%${searchQuery}%`);
      }

      const { data: tasks, error, count } = await query;
      if (error) throw new Error(error.message);
      return { rows: tasks ?? [], total: count ?? 0 };
    },
    keepPreviousData: true,
  });

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
        </div>
        <div className={styles.toolbarRight}>
          <Input
            placeholder="Search by task content..."
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
      </div>

      <Table
        columns={columns}
        dataSource={data?.rows ?? []}
        rowKey="id"
        loading={isLoading || isFetching}
        size="small"
        className={styles.table}
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

            <Descriptions.Item label="Task Report" span={1}>
              <div
                className={styles.contentDisplay}
                dangerouslySetInnerHTML={{ __html: viewRecord.content ?? "—" }}
              />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default TaskDirectoryComp;
