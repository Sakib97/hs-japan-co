import { useState, useRef } from "react";
import {
  DatabaseOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import styles from "../../styles/AssetsManagement.module.css";
import { showToast } from "../../../../components/layout/CustomToast";
import { supabase } from "../../../../config/supabaseClient";
import { uploadImage, deleteImage } from "../../../../utils/handleImage";
import { Modal } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchSlides = async () => {
  const { data, error } = await supabase
    .from("home_page")
    .select("id, image_link")
    .eq("image_section", "homepage_carousel");
  if (error) throw new Error(error.message);
  return data.map((row) => ({
    id: row.id,
    url: row.image_link,
    name: row.image_link,
  }));
};

const HomepagePanel = () => {
  const queryClient = useQueryClient();
  const carouselInput = useRef();
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const {
    data: slides = [],
    isLoading: fetching,
    isError,
  } = useQuery({
    queryKey: ["homepage_carousel_slides"],
    queryFn: fetchSlides,
  });

  const addSlide = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Invalid file type. Please upload an image file.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("File too large. Maximum allowed size is 5 MB.", "error");
      return;
    }
    setUploading(true);
    try {
      const publicUrl = await uploadImage(file, "home_page_images", "carousel");

      const { error: dbError } = await supabase.from("home_page").insert({
        image_link: publicUrl,
        image_section: "homepage_carousel",
      });

      if (dbError) throw new Error(dbError.message);

      queryClient.invalidateQueries({ queryKey: ["homepage_carousel_slides"] });
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
        // column: "id",
        column: "image_link",
        // value: slide.id,
        value: slide.url,
      });
      queryClient.invalidateQueries({ queryKey: ["homepage_carousel_slides"] });
      showToast("Slide deleted successfully!", "success");
    } catch {
      showToast("Failed to delete slide. Please try again.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmRemoveSlide = (slide) => {
    console.log("slide::", slide);

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
                Maximum file size: 5 MB per image. Supported formats: JPG, PNG,
                JPEG. Recommended dimensions: 1920x1080 pixels.
              </span>
            </p>
          </div>
          <button
            className={styles.btnPrimary}
            onClick={() => carouselInput.current.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <LoadingOutlined spin /> Uploading...
              </>
            ) : (
              <>
                <DatabaseOutlined /> Add Slide
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
          {slides.map((s) => (
            <div key={s.id} className={styles.carouselSlide}>
              <img src={s.url} alt={s.name} className={styles.carouselImg} />
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
            </div>
          ))}
        </div>
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
