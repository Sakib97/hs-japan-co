import React, { useState, useContext, useMemo, useEffect } from "react";
import { Tag, Table, Button, Tooltip, Popconfirm, Input } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { showToast } from "../../../../components/layout/CustomToast";
import { QK_SESSIONS } from "../../../../config/queryKeyConfig";
import styles from "./SessionDirectoryComp.module.css";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

  if (props["data-row-key"] === "__new__") {
    return <tr {...props} />;
  }

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

const PAGE_SIZE = 10;

const SessionDirectoryComp = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ── Inline edit state ──
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editOrder, setEditOrder] = useState("");
  const [savingId, setSavingId] = useState(null);

  // ── Inline add state ──
  const [addingInline, setAddingInline] = useState(false);
  const [addName, setAddName] = useState("");
  const [addSubmitting, setAddSubmitting] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QK_SESSIONS, currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error, count } = await supabase
        .from("session")
        .select("id, session_name, is_active, order, created_at", {
          count: "exact",
        })
        .order("order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false })
        .range(from, to);
      if (error) throw new Error(error.message);
      return { rows: data ?? [], total: count ?? 0 };
    },
    keepPreviousData: true,
  });

  // ── Local rows state for optimistic drag reordering ──
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(data?.rows ?? []);
  }, [data]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [QK_SESSIONS] });

  // ── Toggle active ──
  const handleToggle = async (record) => {
    setTogglingId(record.id);
    const { error } = await supabase
      .from("session")
      .update({ is_active: !record.is_active })
      .eq("id", record.id);
    if (error) {
      showToast("Failed to update session status.", "error");
    } else {
      await invalidate();
      showToast(
        `Session ${!record.is_active ? "activated" : "deactivated"} successfully.`,
        "success",
      );
    }
    setTogglingId(null);
  };

  // ── Delete ──
  const handleDelete = async (record) => {
    setDeletingId(record.id);
    const { error } = await supabase
      .from("session")
      .delete()
      .eq("id", record.id);
    if (error) {
      showToast("Failed to delete session.", "error");
    } else {
      await invalidate();
      showToast("Session deleted successfully.", "success");
    }
    setDeletingId(null);
  };

  // ── Inline edit ──
  const openEdit = (record) => {
    setEditId(record.id);
    setEditName(record.session_name ?? "");
    setEditOrder(record.order != null ? String(record.order) : "");
  };

  const handleSave = async (id) => {
    if (!editName.trim()) return;
    setSavingId(id);
    const { error } = await supabase
      .from("session")
      .update({
        session_name: editName.trim(),
        order: editOrder !== "" ? Number(editOrder) : null,
      })
      .eq("id", id);
    setSavingId(null);
    if (error)
      return showToast(error.message || "Failed to update session.", "error");
    await invalidate();
    showToast("Session updated successfully.", "success");
    setEditId(null);
  };

  // ── Inline add ──
  const openInlineAdd = () => {
    setAddName("");
    setAddingInline(true);
  };

  const cancelInlineAdd = () => {
    setAddingInline(false);
    setAddName("");
  };

  const handleAddSubmit = async () => {
    if (!addName.trim()) return;
    const nextOrder =
      rows.length > 0 ? Math.max(...rows.map((r) => r.order ?? 0)) + 1 : 1;
    setAddSubmitting(true);
    try {
      const { error } = await supabase.from("session").insert({
        session_name: addName.trim(),
        order: nextOrder,
      });
      if (error) throw error;
      await invalidate();
      showToast("Session added successfully.", "success");
      cancelInlineAdd();
    } catch (err) {
      showToast(err.message || "Failed to add session.", "error");
    } finally {
      setAddSubmitting(false);
    }
  };

  // ── Drag sort ──
  const onDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(rows, oldIndex, newIndex);
    setRows(reordered);
    const results = await Promise.all(
      reordered.map((r, i) =>
        supabase
          .from("session")
          .update({ order: i + 1 })
          .eq("id", r.id),
      ),
    );
    if (results.some((r) => r.error)) {
      showToast("Failed to save new order.", "error");
      setRows(data?.rows ?? []);
    } else {
      await invalidate();
      showToast("Order updated successfully.", "success");
    }
  };

  const columns = [
    {
      title: "NAME",
      dataIndex: "session_name",
      key: "session_name",
      render: (val, record) => {
        if (editId === record.id)
          return (
            <Input
              size="small"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onPressEnter={() => handleSave(record.id)}
              autoFocus
              style={{ maxWidth: 260 }}
            />
          );
        return <span className={styles.sessionName}>{val ?? "—"}</span>;
      },
    },

    {
      title: "STATUS",
      dataIndex: "is_active",
      key: "is_active",
      render: (active) => (
        <Tag color={active !== false ? "green" : "red"}>
          {active !== false ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      fixed: "right",
      //   width: 140,
      render: (_, record) => {
        if (editId === record.id)
          return (
            <div style={{ display: "flex", gap: 8 }}>
              <Tooltip title="Save">
                <Button
                  size="small"
                  type="primary"
                  icon={<CheckOutlined />}
                  loading={savingId === record.id}
                  onClick={() => handleSave(record.id)}
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => setEditId(null)}
                />
              </Tooltip>
            </div>
          );
        return (
          <div className={styles.actionsCell}>
            <Tooltip title="Edit">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => openEdit(record)}
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
                title={`Delete "${record.session_name}"?`}
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
        );
      },
    },
    {
      title: "ORDER",
      dataIndex: "order",
      key: "order",
      width: 90,
      render: (order, record) => {
        if (record.__isNew) return null;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className={styles.orderBadge}>{order ?? "—"}</span>
            <DragHandle />
          </div>
        );
      },
    },
  ];

  // Inline "new row" appended at bottom of table when adding
  const newRowEntry = addingInline
    ? [
        {
          id: "__new__",
          session_name: "",
          order: null,
          is_active: true,
          __isNew: true,
        },
      ]
    : [];

  const columnsWithNew = columns.map((col) => {
    if (col.dataIndex === "session_name") {
      return {
        ...col,
        render: (val, record) => {
          if (record.__isNew)
            return (
              <Input
                size="small"
                placeholder="Enter session name *"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                onPressEnter={handleAddSubmit}
                autoFocus
                style={{ maxWidth: 260 }}
              />
            );
          return col.render(val, record);
        },
      };
    }
    if (col.key === "is_active") {
      return {
        ...col,
        render: (val, record) => {
          if (record.__isNew) return null;
          return col.render(val, record);
        },
      };
    }
    if (col.key === "actions") {
      return {
        ...col,
        render: (val, record) => {
          if (record.__isNew)
            return (
              <div style={{ display: "flex", gap: 8 }}>
                <Tooltip title="Save">
                  <Button
                    size="small"
                    type="primary"
                    icon={<CheckOutlined />}
                    loading={addSubmitting}
                    onClick={handleAddSubmit}
                  />
                </Tooltip>
                <Tooltip title="Cancel">
                  <Button
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={cancelInlineAdd}
                  />
                </Tooltip>
              </div>
            );
          return col.render(val, record);
        },
      };
    }
    return col;
  });

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Session Directory</h2>
          <p className={styles.subtitle}>Manage academic sessions</p>
        </div>
      </div>

      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={rows.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            components={{ body: { row: SortableRow } }}
            columns={columnsWithNew}
            dataSource={[...rows, ...newRowEntry]}
            rowKey="id"
            loading={isLoading || isFetching}
            className={styles.antTable}
            scroll={{ x: "max-content" }}
            pagination={{
              current: currentPage,
              pageSize: PAGE_SIZE,
              total: data?.total ?? 0,
              onChange: (page) => setCurrentPage(page),
              showTotal: (t) => `${t} records`,
              showSizeChanger: false,
            }}
            footer={() => (
              <button
                onClick={openInlineAdd}
                disabled={addingInline}
                className={styles.addBtn}
              >
                <PlusOutlined /> Add New Session
              </button>
            )}
          />
        </SortableContext>
      </DndContext>
    </section>
  );
};

export default SessionDirectoryComp;
