import { useState } from "react";
import {
  PlusOutlined,
  DeleteOutlined,
  LoadingOutlined,
  SendOutlined,
} from "@ant-design/icons";
import styles from "../../styles/AssetsManagement.module.css";
import { showToast } from "../../../../components/layout/CustomToast";

export const GalleryTile = ({
  src,
  label,
  caption,
  onCaptionChange,
  onSaveCaption,
  onRemove,
  deleting,
}) => {
  const [saving, setSaving] = useState(false);

  const handleSend = async () => {
    if (!caption || !caption.trim()) {
      showToast("Caption cannot be empty.", "error");
      return;
    }
    setSaving(true);
    try {
      await onSaveCaption?.(caption.trim());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.galleryTile}>
      <img src={src} alt={label} className={styles.galleryTileImg} />
      <div className={styles.galleryCaptionRow}>
        <textarea
          className={styles.galleryTileCaption}
          value={caption}
          onChange={(e) => onCaptionChange?.(e.target.value)}
          placeholder="Add caption..."
          rows={2}
        />
        <button
          className={styles.gallerySendBtn}
          onClick={handleSend}
          disabled={saving || deleting}
          title="Save caption"
        >
          {saving ? <LoadingOutlined spin /> : <SendOutlined />}
        </button>
      </div>
      {onRemove && (
        <button
          className={styles.galleryTileRemove}
          onClick={onRemove}
          disabled={deleting}
        >
          {deleting ? <LoadingOutlined spin /> : <DeleteOutlined />}
        </button>
      )}
    </div>
  );
};

export const GalleryAddTile = ({ onClick }) => (
  <div className={styles.galleryTile}>
    <div className={styles.galleryTileAdd} onClick={onClick}>
      <PlusOutlined />
    </div>
  </div>
);
