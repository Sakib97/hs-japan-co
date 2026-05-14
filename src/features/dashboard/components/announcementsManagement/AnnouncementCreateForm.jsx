import { useEffect, useRef, useState } from "react";
import { Alert, Button, Input, DatePicker } from "antd";
import dayjs from "dayjs";
import { SendOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { uploadImage } from "../../../../utils/handleImage";
import { showToast } from "../../../../components/layout/CustomToast";
import { useAuth } from "../../../../context/AuthProvider";
import { QK_ANNOUNCEMENTS } from "../../../../config/queryKeyConfig";
import styles from "./AnnouncementCreateForm.module.css";
import { IMAGE_SIZES } from "../../../../config/imageSizeConfig";

const BUCKET = "combined_page_images";
const FOLDER = "announcements";
const BANNER_LIMIT = 5;
const MAX_BYTES = IMAGE_SIZES.ANNOUNCEMENT_BANNER.maxBytes;
const ACCEPTED = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];

const empty = () => ({
  bannerFile: null,
  bannerPreview: null,
  redirectUrl: "",
  startDate: "",
  endDate: "",
});

const AnnouncementCreateForm = ({ editingRecord, onEditComplete }) => {
  const { userMeta } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);
  const cardRef = useRef(null);

  const [form, setForm] = useState(
    editingRecord
      ? {
          bannerFile: null,
          bannerPreview: editingRecord.banner_url ?? null,
          redirectUrl: editingRecord.redirect_url ?? "",
          startDate: editingRecord.start_date ?? "",
          endDate: editingRecord.end_date ?? "",
        }
      : empty(),
  );

  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(
    editingRecord?.created_at ?? null,
  );

  const { data: announcementCount = 0 } = useQuery({
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
    select: (data) => data.length,
  });

  const isLimitReached = !editingRecord && announcementCount >= BANNER_LIMIT;

  const editToastShown = useRef(false);
  useEffect(() => {
    if (editingRecord && !editToastShown.current) {
      editToastShown.current = true;
      //   showToast("Content loaded for edit.", "info");
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editingRecord]);

  const handleFile = (file) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      showToast("Please upload a PNG, JPG, or SVG file.", "error");
      return;
    }
    if (file.size > MAX_BYTES) {
      showToast(
        `File must be smaller than ${IMAGE_SIZES.ANNOUNCEMENT_BANNER.label}.`,
        "error",
      );
      return;
    }
    setForm((p) => ({
      ...p,
      bannerFile: file,
      bannerPreview: URL.createObjectURL(file),
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const isPublishDisabled = !form.bannerPreview || isLimitReached;

  const handleSubmit = async () => {
    if (!form.bannerPreview) {
      showToast("Please upload a banner image.", "error");
      return;
    }
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      showToast("Start date must be before end date.", "error");
      return;
    }

    setSubmitting(true);
    try {
      let bannerUrl = editingRecord?.banner_url ?? null;
      let imageSize = editingRecord?.image_size ?? null;

      if (form.bannerFile) {
        setUploading(true);
        bannerUrl = await uploadImage(form.bannerFile, BUCKET, FOLDER);
        imageSize = String(form.bannerFile.size);
        setUploading(false);
      }

      const payload = {
        banner_url: bannerUrl,
        image_size: imageSize,
        redirect_url: form.redirectUrl.trim() || null,
        start_date: form.startDate || null,
        end_date: form.endDate || null,
        is_active: true,
        created_by: userMeta?.email ?? null,
      };

      if (editingRecord) {
        const { error } = await supabase
          .from("announcements")
          .update(payload)
          .eq("id", editingRecord.id);
        if (error) throw error;
        showToast("Announcement updated!", "success");
        onEditComplete?.();
      } else {
        const cached = queryClient.getQueryData([QK_ANNOUNCEMENTS]) ?? [];
        const maxOrder =
          cached.length > 0 ? Math.max(...cached.map((r) => r.order ?? 0)) : 0;
        const { error } = await supabase
          .from("announcements")
          .insert({ ...payload, order: maxOrder + 1 });
        if (error) throw error;
        showToast("Announcement published!", "success");
        setForm(empty());
        setLastUpdated(new Date().toISOString());
      }

      queryClient.invalidateQueries({ queryKey: [QK_ANNOUNCEMENTS] });
    } catch (err) {
      showToast(err.message || "Failed to publish announcement.", "error");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className={styles.card} ref={cardRef}>
      {/* ── Header ── */}
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <i className="fi fi-rr-megaphone"></i>
          <span>
            {editingRecord ? "Edit Announcement" : "Upload Wide Banner"}
          </span>
        </div>
        {!editingRecord && (
          <span className={styles.slotInfo}>
            {announcementCount} / {BANNER_LIMIT} slots used
          </span>
        )}
      </div>

      {/* ── Limit warning ── */}
      {isLimitReached && (
        <Alert
          type="warning"
          showIcon
          message={`Banner limit reached (${BANNER_LIMIT}/${BANNER_LIMIT}). Please delete an existing announcement before publishing a new one.`}
          className={styles.limitAlert}
        />
      )}

      {/* ── Drop zone ── */}
      <div
        ref={dropRef}
        className={`${styles.dropZone} ${dragging ? styles.dropZoneDragging : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {form.bannerPreview ? (
          <img
            src={form.bannerPreview}
            alt="Banner preview"
            className={styles.bannerPreview}
          />
        ) : (
          <>
            <i className={`fi fi-rr-cloud-upload-alt ${styles.uploadIcon}`}></i>
            <p className={styles.dropTitle}>
              Drop your wide-format banner here *
            </p>
            <p className={styles.dropSub}>
              Optimized for 1200 × 400px aspect ratio. Supporting
              high-resolution PNG, JPG, or SVG assets.
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/svg+xml"
          style={{ display: "none" }}
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {/* ── Redirect link ── */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Redirect Link (optional)</label>
        <Input
          placeholder="/courses, /events etc."
          value={form.redirectUrl}
          onChange={(e) =>
            setForm((p) => ({ ...p, redirectUrl: e.target.value }))
          }
          className={styles.input}
        />
      </div>

      {/* ── Date row ── */}
      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Starting From (optional)</label>
          <DatePicker
            style={{ width: "100%" }}
            value={form.startDate ? dayjs(form.startDate) : null}
            onChange={(date) =>
              setForm((p) => ({
                ...p,
                startDate: date ? date.format("YYYY-MM-DD") : "",
              }))
            }
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Ending At (optional)</label>
          <DatePicker
            style={{ width: "100%" }}
            value={form.endDate ? dayjs(form.endDate) : null}
            onChange={(date) =>
              setForm((p) => ({
                ...p,
                endDate: date ? date.format("YYYY-MM-DD") : "",
              }))
            }
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <div className={styles.formFooter}>
        <div className={styles.footerLeft}>
          <span className={styles.hint}>
            <CheckCircleOutlined /> Max Size{" "}
            {IMAGE_SIZES.ANNOUNCEMENT_BANNER.label}
          </span>
        </div>
        <div className={styles.footerRight}>
          {/* {lastUpdated && (
            <span className={styles.lastUpdated}>
              Last updated by <strong>{userMeta?.name ?? "Admin"}</strong>{" "}
              &bull; {new Date(lastUpdated).toLocaleString()}
            </span>
          )} */}
          {editingRecord && (
            <Button onClick={onEditComplete} disabled={submitting}>
              Cancel
            </Button>
          )}
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={submitting}
            disabled={isPublishDisabled}
            className={`${styles.publishBtn} ${isPublishDisabled ? styles.publishBtnDisabled : ""}`}
            onClick={handleSubmit}
          >
            {uploading ? "Uploading..." : editingRecord ? "Update" : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCreateForm;
