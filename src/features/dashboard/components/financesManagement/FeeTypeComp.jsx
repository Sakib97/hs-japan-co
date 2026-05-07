import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Tooltip,
  Input,
  InputNumber,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { showToast } from "../../../../components/layout/CustomToast";
import { QK_FEE_TYPES } from "../../../../config/queryKeyConfig";
import styles from "./FeeTypeComp.module.css";

const FeeTypeComp = () => {
  const queryClient = useQueryClient();

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editOrder, setEditOrder] = useState(null);

  const [addingRow, setAddingRow] = useState(null); // { title, order, saving }
  const [savingId, setSavingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const {
    data: rows = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QK_FEE_TYPES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fee_type")
        .select("id, fee_type_title, is_active, view_order")
        .order("view_order", { ascending: true, nullsFirst: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [QK_FEE_TYPES] });

  // ── Add ──────────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    const title = addingRow?.title?.trim();
    if (!title) return showToast("Fee type title is required.", "error");
    setAddingRow((p) => ({ ...p, saving: true }));
    const { error } = await supabase.from("fee_type").insert({
      fee_type_title: title,
      view_order: addingRow?.order ?? null,
    });
    setAddingRow(null);
    if (error) {
      if (error.message.includes("fee_type_fee_type_title_key")) {
        return showToast("A fee type with this title already exists.", "error");
      }
      return showToast(error.message, "error");
    }
    invalidate();
    showToast("Fee type added.", "success");
  };

  // ── Save (edit) ───────────────────────────────────────────────────────────
  const handleSave = async (id) => {
    const title = editTitle.trim();
    if (!title) return showToast("Fee type title is required.", "error");
    setSavingId(id);
    const { error } = await supabase
      .from("fee_type")
      .update({ fee_type_title: title, view_order: editOrder ?? null })
      .eq("id", id);
    setSavingId(null);
    if (error) {
      if (error.message.includes("fee_type_fee_type_title_key")) {
        return showToast("A fee type with this title already exists.", "error");
      }
      return showToast(error.message, "error");
    }
    setEditId(null);
    invalidate();
    showToast("Fee type updated.", "success");
  };

  // ── Toggle ────────────────────────────────────────────────────────────────
  const handleToggle = async (record) => {
    setTogglingId(record.id);
    const { error } = await supabase
      .from("fee_type")
      .update({ is_active: !record.is_active })
      .eq("id", record.id);
    setTogglingId(null);
    if (error) return showToast(error.message, "error");
    invalidate();
    showToast(
      `Fee type ${!record.is_active ? "activated" : "deactivated"}.`,
      "success",
    );
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeletingId(id);
    const { error } = await supabase.from("fee_type").delete().eq("id", id);
    setDeletingId(null);
    if (error) return showToast(error.message, "error");
    invalidate();
    showToast("Fee type deleted.", "success");
  };

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = [
    {
      title: "NAME",
      dataIndex: "fee_type_title",
      key: "fee_type_title",
      render: (val, record) => {
        if (record.__isNew) {
          return (
            <Input
              size="small"
              placeholder="Enter fee type title *"
              value={addingRow?.title ?? ""}
              onChange={(e) =>
                setAddingRow((p) => ({ ...p, title: e.target.value }))
              }
              onPressEnter={handleAdd}
              autoFocus
              style={{ maxWidth: 240 }}
            />
          );
        }
        if (editId === record.id) {
          return (
            <Input
              size="small"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onPressEnter={() => handleSave(record.id)}
              autoFocus
              style={{ maxWidth: 240 }}
            />
          );
        }
        return <span className={styles.cellText}>{val ?? "—"}</span>;
      },
    },
    {
      title: "ORDER",
      dataIndex: "view_order",
      key: "view_order",
      width: 90,
      render: (val, record) => {
        if (record.__isNew) {
          return (
            <InputNumber
              size="small"
              min={1}
              placeholder="Order"
              value={addingRow?.order ?? null}
              onChange={(v) => setAddingRow((p) => ({ ...p, order: v }))}
              style={{ width: 72 }}
            />
          );
        }
        if (editId === record.id) {
          return (
            <InputNumber
              size="small"
              min={1}
              value={editOrder}
              onChange={(v) => setEditOrder(v)}
              style={{ width: 72 }}
            />
          );
        }
        return (
          <span className={styles.cellText}>{val != null ? val : "—"}</span>
        );
      },
    },
    {
      title: "STATUS",
      dataIndex: "is_active",
      key: "is_active",
      width: 90,
      render: (val, record) => {
        if (record.__isNew) return null;
        return (
          <Tag color={val !== false ? "green" : "red"}>
            {val !== false ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: "ACTIONS",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => {
        if (record.__isNew) {
          return (
            <div style={{ display: "flex", gap: 8 }}>
              <Tooltip title="Save">
                <Button
                  size="small"
                  type="primary"
                  icon={<CheckOutlined />}
                  loading={addingRow?.saving}
                  onClick={handleAdd}
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => setAddingRow(null)}
                />
              </Tooltip>
            </div>
          );
        }
        if (editId === record.id) {
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
        }
        return (
          <div style={{ display: "flex", gap: 8 }}>
            <Tooltip title="Edit">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditId(record.id);
                  setEditTitle(record.fee_type_title ?? "");
                  setEditOrder(record.view_order ?? null);
                }}
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
                title={`Delete "${record.fee_type_title}"?`}
                description="This action cannot be undone."
                okText="Delete"
                okType="danger"
                cancelText="Cancel"
                onConfirm={() => handleDelete(record.id)}
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
  ];

  const newRowEntry = addingRow
    ? [
        {
          id: "__new__",
          fee_type_title: "",
          is_active: true,
          view_order: null,
          __isNew: true,
        },
      ]
    : [];

  return (
    <div className={styles.tableSection}>
      <div className={styles.tableHeader}>
        <div>
          <h2 className={styles.tableTitle}>Fee Type Directory</h2>
          <p className={styles.tableSubtitle}>
            Manage fee categories used in student receipts
          </p>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={[...rows, ...newRowEntry]}
        rowKey="id"
        loading={isLoading || isFetching}
        size="small"
        scroll={{ x: "max-content" }}
        className={styles.dirTable}
        pagination={{
          pageSize: 10,
          showTotal: (t) => `${t} records`,
          showSizeChanger: false,
        }}
        footer={() => (
          <button
            onClick={() => {
              if (!addingRow) setAddingRow({ title: "", order: null });
            }}
            disabled={!!addingRow}
            className={styles.addBtn}
          >
            <PlusOutlined /> Add New Fee Type
          </button>
        )}
      />
    </div>
  );
};

export default FeeTypeComp;
