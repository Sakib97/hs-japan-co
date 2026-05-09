import React, { useState, useContext, useMemo, useEffect } from "react";
import { Form, Input, Popconfirm, Table, Tooltip } from "antd";
import {
  HolderOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PlusOutlined,
  LoadingOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { showToast } from "../../../../components/layout/CustomToast";
import { uploadImage, deleteImage } from "../../../../utils/handleImage";
import styles from "../../styles/TeamStaffPanel.module.css";
import { IMAGE_SIZES } from "../../../../config/imageSizeConfig";
import { QK_TEAM_PAGE_MEMBERS } from "../../../../config/queryKeyConfig";

const PAGE_SIZE = 10;
const MAX_MEMBERS = 30; // Maximum members allowed on the team page as per requirements
const MAX_FILE_SIZE = IMAGE_SIZES.TEAM_STAFF.maxBytes;

const RowContext = React.createContext({});

const DraggableRow = ({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging
      ? { position: "relative", zIndex: 9999, background: "#f9fafb" }
      : {}),
  };

  const ctx = useMemo(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );

  return (
    <RowContext.Provider value={ctx}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes}>
        {children}
      </tr>
    </RowContext.Provider>
  );
};

const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <button
      ref={setActivatorNodeRef}
      {...listeners}
      className={styles.dragHandle}
      style={{ cursor: "move" }}
      title="Drag to reorder"
    >
      <HolderOutlined />
    </button>
  );
};

const TeamStaffPanel = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [allMembers, setAllMembers] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingKey, setDeletingKey] = useState(null);
  const [reordering, setReordering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: dbData = [], isLoading } = useQuery({
    queryKey: [QK_TEAM_PAGE_MEMBERS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_page")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data.map((d) => ({ ...d, key: String(d.id) }));
    },
  });

  useEffect(() => {
    setAllMembers(dbData);
  }, [dbData]);

  const newRow = allMembers.find((m) => m.isNew);
  const savedMembers = allMembers.filter((m) => !m.isNew);
  const paginatedSaved = savedMembers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const visibleRows =
    newRow && editingKey === newRow.key
      ? [...paginatedSaved, newRow]
      : paginatedSaved;

  const isEditing = (record) => record.key === editingKey;

  /* ─── Edit / Cancel ───────────────────────────────────────────────────────── */
  const edit = (record) => {
    form.setFieldsValue({
      member_name: record.member_name,
      member_designation: record.member_designation,
    });
    setSelectedFile(null);
    setPreviewUrl(record.member_image_url || null);
    setEditingKey(record.key);
  };

  const cancel = () => {
    if (allMembers.find((m) => m.key === editingKey)?.isNew) {
      setAllMembers((prev) => prev.filter((m) => m.key !== editingKey));
    }
    setEditingKey("");
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  /* ─── Save ──────────────────────────────────────────────────────────────── */
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const record = allMembers.find((m) => m.key === key);
      setSaving(true);

      let imageUrl = record.member_image_url;
      let imageSize = record.image_size || 0;

      if (selectedFile) {
        // Validate file type and size
        if (!selectedFile.type.startsWith("image/")) {
          showToast("Selected file must be an image.", "error");
          return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
          showToast(
            `Image must be under ${IMAGE_SIZES.TEAM_STAFF.label}`,
            "error",
          );
          return;
        }
        imageUrl = await uploadImage(
          selectedFile,
          "team_page_pics",
          "team_pics",
        );
        imageSize = selectedFile.size;
      } else if (record.isNew) {
        showToast("Profile image is required", "error");
        return;
      }

      if (record.isNew) {
        const { error } = await supabase.from("team_page").insert({
          member_name: row.member_name,
          member_designation: row.member_designation,
          member_image_url: imageUrl,
          image_size: imageSize,
          display_order: savedMembers.length,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("team_page")
          .update({
            member_name: row.member_name,
            member_designation: row.member_designation,
            member_image_url: imageUrl,
            image_size: imageSize,
          })
          .eq("id", record.id);
        if (error) throw error;
      }

      showToast("Saved successfully!", "success");
      setEditingKey("");
      setSelectedFile(null);
      setPreviewUrl(null);
      await queryClient.invalidateQueries({ queryKey: [QK_TEAM_PAGE_MEMBERS] });
    } catch (err) {
      if (!err.errorFields) showToast(err.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record) => {
    setDeletingKey(record.key);
    try {
      await deleteImage(record.member_image_url, "team_page_pics", {
        table: "team_page",
        column: "id",
        value: record.id,
      });
      await queryClient.invalidateQueries({ queryKey: [QK_TEAM_PAGE_MEMBERS] });
      showToast("Member deleted", "success");
    } catch (err) {
      showToast(err.message || "Failed to delete", "error");
    } finally {
      setDeletingKey(null);
    }
  };

  const handleAdd = () => {
    if (savedMembers.length >= MAX_MEMBERS) {
      showToast(`Maximum ${MAX_MEMBERS} staff members allowed.`, "error");
      return;
    }
    const newKey = `new-${Date.now()}`;
    setAllMembers((prev) => [
      ...prev,
      {
        key: newKey,
        id: newKey,
        member_name: "",
        member_designation: "",
        member_image_url: "",
        image_size: 0,
        isNew: true,
      },
    ]);
    form.setFieldsValue({ member_name: "", member_designation: "" });
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingKey(newKey);
    setCurrentPage(Math.ceil((savedMembers.length + 1) / PAGE_SIZE));
  };

  /*  Drag end (reorder within visible page)*/
  const onDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const activeIdx = paginatedSaved.findIndex(
      (m) => m.key === String(active.id),
    );
    const overIdx = paginatedSaved.findIndex((m) => m.key === String(over.id));
    if (activeIdx === -1 || overIdx === -1) return;

    const newVisible = arrayMove(paginatedSaved, activeIdx, overIdx);
    const before = savedMembers.slice(0, (currentPage - 1) * PAGE_SIZE);
    const after = savedMembers.slice(currentPage * PAGE_SIZE);
    const newSaved = [...before, ...newVisible, ...after];
    setAllMembers(newRow ? [...newSaved, newRow] : newSaved);

    setReordering(true);
    try {
      await Promise.all(
        newSaved.map((item, idx) =>
          supabase
            .from("team_page")
            .update({ display_order: idx })
            .eq("id", item.id),
        ),
      );
      await queryClient.invalidateQueries({ queryKey: [QK_TEAM_PAGE_MEMBERS] });
      showToast("Order updated!", "success");
    } catch (e) {
      console.error("Order sync failed:", e);
      showToast("Failed to save order", "error");
    } finally {
      setReordering(false);
    }
  };

  /* ─── Column definitions ────────────────────────────────────────────────── */
  const columns = [
    {
      title: "Profile Image",
      dataIndex: "member_image_url",
      width: 110,
      render: (_, record) => {
        if (isEditing(record)) {
          return (
            <label className={styles.imageUpload}>
              {previewUrl ? (
                <img src={previewUrl} alt="" className={styles.avatarImg} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <UserOutlined />
                </div>
              )}
              <span className={styles.imageEditOverlay}>
                <EditOutlined />
              </span>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    if (!f.type.startsWith("image/")) {
                      showToast("Selected file must be an image.", "error");
                      return;
                    }
                    if (f.size > MAX_FILE_SIZE) {
                      showToast(
                        `Image must be under ${MAX_FILE_SIZE / 1024} KB`,
                        "error",
                      );
                      return;
                    }
                    setSelectedFile(f);
                    setPreviewUrl(URL.createObjectURL(f));
                  }
                }}
              />
            </label>
          );
        }
        return record.member_image_url ? (
          <img
            src={record.member_image_url}
            alt=""
            className={styles.avatarImg}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <UserOutlined />
          </div>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "member_name",
      render: (_, record) =>
        isEditing(record) ? (
          <Form.Item
            name="member_name"
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Name required" }]}
          >
            <Input placeholder="Enter Full Name... *" />
          </Form.Item>
        ) : (
          <span className={styles.cellText}>{record.member_name}</span>
        ),
    },
    {
      title: "Designation",
      dataIndex: "member_designation",
      render: (_, record) =>
        isEditing(record) ? (
          <Form.Item
            name="member_designation"
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Designation required" }]}
          >
            <Input placeholder="Enter Job Title... *" />
          </Form.Item>
        ) : (
          <span className={styles.cellText}>{record.member_designation}</span>
        ),
    },
    {
      title: "Actions",
      dataIndex: "operation",
      width: 110,
      // fixed: "right",
      render: (_, record) => {
        if (isEditing(record)) {
          return (
            <div className={styles.actionGroup}>
              <button
                className={styles.saveBtn}
                onClick={() => save(record.key)}
                disabled={saving}
              >
                {saving ? (
                  <LoadingOutlined spin />
                ) : (
                  <>
                    <CheckOutlined /> Save
                  </>
                )}
              </button>
              <button
                className={styles.cancelBtn}
                onClick={cancel}
                disabled={saving}
                cursor={saving ? "not-allowed" : "pointer"}
              >
                Cancel
              </button>
            </div>
          );
        }
        return (
          <div className={styles.actionGroup}>
            <Tooltip title="Edit">
              <button
                className={styles.iconBtn}
                onClick={() => edit(record)}
                disabled={!!editingKey}
              >
                <EditOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Delete this member?"
                onConfirm={() => handleDelete(record)}
                okText="Delete"
                okButtonProps={{ danger: true }}
                cancelText="Cancel"
                disabled={!!editingKey}
              >
                <button
                  className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                  disabled={!!editingKey || deletingKey === record.key}
                >
                  {deletingKey === record.key ? (
                    <LoadingOutlined spin />
                  ) : (
                    <DeleteOutlined />
                  )}
                </button>
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Order",
      key: "sort",
      width: 80,
      // align: "center",
      fixed: "right",
      render: (_, record, index) => {
        if (record.isNew) return null;
        const orderNum = (currentPage - 1) * PAGE_SIZE + index + 1;
        return (
          <div className={styles.orderCell}>
            <span className={styles.orderBadge}>
              {String(orderNum).padStart(2, "0")}
            </span>
            <DragHandle />
          </div>
        );
      },
    },
  ];

  return (
    <section className={styles.section}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Team Staff</h2>
          <p className={styles.sectionSubtitle}>
            Manage the images, names, and designations of team members shown on
            the site.
          </p>
          <p style={{ fontWeight: "bold", color: "#666" }}>
            Maximum image size: {IMAGE_SIZES.TEAM_STAFF.label}. Supported
            formats: JPG, PNG, JPEG.
            <br />
            Recommended dimensions: 400x400 pixels for best display. Atmost{" "}
            {MAX_MEMBERS} members can be added.
          </p>
        </div>
      </div>

      {/* Table */}
      <Form form={form} component={false}>
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            items={paginatedSaved.map((m) => m.key)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{ body: { row: DraggableRow } }}
              rowKey="key"
              dataSource={visibleRows}
              columns={columns}
              pagination={{
                current: currentPage,
                pageSize: PAGE_SIZE,
                total: savedMembers.length,
                onChange: (page) => setCurrentPage(page),
                showSizeChanger: false,
                showTotal: (t) => `${t} members`,
              }}
              loading={isLoading || reordering}
              bordered
              rowClassName={(record) =>
                isEditing(record) ? styles.tableRowEditing : ""
              }
              scroll={{ x: "max-content" }}
            />
          </SortableContext>
        </DndContext>
      </Form>

      {/* Footer */}
      <div className={styles.tableFooter}>
        <span className={styles.footerInfo}>
          Showing {Math.min(paginatedSaved.length, PAGE_SIZE)} of{" "}
          {savedMembers.length} registered staff members
        </span>
        <div className={styles.footerRight}>
          <button
            className={styles.addBtn}
            onClick={handleAdd}
            disabled={!!editingKey || savedMembers.length >= MAX_MEMBERS}
          >
            <PlusOutlined /> Add New Staff Member
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamStaffPanel;
