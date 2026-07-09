import { useState, useRef } from "react";
import {
  DatabaseOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import styles from "../../styles/AssetsManagement.module.css";
import { showToast } from "../../../../components/layout/CustomToast";
import { supabase } from "../../../../config/supabaseClient";
import { fetchHomepageCarouselSlides } from "../../../../utils/homepageCarousel";
import { uploadImage, deleteImage } from "../../../../utils/handleImage";
import { Modal, Spin } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IMAGE_SIZES } from "../../../../config/imageSizeConfig";
import { QK_HOMEPAGE_CAROUSEL } from "../../../../config/queryKeyConfig";

const MAX_FILE_SIZE = IMAGE_SIZES.HOMEPAGE_CAROUSEL.maxBytes;

const HomepagePanel = () => {
  const queryClient = useQueryClient();
  const carouselInput = useRef();
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [reordering, setReordering] = useState(false);
  const [dragOverId, setDragOverId] = useState(null);
  const dragId = useRef(null);

  const {
    data: slides = [],
    isLoading: fetching,
    isError,
  } = useQuery({
    queryKey: [QK_HOMEPAGE_CAROUSEL],
    queryFn: fetchHomepageCarouselSlides,
  });

  const addSlide = async (e) => {
    if (slides.length >= 5) {
      showToast("Maximum of 5 slides allowed.", "error");
      return;
    }

    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Invalid file type. Please upload an image file.", "error");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showToast(
        `File too large. Maximum allowed size is ${IMAGE_SIZES.HOMEPAGE_CAROUSEL.label}.`,
        "error",
      );
      return;
    }
    setUploading(true);
    try {
      const publicUrl = await uploadImage(file, "home_page_images", "carousel");

      const { error: dbError } = await supabase.from("home_page").insert({
        image_link: publicUrl,
        image_section: "homepage_carousel",
        image_size: file.size,
        image_order: slides.length,
      });

      if (dbError) throw new Error(dbError.message);

      queryClient.invalidateQueries({ queryKey: [QK_HOMEPAGE_CAROUSEL] });
      showToast("Slide uploaded successfully!", "success");
    } catch {
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  const removeSlide = async (slide) => {
    setDeletingId(slide.id);
    try {
      await deleteImage(slide.url, "home_page_images", {
        table: "home_page",
        column: "image_link",
        value: slide.url,
      });
      queryClient.invalidateQueries({ queryKey: [QK_HOMEPAGE_CAROUSEL] });
      showToast("Slide deleted successfully!", "success");
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete slide. Please try again.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDragStart = (e, id) => {
    dragId.current = id;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(id);
  };

  const handleDragLeave = () => setDragOverId(null);

  const handleDrop = async (e, targetId) => {
    e.preventDefault();
    setDragOverId(null);
    if (!dragId.current || dragId.current === targetId) return;

    const fromIdx = slides.findIndex((s) => s.id === dragId.current);
    const toIdx = slides.findIndex((s) => s.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    const reordered = [...slides];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    setReordering(true);
    try {
      await Promise.all(
        reordered.map((s, idx) =>
          supabase
            .from("home_page")
            .update({ image_order: idx })
            .eq("id", s.id),
        ),
      );
      queryClient.invalidateQueries({ queryKey: [QK_HOMEPAGE_CAROUSEL] });
    } catch (err) {
      console.error("Reorder error:", err);
      showToast("Failed to update order. Please try again.", "error");
    } finally {
      setReordering(false);
      dragId.current = null;
    }
  };

  const confirmRemoveSlide = (slide) => {
    Modal.confirm({
      title: "Delete Slide",
      content:
        "Are you sure you want to delete this slide? This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => removeSlide(slide),
    });
  };

  return (
    <>
      {/* Homepage Carousel */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Homepage Carousel</h2>
            <p className={styles.sectionSubtitle}>
              Manage the hero images that rotate on the landing page. <br />
              <span style={{ fontWeight: "bold", color: "#666" }}>
                Limit: 05 slides.
                <br />
                Maximum file size: {IMAGE_SIZES.HOMEPAGE_CAROUSEL.label} per
                image. Supported formats: JPG, PNG, JPEG. Recommended
                dimensions: 1920x1080 pixels.
              </span>
            </p>
          </div>
          <button
            className={styles.btnPrimary}
            onClick={() => carouselInput.current.click()}
            disabled={uploading || slides.length >= 5}
          >
            {uploading ? (
              <>
                <LoadingOutlined spin /> Uploading...
              </>
            ) : (
              <>
                {slides.length >= 5 ? (
                  <span style={{ marginRight: "6px" }}>Limit reached</span>
                ) : (
                  <>
                    <DatabaseOutlined /> Add Slide
                  </>
                )}
              </>
            )}
          </button>
          <input
            ref={carouselInput}
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={addSlide}
          />
        </div>
        <Spin spinning={reordering} tip="Updating order…">
          <div className={styles.carouselGrid}>
            {fetching ? (
              <p className={styles.emptyHint}>
                <LoadingOutlined spin /> Loading slides...
              </p>
            ) : isError ? (
              <p className={styles.emptyHint}>Failed to load slides.</p>
            ) : slides.length === 0 ? (
              <p className={styles.emptyHint}>
                No slides yet — click &ldquo;Add Slide&rdquo; to upload.
              </p>
            ) : null}
            {slides.map((s, idx) => (
              <div
                key={s.id}
                className={`${styles.carouselSlide} ${
                  dragOverId === s.id ? styles.carouselDragOver : ""
                }`}
                draggable={slides.length > 1}
                onDragStart={(e) => handleDragStart(e, s.id)}
                onDragOver={(e) => handleDragOver(e, s.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, s.id)}
              >
                <img
                  src={s.url}
                  alt={`slide-${idx + 1}`}
                  className={styles.carouselImg}
                />
                <button
                  className={styles.carouselRemove}
                  onClick={() => confirmRemoveSlide(s)}
                  disabled={deletingId === s.id}
                >
                  {deletingId === s.id ? (
                    <LoadingOutlined spin />
                  ) : (
                    <DeleteOutlined />
                  )}
                </button>
                <span className={styles.carouselOrder}>{idx + 1}</span>
              </div>
            ))}
          </div>
        </Spin>
      </section>

      {/* Vision & Mission Media */}
      {/* <section className={`${styles.section} ${styles.sectionCard}`}>
        <h2 className={styles.sectionTitle}>Vision &amp; Mission Media</h2>
        <p className={styles.sectionSubtitle}>
          Supporting visuals for the agency values section.
        </p>
        <div className={styles.mediaGrid}>
          <ImageSlot label="MISSION IMAGE" />
          <ImageSlot label="VISION VIDEO" video />
          <ImageSlot label="VALUE PILLARS BACKDROP" />
        </div>
        <p className={styles.syncedTag}>&#10003; Synced with live site</p>
      </section> */}
    </>
  );
};

export default HomepagePanel;
