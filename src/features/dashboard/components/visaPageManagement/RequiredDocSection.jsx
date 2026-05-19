import { Input, Upload, Button } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import styles from "./RequiredDocSection.module.css";

const RequiredDocSection = ({ data, onChange }) => {
  const handleImageUpload = (file) => {
    onChange({
      ...data,
      sideImage: file,
      sideImageUrl: URL.createObjectURL(file),
    });
    return false;
  };

  const addDocument = () => {
    onChange({
      ...data,
      documents: [...data.documents, { title: "" }],
    });
  };

  const updateDocument = (idx, value) => {
    onChange({
      ...data,
      documents: data.documents.map((d, i) =>
        i === idx ? { ...d, title: value } : d,
      ),
    });
  };

  const removeDocument = (idx) => {
    onChange({
      ...data,
      documents: data.documents.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.iconWrap}>
          <i className="fi fi-rr-folder-open"></i>
        </span>
        <h2 className={styles.sectionTitle}>Required Documentation</h2>
      </div>

      <div className={styles.grid}>
        <div className={styles.imageCol}>
          <label className={styles.label}>
            SIDE IMAGE <span className={styles.req}>*</span>
          </label>
          <Upload.Dragger
            accept=".jpg,.jpeg,.png"
            maxCount={1}
            showUploadList={false}
            beforeUpload={handleImageUpload}
            className={styles.imageUpload}
          >
            {data.sideImageUrl ? (
              <img
                src={data.sideImageUrl}
                alt="side"
                className={styles.previewImg}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <i className="fi fi-rr-picture"></i>
                <span>Upload</span>
              </div>
            )}
          </Upload.Dragger>
        </div>

        <div className={styles.contentCol}>
          <div className={styles.topRow}>
            <div className={styles.field}>
              <label className={styles.label}>
                SECTION TITLE <span className={styles.req}>*</span>
              </label>
              <Input
                placeholder="Supporting Evidence"
                value={data.sectionTitle}
                onChange={(e) =>
                  onChange({ ...data, sectionTitle: e.target.value })
                }
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>SECTION SUBTITLE</label>
              <Input
                placeholder="Ensure all scans are clear"
                value={data.sectionSubtitle}
                onChange={(e) =>
                  onChange({ ...data, sectionSubtitle: e.target.value })
                }
              />
            </div>
          </div>

          <label className={styles.checklistLabel}>DOCUMENT CHECKLIST</label>
          <div className={styles.docList}>
            {data.documents.map((doc, idx) => (
              <div key={idx} className={styles.docItem}>
                <i
                  className="fi fi-rr-file-pdf"
                  style={{ color: "#b91c1c", flexShrink: 0 }}
                ></i>
                <Input
                  placeholder="Add Document Title..."
                  value={doc.title}
                  onChange={(e) => updateDocument(idx, e.target.value)}
                  variant="borderless"
                  className={styles.docInput}
                />
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => removeDocument(idx)}
                />
              </div>
            ))}
          </div>

          <Button
            type="link"
            icon={<PlusCircleOutlined />}
            onClick={addDocument}
            className={styles.addDocBtn}
          >
            ADD NEW DOCUMENT FIELD
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequiredDocSection;
