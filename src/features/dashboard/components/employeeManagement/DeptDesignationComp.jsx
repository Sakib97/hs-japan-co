import { useState } from "react";
import { Table, Tag, Button, Tooltip, Input, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { showToast } from "../../../../components/layout/CustomToast";
import {
  QK_DEPARTMENTS,
  QK_DESIGNATIONS,
  QK_DEPT_AND_DESIG,
} from "../../../../config/queryKeyConfig";
import styles from "../../styles/DeptDesignationComp.module.css";

// ─── Shared inline‑editable table ────────────────────────────────────────────

const EditableTable = ({
  title,
  subtitle,
  rows,
  isLoading,
  isFetching,
  onAdd,
  onSave,
  onDelete,
  onToggleStatus,
  addingRow,
  setAddingRow,
  savingId,
  togglingId,
  deletingId,
  nameField,
  namePlaceholder,
}) => {
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const columns = [
    {
      title: "NAME",
      dataIndex: nameField,
      key: nameField,
      render: (val, record) => {
        if (editId === record.id) {
          return (
            <Input
              size="small"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onPressEnter={() => {
                onSave({ id: record.id, name: editValue });
                setEditId(null);
              }}
              autoFocus
              style={{ maxWidth: 260 }}
            />
          );
        }
        return <span className={styles.cellText}>{val ?? "—"}</span>;
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
      render: (_, record) => {
        if (editId === record.id) {
          return (
            <div style={{ display: "flex", gap: 8 }}>
              <Tooltip title="Save">
                <Button
                  size="small"
                  type="primary"
                  icon={<CheckOutlined />}
                  loading={savingId === record.id}
                  onClick={() => {
                    onSave({ id: record.id, name: editValue });
                    setEditId(null);
                  }}
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
                  setEditValue(record[nameField] ?? "");
                }}
              />
            </Tooltip>
            <button
              type="button"
              className={`${styles.toggle} ${record.is_active !== false ? styles.toggleOn : styles.toggleOff} ${togglingId === record.id ? styles.toggleLoading : ""}`}
              onClick={() => onToggleStatus(record)}
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
                title={`Delete "${record[nameField]}"?`}
                description="This action cannot be undone."
                okText="Delete"
                okType="danger"
                cancelText="Cancel"
                onConfirm={() => onDelete(record.id)}
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

  // Inline "new row" appended at the bottom of the table data
  const newRowEntry = addingRow
    ? [{ id: "__new__", [nameField]: "", is_active: true, __isNew: true }]
    : [];

  const columnsWithNew = columns.map((col) => {
    if (col.dataIndex === nameField) {
      return {
        ...col,
        render: (val, record) => {
          if (record.__isNew) {
            return (
              <Input
                size="small"
                placeholder={namePlaceholder}
                value={addingRow?.name ?? ""}
                onChange={(e) =>
                  setAddingRow((prev) => ({ ...prev, name: e.target.value }))
                }
                onPressEnter={() => onAdd(addingRow?.name ?? "")}
                autoFocus
                style={{ maxWidth: 260 }}
              />
            );
          }
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
          if (record.__isNew) {
            return (
              <div style={{ display: "flex", gap: 8 }}>
                <Tooltip title="Save">
                  <Button
                    size="small"
                    type="primary"
                    icon={<CheckOutlined />}
                    loading={addingRow?.saving}
                    onClick={() => onAdd(addingRow?.name ?? "")}
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
          return col.render(val, record);
        },
      };
    }
    return col;
  });

  return (
    <div className={styles.tableSection}>
      <div className={styles.tableHeader}>
        <div>
          <h2 className={styles.tableTitle}>{title}</h2>
          <p className={styles.tableSubtitle}>{subtitle}</p>
        </div>
      </div>

      <Table
        columns={columnsWithNew}
        dataSource={[...(rows ?? []), ...newRowEntry]}
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
              if (!addingRow) setAddingRow({ name: "" });
            }}
            disabled={!!addingRow}
            className={styles.addBtn}
          >
            <PlusOutlined /> Add New {title.replace(" Directory", "")}
          </button>
        )}
      />
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const DeptDesignationComp = () => {
  const queryClient = useQueryClient();

  // ── Departments state ──────────────────────────────────────────────────────
  const [addingDept, setAddingDept] = useState(null);
  const [savingDeptId, setSavingDeptId] = useState(null);
  const [togglingDeptId, setTogglingDeptId] = useState(null);
  const [deletingDeptId, setDeletingDeptId] = useState(null);

  // ── Designations state ─────────────────────────────────────────────────────
  const [addingDesig, setAddingDesig] = useState(null);
  const [savingDesigId, setSavingDesigId] = useState(null);
  const [togglingDesigId, setTogglingDesigId] = useState(null);
  const [deletingDesigId, setDeletingDesigId] = useState(null);

  // ── Queries ────────────────────────────────────────────────────────────────
  const {
    data: deptDesigData,
    isLoading: deptDesigLoading,
    isFetching: deptDesigFetching,
  } = useQuery({
    queryKey: [QK_DEPT_AND_DESIG],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_departments_and_designations",
      );
      if (error) throw error;
      return data;
    },
  });

  const depts = deptDesigData?.departments ?? [];
  const desigs = deptDesigData?.designations ?? [];
  const deptsLoading = deptDesigLoading;
  const deptsFetching = deptDesigFetching;
  const desigsLoading = deptDesigLoading;
  const desigsFetching = deptDesigFetching;

  // ── Department handlers ────────────────────────────────────────────────────
  const handleAddDept = async (name) => {
    if (!name?.trim()) return showToast("Name is required.", "error");
    setAddingDept((p) => ({ ...p, saving: true }));
    const { error } = await supabase
      .from("departments")
      .insert({ department_name: name.trim() });
    setAddingDept(null);
    if (error) return showToast(error.message, "error");
    queryClient.invalidateQueries({ queryKey: [QK_DEPT_AND_DESIG] });
    showToast("Department added.", "success");
  };

  const handleSaveDept = async ({ id, name }) => {
    if (!name?.trim()) return showToast("Name is required.", "error");
    setSavingDeptId(id);
    const { error } = await supabase
      .from("departments")
      .update({ department_name: name.trim() })
      .eq("id", id);
    setSavingDeptId(null);
    if (error) return showToast(error.message, "error");
    queryClient.invalidateQueries({ queryKey: [QK_DEPT_AND_DESIG] });
    showToast("Department updated.", "success");
  };

  const handleToggleDept = async (record) => {
    setTogglingDeptId(record.id);
    const { error } = await supabase
      .from("departments")
      .update({ is_active: !record.is_active })
      .eq("id", record.id);
    setTogglingDeptId(null);
    if (error) return showToast(error.message, "error");
    queryClient.invalidateQueries({ queryKey: [QK_DEPT_AND_DESIG] });
    showToast(
      `Department ${!record.is_active ? "activated" : "deactivated"}.`,
      "success",
    );
  };

  const handleDeleteDept = async (id) => {
    setDeletingDeptId(id);
    const { error } = await supabase.from("departments").delete().eq("id", id);
    setDeletingDeptId(null);
    if (error) return showToast(error.message, "error");
    queryClient.invalidateQueries({ queryKey: [QK_DEPT_AND_DESIG] });
    showToast("Department deleted.", "success");
  };

  // ── Designation handlers ───────────────────────────────────────────────────
  const handleAddDesig = async (name) => {
    if (!name?.trim()) return showToast("Name is required.", "error");
    setAddingDesig((p) => ({ ...p, saving: true }));
    const { error } = await supabase
      .from("designations")
      .insert({ designation_name: name.trim() });
    setAddingDesig(null);
    if (error) return showToast(error.message, "error");
    queryClient.invalidateQueries({ queryKey: [QK_DEPT_AND_DESIG] });
    showToast("Designation added.", "success");
  };

  const handleSaveDesig = async ({ id, name }) => {
    if (!name?.trim()) return showToast("Name is required.", "error");
    setSavingDesigId(id);
    const { error } = await supabase
      .from("designations")
      .update({ designation_name: name.trim() })
      .eq("id", id);
    setSavingDesigId(null);
    if (error) return showToast(error.message, "error");
    queryClient.invalidateQueries({ queryKey: [QK_DEPT_AND_DESIG] });
    showToast("Designation updated.", "success");
  };

  const handleToggleDesig = async (record) => {
    setTogglingDesigId(record.id);
    const { error } = await supabase
      .from("designations")
      .update({ is_active: !record.is_active })
      .eq("id", record.id);
    setTogglingDesigId(null);
    if (error) return showToast(error.message, "error");
    queryClient.invalidateQueries({ queryKey: [QK_DEPT_AND_DESIG] });
    showToast(
      `Designation ${!record.is_active ? "activated" : "deactivated"}.`,
      "success",
    );
  };

  const handleDeleteDesig = async (id) => {
    setDeletingDesigId(id);
    const { error } = await supabase.from("designations").delete().eq("id", id);
    setDeletingDesigId(null);
    if (error) return showToast(error.message, "error");
    queryClient.invalidateQueries({ queryKey: [QK_DEPT_AND_DESIG] });
    showToast("Designation deleted.", "success");
  };

  return (
    <div className={styles.wrapper}>
      <EditableTable
        title="Department Directory"
        subtitle="Manage organisation departments"
        rows={depts}
        isLoading={deptsLoading}
        isFetching={deptsFetching}
        nameField="department_name"
        namePlaceholder="Enter department name..."
        addingRow={addingDept}
        setAddingRow={setAddingDept}
        onAdd={handleAddDept}
        onSave={handleSaveDept}
        onToggleStatus={handleToggleDept}
        onDelete={handleDeleteDept}
        savingId={savingDeptId}
        togglingId={togglingDeptId}
        deletingId={deletingDeptId}
      />

      {/* <br /> */}

      <EditableTable
        title="Designation Directory"
        subtitle="Manage employee designations / job titles"
        rows={desigs}
        isLoading={desigsLoading}
        isFetching={desigsFetching}
        nameField="designation_name"
        namePlaceholder="Enter designation name..."
        addingRow={addingDesig}
        setAddingRow={setAddingDesig}
        onAdd={handleAddDesig}
        onSave={handleSaveDesig}
        onToggleStatus={handleToggleDesig}
        onDelete={handleDeleteDesig}
        savingId={savingDesigId}
        togglingId={togglingDesigId}
        deletingId={deletingDesigId}
      />
    </div>
  );
};

export default DeptDesignationComp;
