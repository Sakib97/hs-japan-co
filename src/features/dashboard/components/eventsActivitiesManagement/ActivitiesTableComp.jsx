import { useState, useRef } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Tooltip,
  Popconfirm,
  Image,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { QK_ACTIVITIES } from "../../../../config/queryKeyConfig";
import { IMAGE_SIZES } from "../../../../config/imageSizeConfig";
import { uploadImage, deleteImage } from "../../../../utils/handleImage";
import { showToast } from "../../../../components/layout/CustomToast";
import styles from "./ActivitiesTableComp.module.css";

const BUCKET = "combined_page_images";
const FOLDER = "activities_page";
const MAX_SIZE = IMAGE_SIZES.ACTIVITIES_COVER.maxBytes;
const MAX_LABEL = IMAGE_SIZES.ACTIVITIES_COVER.label;

const ActivitiesTableComp = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [QK_ACTIVITIES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities_page")
        .select(
          "id, activity_title, cover_url, activity_desc, activity_date, created_at",
        )
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const openCreate = () => {
    setEditingRecord(null);
    setCoverFile(null);
    setCoverPreview(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setCoverFile(null);
    setCoverPreview(record.cover_url ?? null);
    form.setFieldsValue({
      activity_title: record.activity_title,
      activity_desc: record.activity_desc,
      activity_date: record.activity_date
        ? dayjs(record.activity_date, "YYYY-MM-DD")
        : null,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
    setCoverFile(null);
    setCoverPreview(null);
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
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
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
      let cover_url = editingRecord?.cover_url ?? null;

      if (coverFile) {
        setUploading(true);
        if (cover_url) {
          await deleteImage(cover_url, BUCKET);
        }
        cover_url = await uploadImage(coverFile, BUCKET, FOLDER);
        setUploading(false);
      }

      const payload = {
        activity_title: values.activity_title?.trim() || null,
        activity_desc: values.activity_desc?.trim() || null,
        activity_date: values.activity_date
          ? values.activity_date.format("YYYY-MM-DD")
          : null,
        cover_url,
      };

      if (editingRecord) {
        const { error } = await supabase
          .from("activities_page")
          .update(payload)
          .eq("id", editingRecord.id);
        if (error) throw error;
        showToast("Activity updated.", "success");
      } else {
        const { error } = await supabase
          .from("activities_page")
          .insert(payload);
        if (error) throw error;
        showToast("Activity created.", "success");
      }

      queryClient.invalidateQueries({ queryKey: [QK_ACTIVITIES] });
      closeModal();
    } catch {
      showToast("Failed to save activity. Please try again.", "error");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      if (record.cover_url) {
        await deleteImage(record.cover_url, BUCKET);
      }
      const { error } = await supabase
        .from("activities_page")
        .delete()
        .eq("id", record.id);
      if (error) throw error;
      showToast("Activity deleted.", "success");
      queryClient.invalidateQueries({ queryKey: [QK_ACTIVITIES] });
    } catch {
      showToast("Failed to delete activity.", "error");
    }
  };

  const columns = [
    {
      title: "COVER",
      key: "cover_url",
      width: 70,
      render: (_, record) =>
        record.cover_url ? (
          <Image
            src={record.cover_url}
            width={48}
            height={48}
            style={{ objectFit: "cover", borderRadius: 6 }}
            preview={{ mask: false }}
          />
        ) : (
          <div className={styles.noImage}>—</div>
        ),
    },
    {
      title: "TITLE",
      dataIndex: "activity_title",
      key: "activity_title",
      render: (val) => <span className={styles.cellText}>{val ?? "—"}</span>,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "activity_desc",
      key: "activity_desc",
      render: (val) => (
        <span className={styles.cellText}>
          {val ? (val.length > 80 ? val.slice(0, 80) + "…" : val) : "—"}
        </span>
      ),
    },
    {
      title: "DATE",
      dataIndex: "activity_date",
      key: "activity_date",
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
            title="Delete this activity?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
          >
            <Tooltip title="Delete">
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
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
          <h2 className={styles.title}>Activities</h2>
          <p className={styles.subtitle}>
            Manage school activities and programmes
          </p>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data ?? []}
        rowKey="id"
        loading={isLoading}
        size="small"
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10, showTotal: (t) => `${t} records` }}
        className={styles.table}
      />

      <Button
        icon={<PlusOutlined />}
        className={styles.addBtn}
        onClick={openCreate}
      >
        Add New Activity
      </Button>

      <Modal
        title={editingRecord ? "Edit Activity" : "Add New Activity"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={closeModal}
        okText={editingRecord ? "Update" : "Create"}
        cancelText="Cancel"
        confirmLoading={saving || uploading}
        width={520}
      >
        <div className={styles.coverUploadArea}>
          {coverPreview ? (
            <div className={styles.coverWrapper}>
              <img
                src={coverPreview}
                className={styles.coverPreview}
                alt="cover"
                onClick={() => fileInputRef.current.click()}
              />
              <button
                className={styles.coverRemoveBtn}
                onClick={() => {
                  setCoverFile(null);
                  setCoverPreview(null);
                }}
                title="Remove image"
                type="button"
              >
                ×
              </button>
            </div>
          ) : (
            <div
              className={styles.galleryTileAdd}
              onClick={() => fileInputRef.current.click()}
            >
              <PlusOutlined />
            </div>
          )}

          <span className={styles.sizeHint}>
            Upload Cover Image: Max {MAX_LABEL} &nbsp;·&nbsp; Recommended: 800 ×
            450 px
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
            name="activity_title"
            label="Activity Title"
            rules={[
              { required: true, message: "Please enter the activity title" },
            ]}
          >
            <Input placeholder="e.g. Cultural Day" />
          </Form.Item>
          <Form.Item name="activity_date" label="Date">
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              placeholder="Select date"
            />
          </Form.Item>
          <Form.Item name="activity_desc" label="Description">
            <Input.TextArea
              rows={3}
              placeholder="Brief description of the activity..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ActivitiesTableComp;
