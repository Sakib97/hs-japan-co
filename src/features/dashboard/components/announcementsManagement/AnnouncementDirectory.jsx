import React, { useState, useContext, useMemo, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Tooltip,
  Popconfirm,
  Image,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { deleteImage } from "../../../../utils/handleImage";
import { showToast } from "../../../../components/layout/CustomToast";
import { QK_ANNOUNCEMENTS } from "../../../../config/queryKeyConfig";
import styles from "./AnnouncementDirectory.module.css";
import { getFormattedTime } from "../../../../utils/dateUtil";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const BUCKET = "combined_page_images";

const RowContext = React.createContext({});

const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: "move" }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

const SortableRow = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });

  const contextValue = useMemo(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );

  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging
      ? { position: "relative", zIndex: 9999, opacity: 0.85 }
      : {}),
  };

  return (
    <RowContext.Provider value={contextValue}>
      <tr ref={setNodeRef} {...attributes} {...props} style={style} />
    </RowContext.Provider>
  );
};

const getDaysRemaining = (endsAt) =>
  Math.ceil((new Date(endsAt) - new Date()) / (1000 * 60 * 60 * 24));

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
  const [togglingId, setTogglingId] = useState(null);
  const [reordering, setReordering] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [QK_ANNOUNCEMENTS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(data ?? []);
  }, [data]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [QK_ANNOUNCEMENTS] });

  const handleToggle = async (record) => {
    setTogglingId(record.id);
    const { error } = await supabase
      .from("announcements")
      .update({ is_active: !record.is_active })
      .eq("id", record.id);
    if (error) {
      showToast("Failed to update status.", "error");
    } else {
      await invalidate();
      showToast(
        `Announcement ${!record.is_active ? "activated" : "deactivated"}.`,
        "success",
      );
    }
    setTogglingId(null);
  };

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
      await invalidate();
    } catch (err) {
      showToast(err.message || "Failed to delete.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const onDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(rows, oldIndex, newIndex);
    setRows(reordered);
    setReordering(true);
    const results = await Promise.all(
      reordered.map((r, i) =>
        supabase
          .from("announcements")
          .update({ order: i + 1 })
          .eq("id", r.id),
      ),
    );
    setReordering(false);
    if (results.some((r) => r.error)) {
      showToast("Failed to save new order.", "error");
      setRows(data ?? []);
    } else {
      await invalidate();
      showToast("Order updated.", "success");
    }
  };

  const totalCount = (data ?? []).length;

  const columns = [
    {
      title: "Visual Preview",
      key: "banner_url",
      width: 250,
      render: (_, record) =>
        record.banner_url ? (
          <Image
            src={record.banner_url}
            style={{ objectFit: "cover", borderRadius: 6 }}
            preview={{
              mask: { blur: true },
              cover: (
                <Space vertical align="center">
                  <i style={{ fontSize: 30 }} className="fi fi-br-zoom-in"></i>
                </Space>
              ),
            }}
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
        <div className={styles.titleCell}>{record.created_by ?? "—"}</div>
      ),
    },
    {
      title: "Activation Period",
      key: "period",
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
            {daysLeft !== null && daysLeft <= 0 && (
              <span className={styles.expired}>Expired</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Redirect URL",
      dataIndex: "redirect_url",
      key: "redirect_url",
      width: 90,
      render: (redirect_url) =>
        redirect_url ? (
          <a href={redirect_url} target="_blank" rel="noopener noreferrer">
            {redirect_url}
          </a>
        ) : (
          "—"
        ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      width: 90,
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
      width: 130,
      render: (_, record) => (
        <div className={styles.actionsCell}>
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit?.(record)}
            />
          </Tooltip>

          <button
            type="button"
            className={`${styles.toggle} ${record.is_active !== false ? styles.toggleOn : styles.toggleOff} ${togglingId === record.id ? styles.toggleLoading : ""}`}
            onClick={() => handleToggle(record)}
            title={record.is_active !== false ? "Deactivate" : "Activate"}
            aria-pressed={record.is_active !== false}
            disabled={togglingId === record.id}
          >
            {togglingId === record.id ? (
              <span className={styles.toggleSpinner} />
            ) : (
              <span className={styles.toggleThumb} />
            )}
          </button>

          <Tooltip title="Delete">
            <Popconfirm
              title="Delete this announcement?"
              description="This action cannot be undone."
              okText="Delete"
              okType="danger"
              cancelText="Cancel"
              onConfirm={() => handleDelete(record)}
            >
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                loading={deletingId === record.id}
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      width: 90,
      render: (order) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className={styles.orderBadge}>{order ?? "—"}</span>
          <DragHandle />
        </div>
      ),
    },
  ];

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Announcement Directory</h2>
          <p className={styles.subtitle}>
            Total <strong>{totalCount}</strong> announcements.{" "}
            <Tag color={totalCount >= 5 ? "red" : "blue"}>
              {totalCount} / 5 banner slots used
            </Tag>
          </p>
        </div>
      </div>

      {/* <Spin spinning={reordering} tip="Saving order..."> */}
      <Spin spinning={reordering}>
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            items={rows.map((r) => r.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{ body: { row: SortableRow } }}
              columns={columns}
              dataSource={rows}
              rowKey="id"
              loading={isLoading}
              pagination={{
                pageSize: 10,
                showTotal: (total, range) =>
                  `Showing ${range[0]}–${range[1]} of ${total}`,
              }}
              className={styles.table}
              scroll={{ x: 900 }}
            />
          </SortableContext>
        </DndContext>
      </Spin>
    </div>
  );
};

export default AnnouncementDirectory;
