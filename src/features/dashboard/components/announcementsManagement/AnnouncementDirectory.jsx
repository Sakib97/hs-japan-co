import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Tooltip,
  Popconfirm,
  Image,
  Badge,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { deleteImage } from "../../../../utils/handleImage";
import { showToast } from "../../../../components/layout/CustomToast";
import { QK_ANNOUNCEMENTS } from "../../../../config/queryKeyConfig";
import styles from "./AnnouncementDirectory.module.css";
import { getFormattedTime } from "../../../../utils/dateUtil";

const BUCKET = "combined_page_images";

const TYPE_COLOR = {
  announcement: "orange",
  news: "blue",
  event: "purple",
  notice: "red",
};

const getDaysRemaining = (endsAt) => {
  const diff = Math.ceil(
    (new Date(endsAt) - new Date()) / (1000 * 60 * 60 * 24),
  );
  return diff;
};

const getStatus = (row) => {
  if (!row.is_active) return { label: "Inactive", color: "default" };
  const now = new Date();
  const start = row.start_date ? new Date(row.start_date) : null;
  const end = row.end_date ? new Date(row.end_date) : null;
  if (start && now < start) return { label: "Scheduled", color: "blue" };
  if (end && now > end) return { label: "Expired", color: "red" };
  return { label: "Active", color: "green" };
};

const AnnouncementDirectory = ({ onEdit }) => {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: [QK_ANNOUNCEMENTS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const handleDelete = async (record) => {
    setDeletingId(record.id);
    try {
      if (record.banner_url) {
        await deleteImage(record.banner_url, BUCKET);
      }
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", record.id);
      if (error) throw error;
      showToast("Announcement deleted.", "success");
      queryClient.invalidateQueries({ queryKey: [QK_ANNOUNCEMENTS] });
    } catch (err) {
      showToast(err.message || "Failed to delete.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = (data ?? []).filter((row) => {
    if (statusFilter) {
      const s = getStatus(row).label.toLowerCase();
      if (s !== statusFilter) return false;
    }
    if (typeFilter && row.type !== typeFilter) return false;
    return true;
  });

  const activeCount = (data ?? []).filter(
    (r) => getStatus(r).label === "Active",
  ).length;
  const totalCount = (data ?? []).length;

  const columns = [
    {
      title: "Visual Preview",
      key: "banner_url",
      width: 350,
      render: (_, record) =>
        record.banner_url ? (
          <Image
            src={record.banner_url}
            // width={72}
            // height={40}
            style={{ objectFit: "cover", borderRadius: 6 }}
            preview={{ mask: false }}
          />
        ) : (
          <div className={styles.noImage}>No img</div>
        ),
    },
    {
      title: "Created At",
      key: "created_at",
      render: (_, record) => (
        <div className={styles.titleCell}>
          {record.created_at ? getFormattedTime(record.created_at) : "—"}
        </div>
      ),
    },
    {
      title: "Created By",
      key: "created_by",
      render: (_, record) => (
        <div className={styles.titleCell}>
          {record.created_by ? record.created_by : "—"}
        </div>
      ),
    },
    {
      title: "Activation Period",
      key: "period",
      //   width: 100,
      render: (_, record) => {
        const start = record.start_date
          ? new Date(record.start_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "—";
        const end = record.end_date
          ? new Date(record.end_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "—";
        const daysLeft = record.end_date
          ? getDaysRemaining(record.end_date)
          : null;
        return (
          <div className={styles.periodCell}>
            <span className={styles.dateRange}>
              {start} — {end}
            </span>
            {/* {daysLeft !== null && daysLeft > 0 && (
              <span className={styles.daysLeft}>{daysLeft} days remaining</span>
            )} */}
            {daysLeft !== null && daysLeft <= 0 && (
              <span className={styles.expired}>Expired</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      //   width: 50,
      render: (active) => (
        <Tag color={active !== false ? "green" : "red"}>
          {active !== false ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 90,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <EditOutlined
              className={styles.actionIcon}
              onClick={() => onEdit?.(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this announcement?"
            description="This action cannot be undone."
            okText="Delete"
            okType="danger"
            onConfirm={() => handleDelete(record)}
          >
            <Tooltip title="Delete">
              <DeleteOutlined
                className={`${styles.actionIcon} ${styles.deleteIcon}`}
                style={deletingId === record.id ? { opacity: 0.5 } : {}}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Announcement Directory</h2>
          <p className={styles.subtitle}>
            {/* Managing <strong>{activeCount}</strong> active and{" "} */}
            Total <strong>{totalCount}</strong> announcements.{" "}
            <Tag color={totalCount >= 5 ? "red" : "blue"}>
              {totalCount} / 5 banner slots used
            </Tag>
          </p>
        </div>
        <div className={styles.headerActions}>{/* Status filter */}</div>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) =>
            `Showing ${range[0]}–${range[1]} of ${total}`,
        }}
        className={styles.table}
        scroll={{ x: 700 }}
      />
    </div>
  );
};

export default AnnouncementDirectory;
