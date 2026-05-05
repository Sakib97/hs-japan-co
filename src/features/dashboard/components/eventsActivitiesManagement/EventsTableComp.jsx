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
  TimePicker,
  Tooltip,
  Popconfirm,
  Image,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { QK_EVENTS } from "../../../../config/queryKeyConfig";
import { IMAGE_SIZES } from "../../../../config/imageSizeConfig";
import { uploadImage, deleteImage } from "../../../../utils/handleImage";
import { showToast } from "../../../../components/layout/CustomToast";
import styles from "./EventsTableComp.module.css";

const BUCKET = "combined_page_images";
const FOLDER = "events_page";
const MAX_SIZE = IMAGE_SIZES.EVENTS_COVER.maxBytes;
const MAX_LABEL = IMAGE_SIZES.EVENTS_COVER.label;

const EventsTableComp = () => {
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
    queryKey: [QK_EVENTS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events_page")
        .select(
          "id, event_title, cover_url, event_date, event_time, event_place, event_speaker, created_at",
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
      event_title: record.event_title,
      event_date: record.event_date
        ? dayjs(record.event_date, "YYYY-MM-DD")
        : null,
      event_time: record.event_time
        ? dayjs(record.event_time, "hh:mm A")
        : null,
      event_place: record.event_place,
      event_speaker: record.event_speaker,
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
        event_title: values.event_title?.trim() || null,
        event_date: values.event_date
          ? values.event_date.format("YYYY-MM-DD")
          : null,
        event_time: values.event_time
          ? values.event_time.format("hh:mm A")
          : null,
        event_place: values.event_place?.trim() || null,
        event_speaker: values.event_speaker?.trim() || null,
        cover_url,
      };

      if (editingRecord) {
        const { error } = await supabase
          .from("events_page")
          .update(payload)
          .eq("id", editingRecord.id);
        if (error) throw error;
        showToast("Event updated.", "success");
      } else {
        const { error } = await supabase.from("events_page").insert(payload);
        if (error) throw error;
        showToast("Event created.", "success");
      }

      queryClient.invalidateQueries({ queryKey: [QK_EVENTS] });
      closeModal();
    } catch {
      showToast("Failed to save event. Please try again.", "error");
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
        .from("events_page")
        .delete()
        .eq("id", record.id);
      if (error) throw error;
      showToast("Event deleted.", "success");
      queryClient.invalidateQueries({ queryKey: [QK_EVENTS] });
    } catch {
      showToast("Failed to delete event.", "error");
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
      dataIndex: "event_title",
      key: "event_title",
      render: (val) => <span className={styles.cellText}>{val ?? "—"}</span>,
    },
    {
      title: "DATE",
      dataIndex: "event_date",
      key: "event_date",
      render: (val) => <span className={styles.cellText}>{val ?? "—"}</span>,
    },
    {
      title: "TIME",
      dataIndex: "event_time",
      key: "event_time",
      render: (val) => <span className={styles.cellText}>{val ?? "—"}</span>,
    },
    {
      title: "PLACE",
      dataIndex: "event_place",
      key: "event_place",
      render: (val) => <span className={styles.cellText}>{val ?? "—"}</span>,
    },
    {
      title: "SPEAKER",
      dataIndex: "event_speaker",
      key: "event_speaker",
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
            title="Delete this event?"
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
          <h2 className={styles.title}>Events</h2>
          <p className={styles.subtitle}>Manage upcoming and past events</p>
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
        Add New Event
      </Button>

      <Modal
        title={editingRecord ? "Edit Event" : "Add New Event"}
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
            // style={{ display: "none" }}
            className={styles.hiddenInput}
            onChange={handleFileChange}
          />
        </div>

        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="event_title"
            label="Event Title"
            rules={[
              { required: true, message: "Please enter the event title" },
            ]}
          >
            <Input placeholder="e.g. Japanese Language Seminar" />
          </Form.Item>
          <div className={styles.formRow}>
            <Form.Item name="event_date" label="Date" style={{ flex: 1 }}>
              <DatePicker
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                placeholder="Select date"
              />
            </Form.Item>
            <Form.Item name="event_time" label="Time" style={{ flex: 1 }}>
              <TimePicker
                format="hh:mm A"
                use12Hours
                style={{ width: "100%" }}
                placeholder="Select time"
              />
            </Form.Item>
          </div>
          <Form.Item name="event_place" label="Place">
            <Input placeholder="e.g. Main Hall, Dhaka" />
          </Form.Item>
          <Form.Item name="event_speaker" label="Speaker">
            <Input placeholder="e.g. Dr. Tanaka" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EventsTableComp;
