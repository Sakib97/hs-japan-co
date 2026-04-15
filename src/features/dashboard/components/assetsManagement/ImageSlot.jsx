import { useState, useRef } from "react";
import { PlusOutlined, PlayCircleOutlined } from "@ant-design/icons";
import styles from "../../styles/AssetsManagement.module.css";

const ImageSlot = ({ label, src, onUpload, video = false, wide = false }) => {
  const inputRef = useRef();
  const [preview, setPreview] = useState(src || null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onUpload && onUpload(file);
  };

  return (
    <div className={`${styles.imageSlot} ${wide ? styles.imageSlotWide : ""}`}>
      {label && <p className={styles.slotLabel}>{label}</p>}
      <div
        className={`${styles.slotBox} ${video ? styles.slotBoxVideo : ""}`}
        onClick={() => inputRef.current.click()}
      >
        {preview ? (
          video ? (
            <video src={preview} className={styles.slotPreview} controls />
          ) : (
            <img src={preview} alt={label} className={styles.slotPreview} />
          )
        ) : (
          <div className={styles.slotEmpty}>
            {video ? (
              <>
                <PlayCircleOutlined className={styles.slotIcon} />
                <span>Click to upload video (.mp4, max 50MB)</span>
              </>
            ) : (
              <PlusOutlined className={styles.slotIcon} />
            )}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={video ? "video/mp4" : "image/*"}
        className={styles.hiddenInput}
        onChange={handleFile}
      />
    </div>
  );
};

export default ImageSlot;
