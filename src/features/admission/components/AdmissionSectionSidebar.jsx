import { useState } from "react";
import { Input } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import FAIconPicker from "../../../components/common/FAIconPicker";
import { supabase } from "../../../config/supabaseClient";
import { showToast } from "../../../components/layout/CustomToast";
import { QK_ADMISSION_PAGE } from "../../../config/queryKeyConfig";
import {
  getSidebarList,
  buildSidebarPayload,
  getSidebarMeta,
  saveAdmissionSection,
} from "../utils/admissionPageUtils";
import editStyles from "../styles/AdmissionEditShared.module.css";

const AdmissionSectionSidebar = ({
  isEditMode,
  data,
  sectionKey,
  defaultTitle,
  defaultItems,
  styles,
  showMediaFields = false,
  defaultSidebarImage = null,
}) => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(null);
  const [sidebarTitleDraft, setSidebarTitleDraft] = useState(null);
  const [itemLabels, setItemLabels] = useState({});
  const [mediaDraft, setMediaDraft] = useState(null);

  const sidebarTitle =
    sidebarTitleDraft ?? data?.sidebar_title ?? defaultTitle;
  const items = getSidebarList(data?.sidebar_items, defaultItems);
  const meta = getSidebarMeta(data?.sidebar_items);
  const media = mediaDraft ?? meta;
  const sidebarImage = media.sidebarImage ?? defaultSidebarImage;

  const persistSidebar = async (payload, message) => {
    setSaving("sidebar");
    try {
      await saveAdmissionSection(supabase, sectionKey, payload);
      await queryClient.invalidateQueries({ queryKey: [QK_ADMISSION_PAGE] });
      showToast(message, "success");
    } catch (err) {
      showToast(err.message || "Failed to update.", "error");
    } finally {
      setSaving(null);
    }
  };

  const handleSidebarTitleSave = () => {
    persistSidebar(
      { sidebar_title: sidebarTitle.trim() },
      "Sidebar title updated.",
    );
  };

  const handleItemIconChange = async (index, icon) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, icon } : item,
    );
    await persistSidebar(
      {
        sidebar_items: buildSidebarPayload(
          next,
          showMediaFields ? media : undefined,
        ),
      },
      "Icon updated.",
    );
  };

  const handleItemLabelSave = (index) => {
    const label =
      itemLabels[index] !== undefined
        ? itemLabels[index]
        : items[index]?.label;
    if (!label?.trim()) {
      showToast("Label cannot be empty.", "error");
      return;
    }
    const next = items.map((item, i) =>
      i === index ? { ...item, label: label.trim() } : item,
    );
    persistSidebar(
      {
        sidebar_items: buildSidebarPayload(
          next,
          showMediaFields ? media : undefined,
        ),
      },
      "Sidebar item updated.",
    );
  };

  const handleMediaSave = () => {
    persistSidebar(
      {
        sidebar_items: buildSidebarPayload(items, media),
      },
      "Media links updated.",
    );
  };

  return (
    <div className={styles.sidebar}>
      {isEditMode ? (
        <div className={editStyles.editRow}>
          <Input
            className={editStyles.sidebarTitleInput}
            value={sidebarTitle}
            onChange={(e) => setSidebarTitleDraft(e.target.value)}
            placeholder="Sidebar title"
          />
          <button
            type="button"
            className={editStyles.tickBtn}
            onClick={handleSidebarTitleSave}
            disabled={saving === "sidebar"}
            title="Save sidebar title"
          >
            {saving === "sidebar" ? (
              <i className="fa-solid fa-spinner fa-spin" />
            ) : (
              <i className="fa-solid fa-check" />
            )}
          </button>
        </div>
      ) : (
        <h4 className={styles.sidebarTitle}>{sidebarTitle}</h4>
      )}

      <ul className={styles.resourceList}>
        {items.map((item, index) => (
          <li key={index} className={styles.resourceItem}>
            {isEditMode ? (
              <>
                <FAIconPicker
                  value={item.icon}
                  onChange={(icon) => 
                    handleItemIconChange(index, icon)}
                >
                  <span
                    className={editStyles.iconEditable}
                    title="Change icon"
                  >
                    <i className={item.icon} />
                    <span className={editStyles.iconEditHint}>
                      <i style={{ fontSize: "0.85rem" }} className="fa-solid fa-pen-to-square" />
                    </span>
                  </span>
                </FAIconPicker>
                <div className={editStyles.editRow}>
                  <Input
                    className={editStyles.itemLabelInput}
                    value={
                      itemLabels[index] !== undefined
                        ? itemLabels[index]
                        : item.label
                    }
                    onChange={(e) =>
                      setItemLabels((prev) => ({
                        ...prev,
                        [index]: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    className={editStyles.tickBtn}
                    onClick={() => handleItemLabelSave(index)}
                    disabled={saving === "sidebar"}
                    title="Save label"
                  >
                    <i style={{ color: "#fff" }} className="fa-solid fa-check" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <i className={item.icon} />
                <span>{item.label}</span>
              </>
            )}
          </li>
        ))}
      </ul>

      {isEditMode && showMediaFields && (
        <div className={editStyles.mediaEditBlock}>
          <p className={editStyles.mediaLabel}>Video URL</p>
          <Input
            value={media.videoUrl ?? ""}
            onChange={(e) =>
              setMediaDraft((prev) => ({
                ...(prev ?? meta),
                videoUrl: e.target.value,
              }))
            }
            placeholder="https://youtu.be/..."
          />
          {/* <p className={editStyles.mediaLabel}>Sidebar image URL</p> */}
          {/* <Input
            value={media.sidebarImage ?? ""}
            onChange={(e) =>
              setMediaDraft((prev) => ({
                ...(prev ?? meta),
                sidebarImage: e.target.value,
              }))
            }
            placeholder="https://..."
          /> */}
          <button
            type="button"
            className={editStyles.saveBtn}
            onClick={handleMediaSave}
            disabled={saving === "sidebar"}
          >
            {saving === "sidebar" ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" /> Saving...
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk" /> Save Media Links
              </>
            )}
          </button>
        </div>
      )}
      {/* {showMediaFields && !isEditMode && sidebarImage && (
        <div className={styles.sidebarImage}>
          <img src={sidebarImage} alt="" className={styles.sideImage} />
        </div>
      )} */}
    </div>
  );
};

export default AdmissionSectionSidebar;
