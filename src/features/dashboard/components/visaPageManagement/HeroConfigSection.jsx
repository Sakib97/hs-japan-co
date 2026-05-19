import { Input, Upload } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import styles from "./HeroConfigSection.module.css";

const { TextArea } = Input;
const { Dragger } = Upload;

const HeroConfigSection = ({ data, onChange }) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.iconWrap}>
          <i className="fi fi-rr-graduation-cap"></i>
        </span>
        <h2 className={styles.sectionTitle}>Hero Configuration</h2>
      </div>

      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.field}>
            <label className={styles.label}>
              HERO TITLE <span className={styles.req}>*</span>
            </label>
            <Input
              placeholder="e.g. Skilled Labor Visa (Type-1)"
              value={data.title}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              HERO SUBTITLE <span className={styles.req}>*</span>
            </label>
            <TextArea
              rows={4}
              placeholder="Define the core value proposition and primary eligibility criteria for this visa category."
              value={data.subtitle}
              onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.right}>
          <label className={styles.label}>
            UPLOAD HERO IMAGE <span className={styles.req}>*</span>
          </label>
          <Dragger
            accept=".jpg,.jpeg,.png"
            maxCount={1}
            showUploadList={false}
            beforeUpload={(file) => {
              onChange({
                ...data,
                image: file,
                imageUrl: URL.createObjectURL(file),
              });
              return false;
            }}
            className={styles.dragger}
          >
            {data.imageUrl ? (
              <img
                src={data.imageUrl}
                alt="hero"
                className={styles.previewImg}
              />
            ) : (
              <>
                <p className={styles.draggerIcon}>
                  <CloudUploadOutlined />
                </p>
                <p className={styles.draggerText}>
                  Drag and drop high-resolution JPG/PNG
                </p>
                <p className={styles.draggerHint}>Recommended: 1920×1080px</p>
              </>
            )}
          </Dragger>
        </div>
      </div>
    </div>
  );
};

export default HeroConfigSection;
