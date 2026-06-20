import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tooltip,
  Popconfirm,
  ConfigProvider,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import {
  QK_CORE_PILLERS,
  QK_HOME_CORE_PILLERS,
} from "../../../../config/queryKeyConfig";
import TiptapRTE from "../../../../components/layout/TiptapRTE";
import FAIconPicker from "../../../../components/common/FAIconPicker";
import { showToast } from "../../../../components/layout/CustomToast";
import styles from "./CorePillersComp.module.css";

const PAGE_SIZE = 10;

const stripHtml = (html) =>
  (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const isEmptyHtml = (html) => !stripHtml(html);

const CorePillersComp = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState("");
  const [icon, setIcon] = useState("");
  const [contentError, setContentError] = useState("");
  const [iconError, setIconError] = useState("");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QK_CORE_PILLERS, currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from("core_pillers")
        .select("id, title, content, icon, created_at", { count: "exact" })
        .order("id", { ascending: true })
        .range(from, to);

      if (error) throw new Error(error.message);
      return { rows: data ?? [], total: count ?? 0 };
    },
    keepPreviousData: true,
  });

  const resetModalState = () => {
    setContent("");
    setIcon("");
    setContentError("");
    setIconError("");
    form.resetFields();
  };

  const openCreate = () => {
    setEditingRecord(null);
    resetModalState();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setContent(record.content ?? "");
    setIcon(record.icon ?? "");
    setContentError("");
    setIconError("");
    form.setFieldsValue({ title: record.title });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
    resetModalState();
  };

  const handleSave = async () => {
    let hasError = false;

    try {
      await form.validateFields();
    } catch {
      hasError = true;
    }

    if (isEmptyHtml(content)) {
      setContentError("Please enter pillar content");
      hasError = true;
    } else {
      setContentError("");
    }

    if (!icon?.trim()) {
      setIconError("Please select an icon");
      hasError = true;
    } else {
      setIconError("");
    }

    if (hasError) return;

    const values = form.getFieldsValue();
    setSaving(true);

    try {
      const payload = {
        title: values.title?.trim() || null,
        content: content.trim() || null,
        icon: icon.trim(),
      };

      if (editingRecord) {
        const { error } = await supabase
          .from("core_pillers")
          .update(payload)
          .eq("id", editingRecord.id);
        if (error) throw error;
        showToast("Core pillar updated.", "success");
      } else {
        const { error } = await supabase.from("core_pillers").insert(payload);
        if (error) throw error;
        showToast("Core pillar created.", "success");
      }

      queryClient.invalidateQueries({ queryKey: [QK_CORE_PILLERS] });
      queryClient.invalidateQueries({ queryKey: [QK_HOME_CORE_PILLERS] });
      closeModal();
    } catch {
      showToast("Failed to save core pillar. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      const { error } = await supabase
        .from("core_pillers")
        .delete()
        .eq("id", record.id);
      if (error) throw error;
      showToast("Core pillar deleted.", "success");
      queryClient.invalidateQueries({ queryKey: [QK_CORE_PILLERS] });
      queryClient.invalidateQueries({ queryKey: [QK_HOME_CORE_PILLERS] });
    } catch {
      showToast("Failed to delete core pillar.", "error");
    }
  };

  const columns = [
    {
      title: "ICON",
      dataIndex: "icon",
      key: "icon",
      width: 70,
      render: (val) =>
        val ? (
          <div className={styles.iconCell}>
            <i className={val} />
          </div>
        ) : (
          <div className={styles.iconPlaceholder}>—</div>
        ),
    },
    {
      title: "TITLE",
      dataIndex: "title",
      key: "title",
      width: 180,
      render: (val) => <span className={styles.titleCell}>{val ?? "—"}</span>,
    },
    {
      title: "CONTENT",
      dataIndex: "content",
      key: "content",
      render: (val) => {
        const text = stripHtml(val);
        return (
          <span className={styles.cellText}>
            {text ? (text.length > 100 ? `${text.slice(0, 100)}…` : text) : "—"}
          </span>
        );
      },
    },
    {
      title: "ACTIONS",
      key: "actions",
      fixed: "right",
      width: 90,
      render: (_, record) => (
        <div className={styles.actions}>
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this pillar?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
          >
            <Tooltip title="Delete">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Core Pillars</h2>
          <p className={styles.subtitle}>
            Manage homepage core pillar cards — title, content, and icon
          </p>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data?.rows ?? []}
        rowKey="id"
        loading={isLoading || isFetching}
        size="small"
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

      <Button
        icon={<PlusOutlined />}
        className={styles.addBtn}
        onClick={openCreate}
      >
        Add New Pillar
      </Button>

      <Modal
        title={editingRecord ? "Edit Core Pillar" : "Add Core Pillar"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={closeModal}
        okText={editingRecord ? "Update" : "Create"}
        cancelText="Cancel"
        confirmLoading={saving}
        width={720}
        destroyOnHidden
        focusable={{ trap: false }}
        styles={{ body: { overflow: "visible" } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="e.g. Language Training" />
          </Form.Item>

          <div className={styles.rteField}>
            <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
              Content
            </label>
            <TiptapRTE
              key={editingRecord?.id ?? "new"}
              value={content}
              onChange={(html) => {
                setContent(html);
                if (!isEmptyHtml(html)) setContentError("");
              }}
            />
            {contentError && (
              <p className={styles.fieldError}>{contentError}</p>
            )}
          </div>

          <div>
            <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
              Icon
            </label>
            <ConfigProvider
              getPopupContainer={(node) =>
                node?.closest?.(".ant-modal-content") ??
                node?.parentElement ??
                document.body
              }
            >
              <FAIconPicker
                value={icon}
                onChange={(val) => {
                  setIcon(val);
                  setIconError("");
                }}
              >
                <button type="button" className={styles.iconPickerBtn}>
                  {icon ? (
                    <>
                      <i className={icon} />
                      <span>
                        {icon.replace("fa-solid fa-", "").replace(/-/g, " ")}
                      </span>
                    </>
                  ) : (
                    "Select icon"
                  )}
                </button>
              </FAIconPicker>
            </ConfigProvider>
            {iconError && <p className={styles.fieldError}>{iconError}</p>}
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CorePillersComp;
