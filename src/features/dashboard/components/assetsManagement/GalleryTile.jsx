import { PlusOutlined } from "@ant-design/icons";
import styles from "../../styles/AssetsManagement.module.css";

export const GalleryTile = ({
  src,
  label,
  caption,
  onCaptionChange,
  onRemove,
}) => (
  <div className={styles.galleryTile}>
    <img src={src} alt={label} className={styles.galleryTileImg} />
    <textarea
      className={styles.galleryTileCaption}
      value={caption}
      onChange={(e) => onCaptionChange?.(e.target.value)}
      placeholder="Add caption..."
      rows={2}
    />
    {onRemove && (
      <button className={styles.galleryTileRemove} onClick={onRemove}>
        ×
      </button>
    )}
  </div>
);

export const GalleryAddTile = ({ onClick }) => (
  <div className={styles.galleryTile}>
    <div className={styles.galleryTileAdd} onClick={onClick}>
      <PlusOutlined />
    </div>
  </div>
);
