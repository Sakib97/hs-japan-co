import { useState } from "react";
import { Input } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import TiptapRTE from "../../../components/layout/TiptapRTE";
import { supabase } from "../../../config/supabaseClient";
import { showToast } from "../../../components/layout/CustomToast";
import { QK_ADMISSION_PAGE } from "../../../config/queryKeyConfig";
import { ADMISSION_SECTION_KEYS, saveAdmissionSection } from "../utils/admissionPageUtils";
import { ADMISSION_DEFAULTS } from "./AdmissionSectionContent";
import editStyles from "../styles/AdmissionEditShared.module.css";
import styles from "../styles/AdmissionBannerComp.module.css";

const AdmissionBannerComp = ({ isEditMode, data }) => {
  const queryClient = useQueryClient();
  const defaults = ADMISSION_DEFAULTS.banner;
  const [titleDraft, setTitleDraft] = useState(null);
  const [editContent, setEditContent] = useState(null);
  const [savingTitle, setSavingTitle] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  // const [saving, setSaving] = useState(false);

  const title = titleDraft ?? data?.section_title ?? defaults.title;
  const statHtml = data?.section_content ?? defaults.content;

  const saveField = async (fields, message, savingField = null) => {
    if (savingField === "title") {
      setSavingTitle(true);
      setSavingContent(false);
    } else if (savingField === "content") {
      setSavingContent(true);
      setSavingTitle(false);
    }
    try {
      await saveAdmissionSection(
        supabase,
        ADMISSION_SECTION_KEYS.BANNER,
        fields,
      );
      await queryClient.invalidateQueries({ queryKey: [QK_ADMISSION_PAGE] });
      showToast(message, "success");
    } catch (err) {
      showToast(err.message || "Failed to update.", "error");
    } finally {
      // setSaving(false);
      setSavingTitle(false);
      setSavingContent(false);
    }
  };

  return (
    <section className={styles.banner}>
      <div className={styles.overlay} />
      <div className={styles.container}>
        {isEditMode ? (
          <>
            <div className={editStyles.editRow}>
              <Input
                className={editStyles.titleInput}
                value={title}
                onChange={(e) => setTitleDraft(e.target.value)}
                placeholder="Banner title"
                style={{ maxWidth: 400 }}
              />
              <button
                type="button"
                className={editStyles.tickBtn}
                onClick={() =>
                  saveField({ section_title: title.trim() }, "Title updated.", "title")
                }
                disabled={savingTitle || !title.trim()}
              >
                {savingTitle ? (
                  <i className="fa-solid fa-spinner fa-spin" />
                ) : (
                  <i className="fa-solid fa-check" />
                )}
              </button>
            </div>
            <div className={editStyles.rteWrapper}>
              <TiptapRTE
                value={statHtml}
                onChange={(html) => setEditContent(html)}
              />
              <button
                type="button"
                className={editStyles.saveBtn}
                onClick={() =>
                  editContent !== null &&
                  saveField(
                    { section_content: editContent },
                    "Banner text updated.",
                    "content"
                  )
                }
                disabled={savingContent || editContent === null}
              >
                {savingContent ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" />
                    &nbsp; Saving Banner Text...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk" />
                    &nbsp; Save Banner Text
                  </>
                  
                )} 
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className={styles.title}>{title}</h1>
            <div
              className={styles.stat}
              dangerouslySetInnerHTML={{ __html: statHtml }}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default AdmissionBannerComp;
