import { useState, useRef } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tooltip,
  Popconfirm,
  Image,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import {
  QK_SUCCESS_STORIES,
  QK_HOME_SUCCESS_STORIES,
} from "../../../../config/queryKeyConfig";
import { IMAGE_SIZES } from "../../../../config/imageSizeConfig";
import { uploadImage, deleteImage } from "../../../../utils/handleImage";
import { showToast } from "../../../../components/layout/CustomToast";
import styles from "./SuccessStoriesComp.module.css";

const BUCKET = "combined_page_images";
const FOLDER = "success_stories";
const MAX_SIZE = IMAGE_SIZES.SUCCESS_STORY_AVATAR.maxBytes;
const MAX_LABEL = IMAGE_SIZES.SUCCESS_STORY_AVATAR.label;
const PAGE_SIZE = 10;

const SuccessStoriesComp = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QK_SUCCESS_STORIES, currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from("success_stories")
        .select(
          "id, student_name, student_profession, student_image_url, student_image_size, content, created_at",
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw new Error(error.message);
      return { rows: data ?? [], total: count ?? 0 };
    },
    keepPreviousData: true,
  });

  const openCreate = () => {
    setEditingRecord(null);
    setAvatarFile(null);
    setAvatarPreview(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setAvatarFile(null);
    setAvatarPreview(record.student_image_url ?? null);
    form.setFieldsValue({
      student_name: record.student_name,
      student_profession: record.student_profession,
      content: record.content,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
    setAvatarFile(null);
    setAvatarPreview(null);
    form.resetFields();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Invalid file type. Please upload an image.", "error");
      return;
    }
    if (file.size > MAX_SIZE) {
      showToast(`Image too large. Max allowed: ${MAX_LABEL}.`, "error");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
    } catch {
      return;
    }
    const values = form.getFieldsValue();
    setSaving(true);
    try {
      let student_image_url = editingRecord?.student_image_url ?? null;
      let student_image_size = editingRecord?.student_image_size ?? null;

      if (avatarFile) {
        if (student_image_url) {
          await deleteImage(student_image_url, BUCKET);
        }
        student_image_url = await uploadImage(avatarFile, BUCKET, FOLDER);
        student_image_size = avatarFile.size;
      }

      const payload = {
        student_name: values.student_name?.trim() || null,
        student_profession: values.student_profession?.trim() || null,
        content: values.content?.trim() || null,
        student_image_url,
        student_image_size,
      };

      if (editingRecord) {
        const { error } = await supabase
          .from("success_stories")
          .update(payload)
          .eq("id", editingRecord.id);
        if (error) throw error;
        showToast("Story updated.", "success");
      } else {
        const { error } = await supabase
          .from("success_stories")
          .insert(payload);
        if (error) throw error;
        showToast("Story created.", "success");
      }

      queryClient.invalidateQueries({ queryKey: [QK_SUCCESS_STORIES] });
      queryClient.invalidateQueries({ queryKey: [QK_HOME_SUCCESS_STORIES] });
      closeModal();
    } catch {
      showToast("Failed to save story. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      if (record.student_image_url) {
        await deleteImage(record.student_image_url, BUCKET);
      }
      const { error } = await supabase
        .from("success_stories")
        .delete()
        .eq("id", record.id);
      if (error) throw error;
      showToast("Story deleted.", "success");
      queryClient.invalidateQueries({ queryKey: [QK_SUCCESS_STORIES] });
      queryClient.invalidateQueries({ queryKey: [QK_HOME_SUCCESS_STORIES] });
    } catch {
      showToast("Failed to delete story.", "error");
    }
  };

  const columns = [
    {
      title: "AVATAR",
      key: "student_image_url",
      width: 70,
      render: (_, record) =>
        record.student_image_url ? (
          <Image
            src={record.student_image_url}
            width={48}
            height={48}
            style={{ objectFit: "cover", borderRadius: "50%" }}
            preview={{ mask: false }}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {(record.student_name?.[0] ?? "?").toUpperCase()}
          </div>
        ),
    },
    {
      title: "STUDENT NAME",
      dataIndex: "student_name",
      key: "student_name",
      width: 160,
      render: (val) => <span className={styles.nameCell}>{val ?? "—"}</span>,
    },
    {
      title: "STORY CONTENT",
      dataIndex: "content",
      key: "content",
      render: (val) => (
        <span className={styles.cellText}>
          {val ? (val.length > 100 ? val.slice(0, 100) + "…" : val) : "—"}
        </span>
      ),
    },
    {
      title: "PROFESSION",
      dataIndex: "student_profession",
      key: "student_profession",
      width: 180,
      render: (val) => <span className={styles.cellText}>{val ?? "—"}</span>,
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
            title="Delete this story?"
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
          <h2 className={styles.title}>Success Stories</h2>
          <p className={styles.subtitle}>
            Manage student success stories and testimonials
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
        className={styles.table}
      />

      <Button
        icon={<PlusOutlined />}
        className={styles.addBtn}
        onClick={openCreate}
      >
        Add New Story
      </Button>

      <Modal
        title={editingRecord ? "Edit Story" : "Add New Story"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={closeModal}
        okText={editingRecord ? "Update" : "Create"}
        cancelText="Cancel"
        confirmLoading={saving}
        width={520}
        destroyOnHidden
      >
        {/* Avatar upload */}
        <div className={styles.avatarUploadArea}>
          {avatarPreview ? (
            <div className={styles.avatarWrapper}>
              <img
                src={avatarPreview}
                className={styles.avatarPreview}
                alt="avatar"
                onClick={() => fileInputRef.current.click()}
              />
              <button
                className={styles.avatarRemoveBtn}
                onClick={() => {
                  setAvatarFile(null);
                  setAvatarPreview(null);
                }}
                title="Remove image"
                type="button"
              >
                <span>×</span>
              </button>
            </div>
          ) : (
            <div
              className={styles.avatarUploadBox}
              onClick={() => fileInputRef.current.click()}
            >
              <PlusOutlined className={styles.uploadIcon} />
              <span>Photo</span>
            </div>
          )}
          <span className={styles.sizeHint}>
            Student avatar · Max {MAX_LABEL} · Recommended: 200 × 200 px
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="student_name"
            label="Student Name"
            rules={[
              { required: true, message: "Please enter the student name" },
            ]}
          >
            <Input placeholder="e.g. Rakib Hossain" />
          </Form.Item>
          <Form.Item name="student_profession" label="Profession / Role">
            <Input placeholder="e.g. Software Engineer, Osaka" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Story Content"
            rules={[
              { required: true, message: "Please enter the story content" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Write the success story..."
              maxLength={1000}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SuccessStoriesComp;
