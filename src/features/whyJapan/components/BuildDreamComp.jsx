import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import styles from "../styles/BuildDreamComp.module.css";
import FAIconPicker from "../../../components/common/FAIconPicker";
import { supabase } from "../../../config/supabaseClient";
import { showToast } from "../../../components/layout/CustomToast";
import TiptapRTE from "../../../components/layout/TiptapRTE";

const BuildDreamComp = ({ isEditMode, data = [] }) => {
  const queryClient = useQueryClient();
  const [editingContent, setEditingContent] = useState({});
  const [savingId, setSavingId] = useState(null);

  const handleIconChange = async (id, newIcon) => {
    try {
      const { error } = await supabase
        .from("why_japan_byd")
        .update({ section_icon: newIcon })
        .eq("id", id);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["why-japan-page"] });
      showToast("Icon updated!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update icon.", "error");
    }
  };

  const handleContentSave = async (id, fallbackContent) => {
    const html =
      editingContent[id] !== undefined ? editingContent[id] : fallbackContent;
    if (!html) return;
    setSavingId(id);
    try {
      const { error } = await supabase
        .from("why_japan_byd")
        .update({ section_content: html })
        .eq("id", id);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["why-japan-page"] });
      showToast("Content updated successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update content.", "error");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Build Your Dream in Japan</h2>
        <div className={styles.grid}>
          {data.map((card) => (
            <div className={styles.card} key={card.id}>
              {isEditMode ? (
                <FAIconPicker
                  value={card.section_icon}
                  onChange={(icon) => handleIconChange(card.id, icon)}
                >
                  <div
                    className={`${styles.iconCircle} ${styles.iconCircleEditable}`}
                    title="Click to change icon"
                  >
                    <i className={card.section_icon} />
                    <span className={styles.iconEditHint}>
                      <i className="fa-solid fa-pen-to-square" />
                    </span>
                  </div>
                </FAIconPicker>
              ) : (
                <div className={styles.iconCircle}>
                  <i className={card.section_icon} />
                </div>
              )}
              {isEditMode ? (
                <div className={styles.rteWrapper}>
                  <TiptapRTE
                    value={
                      editingContent[card.id] !== undefined
                        ? editingContent[card.id]
                        : card.section_content || ""
                    }
                    onChange={(html) =>
                      setEditingContent((prev) => ({
                        ...prev,
                        [card.id]: html,
                      }))
                    }
                  />
                  <button
                    type="button"
                    className={styles.saveBtn}
                    onClick={() =>
                      handleContentSave(card.id, card.section_content)
                    }
                    disabled={savingId === card.id}
                  >
                    {savingId === card.id ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin" />
                        &nbsp; Saving...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk" />
                        &nbsp; Save Content
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div
                  className={styles.contentWrap}
                  dangerouslySetInnerHTML={{ __html: card.section_content }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuildDreamComp;
