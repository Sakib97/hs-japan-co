import { Input, Button } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./ApplicationProcessSection.module.css";
import SaveDraftBtnComp from "./SaveDraftBtnComp";

const { TextArea } = Input;

const ApplicationProcessSection = ({ data, onChange, disabled }) => {
  const addStep = () => {
    onChange({
      ...data,
      steps: [...data.steps, { title: "", subtitle: "" }],
    });
  };

  const updateStep = (idx, field, value) => {
    onChange({
      ...data,
      steps: data.steps.map((s, i) =>
        i === idx ? { ...s, [field]: value } : s,
      ),
    });
  };

  const removeStep = (idx) => {
    if (data.steps.length === 1) return;
    onChange({
      ...data,
      steps: data.steps.filter((_, i) => i !== idx),
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
          <i className="fi fi-rr-layers"></i>
        </span>
        <h2 className={styles.sectionTitle}>Application Process</h2>
      </div>

      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.field}>
            <label className={styles.label}>
              PROCESS TITLE <span className={styles.req}>*</span>
            </label>
            <Input
              placeholder="Standard Application Process"
              value={data.title}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>PROCESS SUBTITLE</label>
            <TextArea
              rows={4}
              placeholder="Timeline expectations and overview..."
              value={data.subtitle}
              onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.stepsList}>
            {data.steps.map((step, idx) => (
              <div key={idx} className={styles.stepItem}>
                <span className={styles.stepNum}>{idx + 1}</span>
                <div className={styles.stepFields}>
                  <div className={styles.stepRow}>
                    <span className={styles.stepFieldLabel}>Step Title:</span>
                    <Input
                      placeholder="Step Title"
                      value={step.title}
                      onChange={(e) => updateStep(idx, "title", e.target.value)}
                      variant="borderless"
                      className={`${styles.stepInput} ${step.title ? styles.filled : ""}`}
                    />
                  </div>
                  <div className={styles.stepRow}>
                    <span className={styles.stepSubLabel}>Subtitle:</span>
                    <Input
                      placeholder="Step Subtitle"
                      value={step.subtitle}
                      onChange={(e) =>
                        updateStep(idx, "subtitle", e.target.value)
                      }
                      variant="borderless"
                      className={styles.stepSubInput}
                    />
                  </div>
                </div>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  className={styles.removeBtn}
                  onClick={() => removeStep(idx)}
                  disabled={data.steps.length === 1}
                />
              </div>
            ))}
          </div>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addStep}
            className={styles.addBtn}
            block
          >
            ADD PROCESS STEP
          </Button>
        </div>
        <div className={styles.draftBtnWrapper}>
          <SaveDraftBtnComp />
        </div>
      </div>
    </div>
  );
};

export default ApplicationProcessSection;
