import { Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, forwardRef, useImperativeHandle } from "react";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./EligibilitySection.module.css";
import SaveDraftBtnComp from "./SaveDraftBtnComp";
import FAIconPicker from "../../../../components/common/FAIconPicker";
import { showToast } from "../../../../components/layout/CustomToast";
import { supabase } from "../../../../config/supabaseClient";
import {
  QK_VISA_PAGES,
  QK_VISA_PAGE_FULL,
  QK_VISA_PAGE_BY_SLUG,
} from "../../../../config/queryKeyConfig";

const { TextArea } = Input;

const EligibilitySection = forwardRef(
  ({ data, onChange, disabled, pageId }, ref) => {
    const addSubsection = () => {
      onChange({
        ...data,
        subsections: [
          ...data.subsections,
          { icon: "fa-solid fa-graduation-cap", title: "", subtitle: "" },
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

    const queryClient = useQueryClient();
    const [draftSaving, setDraftSaving] = useState(false);

    // Calculate if save draft button should be disabled
    const isDraftDisabled =
      !data.title?.trim() ||
      !data.subtitle?.trim() ||
      data.subsections.some((s) => !s.title?.trim() || !s.subtitle?.trim());

    const saveDraft = async () => {
      setDraftSaving(true);
      try {
        const { error } = await supabase.rpc(
          "save_visa_page_eligibility_draft",
          {
            p_page_id: pageId,
            p_title: data.title.trim(),
            p_subtitle: data.subtitle.trim(),
            p_subsections: data.subsections.map((s, i) => ({
              icon: s.icon,
              title: s.title.trim(),
              subtitle: s.subtitle.trim(),
              order: i,
            })),
          },
        );

        if (error) {
          showToast(
            error.message || "Failed to save eligibility draft.",
            "error",
          );
          return false;
        }

        queryClient.invalidateQueries({ queryKey: [QK_VISA_PAGES] });
        queryClient.invalidateQueries({
          queryKey: [QK_VISA_PAGE_FULL, pageId],
        });
        queryClient.invalidateQueries({ queryKey: [QK_VISA_PAGE_BY_SLUG] });
        showToast("Eligibility section saved successfully!", "success");
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
              <label className={styles.label}>
                SECTION SUBTITLE <span className={styles.req}>*</span>
              </label>
              <TextArea
                rows={5}
                placeholder="Overview of what applicants need to qualify."
                value={data.subtitle}
                onChange={(e) =>
                  onChange({ ...data, subtitle: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.right}>
            <label className={styles.label}>REPEATABLE SUBSECTIONS</label>
            <div className={styles.subsectionList}>
              {data.subsections.map((sub, idx) => (
                <div key={idx} className={styles.subsectionItem}>
                  <FAIconPicker
                    value={sub.icon || "fa-solid fa-graduation-cap"}
                    onChange={(icon) => updateSubsection(idx, "icon", icon)}
                  >
                    <div className={styles.iconPickerTrigger}>
                      <i className={sub.icon || "fa-solid fa-graduation-cap"} />
                      <span className={styles.editBadge}>
                        <i className="fa-solid fa-pen" />
                      </span>
                    </div>
                  </FAIconPicker>
                  <div className={styles.subFields}>
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
                      placeholder="Subsection Title (e.g. Educational Background)"
                      value={sub.title}
                      onChange={(e) =>
                        updateSubsection(idx, "title", e.target.value)
                      }
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
                      placeholder="Subsection Subtitle or detailed criteria..."
                      value={sub.subtitle}
                      onChange={(e) =>
                        updateSubsection(idx, "subtitle", e.target.value)
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
              ADD SUBSECTION
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

export default EligibilitySection;
