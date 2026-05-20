import { Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./EligibilitySection.module.css";
import SaveDraftBtnComp from "./SaveDraftBtnComp";

const { TextArea } = Input;

const EligibilitySection = ({ data, onChange, disabled }) => {
  const addSubsection = () => {
    onChange({
      ...data,
      subsections: [
        ...data.subsections,
        { icon: "fi-rr-graduation-cap", title: "", subtitle: "" },
      ],
    });
  };

  const updateSubsection = (idx, field, value) => {
    onChange({
      ...data,
      subsections: data.subsections.map((s, i) =>
        i === idx ? { ...s, [field]: value } : s,
      ),
    });
  };

  const removeSubsection = (idx) => {
    if (data.subsections.length === 1) return;
    onChange({
      ...data,
      subsections: data.subsections.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className={`${styles.section} ${disabled ? styles.disabled : ""}`}>
      {disabled && (
        <div className={styles.disabledOverlay}>
          <span className={styles.disabledMsg}>
            <i className="fi fi-rr-lock"></i> Complete Hero Configuration first
          </span>
        </div>
      )}
      <div className={styles.sectionHeader}>
        <span className={styles.iconWrap}>
          <i className="fi fi-rr-ballot"></i>
        </span>
        <h2 className={styles.sectionTitle}>Eligibility Requirements</h2>
      </div>

      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.field}>
            <label className={styles.label}>
              SECTION TITLE <span className={styles.req}>*</span>
            </label>
            <Input
              placeholder="Entry Requirements"
              value={data.title}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>SECTION SUBTITLE</label>
            <TextArea
              rows={5}
              placeholder="Overview of what applicants need to qualify."
              value={data.subtitle}
              onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.right}>
          <label className={styles.label}>REPEATABLE SUBSECTIONS</label>
          <div className={styles.subsectionList}>
            {data.subsections.map((sub, idx) => (
              <div key={idx} className={styles.subsectionItem}>
                <div className={styles.iconPickerWrap}>
                  <div className={styles.iconBox}>
                    <i
                      className={`fi ${sub.icon || "fi-rr-graduation-cap"}`}
                    ></i>
                  </div>
                  <span className={styles.selectIconText}>SELECT ICON</span>
                </div>
                <div className={styles.subFields}>
                  <Input
                    placeholder="Subsection Title (e.g. Educational Background)"
                    value={sub.title}
                    onChange={(e) =>
                      updateSubsection(idx, "title", e.target.value)
                    }
                  />
                  <TextArea
                    rows={2}
                    placeholder="Subsection Subtitle or detailed criteria..."
                    value={sub.subtitle}
                    onChange={(e) =>
                      updateSubsection(idx, "subtitle", e.target.value)
                    }
                    style={{ marginTop: 8 }}
                  />
                </div>
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  className={styles.removeBtn}
                  onClick={() => removeSubsection(idx)}
                  disabled={data.subsections.length === 1}
                />
              </div>
            ))}
          </div>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addSubsection}
            className={styles.addBtn}
            block
          >
            Add Subsection
          </Button>
        </div>
        <div className={styles.draftBtnWrapper}>
          <SaveDraftBtnComp />
        </div>
      </div>
    </div>
  );
};

export default EligibilitySection;
