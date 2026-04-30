import { useState, useRef } from "react";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { Modal, Pagination } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "../../styles/AssetsManagement.module.css";
import { GalleryTile, GalleryAddTile } from "./GalleryTile";
import { showToast } from "../../../../components/layout/CustomToast";
import { uploadImage, deleteImage } from "../../../../utils/handleImage";
import { supabase } from "../../../../config/supabaseClient";
import { IMAGE_SIZES } from "../../../../config/imageSizeConfig";
import { QK_GALLERY_PAGE_IMAGES } from "../../../../config/queryKeyConfig";

const fetchGalleryImages = async () => {
  const { data, error } = await supabase
    .from("gallery_page")
    .select("id, image_link, image_description")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data.map((row) => ({
    id: row.id,
    url: row.image_link,
    label: row.image_link,
    caption: row.image_description ?? "",
  }));
};

const GalleryPanel = () => {
  const inputRef = useRef();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const MAX_IMAGES = 30;
  const MAX_FILE_SIZE = IMAGE_SIZES.GALLERY.maxBytes;

  const {
    data: items = [],
    isLoading: fetching,
    isError,
  } = useQuery({
    queryKey: [QK_GALLERY_PAGE_IMAGES],
    queryFn: fetchGalleryImages,
  });

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";

    if (items.length >= MAX_IMAGES) {
      showToast(`Maximum of ${MAX_IMAGES} images allowed.`, "error");
      return;
    }

    const remaining = MAX_IMAGES - items.length;
    const valid = [];
    for (const f of files) {
      if (!f.type.startsWith("image/")) {
        showToast(`"${f.name}" is not an image file.`, "error");
        continue;
      }
      if (f.size > MAX_FILE_SIZE) {
        showToast(
          `"${f.name}" exceeds the ${IMAGE_SIZES.GALLERY.label} size limit.`,
          "error",
        );
        continue;
      }
      valid.push(f);
    }

    const capped = valid.slice(0, remaining);
    if (valid.length > remaining) {
      showToast(
        `Only ${remaining} more image${remaining > 1 ? "s" : ""} can be added (limit: ${MAX_IMAGES}).`,
        "error",
      );
    }

    if (capped.length === 0) return;

    setUploading(true);
    try {
      await Promise.all(
        capped.map(async (f) => {
          const publicUrl = await uploadImage(
            f,
            "gallery_page_images",
            "gallery",
          );
          const { error: dbError } = await supabase
            .from("gallery_page")
            .insert({
              image_link: publicUrl,
              image_description: "",
              image_size: f.size,
            });
          if (dbError) throw new Error(dbError.message);
        }),
      );
      await queryClient.invalidateQueries({
        queryKey: [QK_GALLERY_PAGE_IMAGES],
      });
      showToast(
        `${capped.length} image${capped.length > 1 ? "s" : ""} uploaded successfully!`,
        "success",
      );
    } catch {
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  const saveCaption = async (item, description) => {
    const { error } = await supabase
      .from("gallery_page")
      .update({ image_description: description })
      .eq("image_link", item.url);
    if (error) {
      showToast("Failed to save caption. Please try again.", "error");
      throw error;
    }
    await queryClient.invalidateQueries({ queryKey: [QK_GALLERY_PAGE_IMAGES] });
    showToast("Caption saved.", "success");
  };

  const removeItem = async (item) => {
    setDeletingId(item.id);
    try {
      await deleteImage(item.url, "gallery_page_images", {
        table: "gallery_page",
        column: "image_link",
        value: item.url,
      });
      await queryClient.invalidateQueries({
        queryKey: [QK_GALLERY_PAGE_IMAGES],
      });
      showToast("Image deleted successfully!", "success");
    } catch {
      showToast("Failed to delete image. Please try again.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmRemoveItem = (item) => {
    Modal.confirm({
      title: "Delete Image",
      content:
        "Are you sure you want to delete this image? This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => removeItem(item),
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Gallery</h2>
          <p className={styles.sectionSubtitle}>
            Upload and manage images displayed in the gallery page. <br />
            <strong>
              Limit: {MAX_IMAGES} images. <br />
              If {MAX_IMAGES} images are already uploaded, delete old images to
              add more. <br /> <br />
              Maximum file size: {IMAGE_SIZES.GALLERY.label} per image.
              Supported formats: JPG, PNG, JPEG.
            </strong>
            <br />
            <strong>
              Recommended dimensions: 800x600 pixels for optimal display.
            </strong>
          </p>
        </div>

        <button
          className={styles.btnDark}
          onClick={() => inputRef.current.click()}
          disabled={uploading || items.length >= MAX_IMAGES}
        >
          {uploading ? (
            <>
              <LoadingOutlined spin /> Uploading...
            </>
          ) : (
            <>
              <UploadOutlined /> Upload Images
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className={styles.hiddenInput}
          onChange={handleUpload}
        />
      </div>
      <div className={styles.galleryGrid}>
        {fetching ? (
          <p className={styles.emptyHint}>
            <LoadingOutlined spin /> Loading images...
          </p>
        ) : isError ? (
          <p className={styles.emptyHint}>Failed to load gallery images.</p>
        ) : null}
        {items
          .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
          .map((g) => (
            <GalleryTile
              key={g.id}
              src={g.url}
              label={g.label}
              caption={g.caption}
              deleting={deletingId === g.id}
              onCaptionChange={(val) =>
                queryClient.setQueryData(["gallery_page_images"], (old) =>
                  old.map((item) =>
                    item.id === g.id ? { ...item, caption: val } : item,
                  ),
                )
              }
              onSaveCaption={(description) => saveCaption(g, description)}
              onRemove={() => confirmRemoveItem(g)}
            />
          ))}
        <GalleryAddTile onClick={() => inputRef.current.click()} />
      </div>
      {!fetching && !isError && items.length === 0 && (
        <p className={styles.emptyHint}>No gallery images yet.</p>
      )}
      {items.length > PAGE_SIZE && (
        <div className={styles.pagination}>
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={items.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      )}
    </section>
  );
};

export default GalleryPanel;
