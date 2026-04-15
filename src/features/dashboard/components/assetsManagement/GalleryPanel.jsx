import { useState, useRef } from "react";
import { UploadOutlined } from "@ant-design/icons";
import styles from "../../styles/AssetsManagement.module.css";
import { GalleryTile, GalleryAddTile } from "./GalleryTile";

const GalleryPanel = () => {
  const inputRef = useRef();
  const [items, setItems] = useState([]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    setItems((prev) => [
      ...prev,
      ...files.map((f) => ({
        id: Date.now() + Math.random(),
        label: f.name.replace(/\.[^.]+$/, ""),
        url: URL.createObjectURL(f),
        caption: "",
      })),
    ]);
  };

  const handleCaptionChange = (id, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, caption: value } : item)),
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Gallery</h2>
          <p className={styles.sectionSubtitle}>
            Upload and manage images displayed in the gallery page.
          </p>
        </div>
        <button
          className={styles.btnDark}
          onClick={() => inputRef.current.click()}
        >
          <UploadOutlined /> Upload Images
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
        {items.map((g) => (
          <GalleryTile
            key={g.id}
            src={g.url}
            label={g.label}
            caption={g.caption}
            onCaptionChange={(val) => handleCaptionChange(g.id, val)}
            onRemove={() =>
              setItems((prev) => prev.filter((i) => i.id !== g.id))
            }
          />
        ))}
        <GalleryAddTile onClick={() => inputRef.current.click()} />
      </div>
      {items.length === 0 && (
        <p className={styles.emptyHint}>No gallery images yet.</p>
      )}
    </section>
  );
};

export default GalleryPanel;
