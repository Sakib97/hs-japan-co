import { Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, forwardRef, useImperativeHandle } from "react";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./ApplicationProcessSection.module.css";
import SaveDraftBtnComp from "./SaveDraftBtnComp";
import { showToast } from "../../../../components/layout/CustomToast";
import { supabase } from "../../../../config/supabaseClient";
import { QK_VISA_PAGES } from "../../../../config/queryKeyConfig";

const { TextArea } = Input;

const ApplicationProcessSection = forwardRef(
  ({ data, onChange, disabled, pageId }, ref) => {
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

    const queryClient = useQueryClient();
    const [draftSaving, setDraftSaving] = useState(false);

    // Calculate if save draft button should be disabled
    const isDraftDisabled =
      !data.title?.trim() ||
      !data.subtitle?.trim() ||
      data.steps.some((s) => !s.title?.trim() || !s.subtitle?.trim());

    const saveDraft = async () => {
      setDraftSaving(true);
      try {
        const { error } = await supabase.rpc(
          "save_visa_page_application_process_draft",
          {
            p_page_id: pageId,
            p_title: data.title.trim(),
            p_subtitle: data.subtitle.trim(),
            p_steps: data.steps.map((s, i) => ({
              title: s.title.trim(),
              subtitle: s.subtitle.trim(),
              order: i,
            })),
          },
        );

        if (error) {
          showToast(
            error.message || "Failed to save application process draft.",
            "error",
          );
          return false;
        }

        queryClient.invalidateQueries({ queryKey: [QK_VISA_PAGES] });
        showToast("Application process saved successfully!", "success");
        return true;
      } catch (err) {
        showToast(err.message || "An unexpected error occurred.", "error");
        return false;
      } finally {
        setDraftSaving(false);
      }
    };

    useImperativeHandle(ref, () => ({ saveDraft }));

    return (
      <div className={`${styles.section} ${disabled ? styles.disabled : ""}`}>
        {disabled && (
          <div className={styles.disabledOverlay}>
            <span className={styles.disabledMsg}>
              <i className="fi fi-rr-lock"></i> Complete Hero Configuration
              first
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
              <label className={styles.label}>
                PROCESS SUBTITLE <span className={styles.req}>*</span>
              </label>
              <TextArea
                rows={4}
                placeholder="Timeline expectations and overview..."
                value={data.subtitle}
                onChange={(e) =>
                  onChange({ ...data, subtitle: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.stepsList}>
              {data.steps.map((step, idx) => (
                <div key={idx} className={styles.stepItem}>
                  <span className={styles.stepNum}>{idx + 1}</span>
                  <div className={styles.stepFields}>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>TITLE</span>{" "}
                      <span className={styles.req}>*</span>
                    </div>
                    <Input
                      placeholder="Step Title (e.g. Document Submission)"
                      value={step.title}
                      onChange={(e) => updateStep(idx, "title", e.target.value)}
                    />
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginTop: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>DETAILS</span>{" "}
                      <span className={styles.req}>*</span>
                    </div>
                    <TextArea
                      rows={2}
                      placeholder="Step details or description..."
                      value={step.subtitle}
                      onChange={(e) =>
                        updateStep(idx, "subtitle", e.target.value)
                      }
                      style={{ marginTop: 0 }}
                    />
                  </div>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
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
            <SaveDraftBtnComp
              onClick={saveDraft}
              loading={draftSaving}
              disabled={isDraftDisabled}
            />
          </div>
        </div>
      </div>
    );
  },
);

export default ApplicationProcessSection;
