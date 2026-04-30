import { useRef, useState } from "react";
import { showToast } from "../../../components/layout/CustomToast";
import { replaceImage } from "../../../utils/handleImage";
import TiptapRTE from "../../../components/layout/TiptapRTE";
import { IMAGE_SIZES } from "../../../config/imageSizeConfig";
import styles from "../styles/ChairmanComp.module.css";
import { supabase } from "../../../config/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { QK_ABOUT_PAGE } from "../../../config/queryKeyConfig";

const BUCKET = "combined_page_images";
const FOLDER = "about_page";

const ChairmanComp = ({ isEditMode, data = [] }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [savingChairman, setSavingChairman] = useState(false);
  const [savingFeatures, setSavingFeatures] = useState(false);
  const [chairmanContent, setChairmanContent] = useState(null);
  const [featuresContent, setFeaturesContent] = useState(null);

  const chairmanSection = data.find(
    (d) => d.section_name === "chairman_section",
  );
  const featuresSection = data.find(
    (d) => d.section_name === "features_section",
  );

  const imgSrc = chairmanSection?.section_image_url;

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file.", "error");
      return;
    }
    if (file.size > IMAGE_SIZES.ABOUT_PAGE.maxBytes) {
      showToast(
        `Image must be smaller than ${IMAGE_SIZES.ABOUT_PAGE.label}.`,
        "error",
      );
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await replaceImage(
        file,
        BUCKET,
        FOLDER,
        chairmanSection?.section_image_url,
      );
      const { error } = await supabase
        .from("about_page")
        .update({ section_image_url: publicUrl, image_size: file.size })
        .eq("section_name", "chairman_section");
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: [QK_ABOUT_PAGE] });
      showToast("Image updated successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update image.", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleChairmanContentSave = async () => {
    if (chairmanContent === null) return;
    setSavingChairman(true);
    try {
      const { error } = await supabase
        .from("about_page")
        .update({ section_content: chairmanContent })
        .eq("section_name", "chairman_section");
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: [QK_ABOUT_PAGE] });
      showToast("Chairman content updated!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update content.", "error");
    } finally {
      setSavingChairman(false);
    }
  };

  const handleFeaturesContentSave = async () => {
    if (featuresContent === null) return;
    setSavingFeatures(true);
    try {
      const { error } = await supabase
        .from("about_page")
        .update({ section_content: featuresContent })
        .eq("section_name", "features_section");
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: [QK_ABOUT_PAGE] });
      showToast("Features content updated!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update content.", "error");
    } finally {
      setSavingFeatures(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Chairman Bio Section */}
      <div className={styles.bioSection}>
        <div className={styles.photoWrapper}>
          <img src={imgSrc} alt="Chairman" className={styles.photo} />
          {isEditMode && (
            <>
              <button
                type="button"
                className={styles.imageEditOverlay}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Change chairman photo"
              >
                {uploading ? (
                  <i className="fa-solid fa-spinner fa-spin" />
                ) : (
                  <i className="fa-solid fa-pen-to-square" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.hiddenInput}
                onChange={handleImageChange}
              />
            </>
          )}
        </div>
        <div className={styles.bioContent}>
          {isEditMode ? (
            <div className={styles.rteWrapper}>
              <TiptapRTE
                value={chairmanSection?.section_content || ""}
                onChange={(html) => setChairmanContent(html)}
              />
              <button
                type="button"
                className={styles.saveBtn}
                onClick={handleChairmanContentSave}
                disabled={savingChairman || chairmanContent === null}
              >
                {savingChairman ? (
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
          ) : chairmanSection?.section_content ? (
            <div
              className={styles.bioHtml}
              dangerouslySetInnerHTML={{
                __html: chairmanSection.section_content,
              }}
            />
          ) : (
            <>
              <p>Connection timed out. Please try again later.</p>
            </>
          )}
        </div>
      </div>

      {/* School Features Section */}
      <div className={styles.featuresSection}>
        {isEditMode ? (
          <div className={styles.rteWrapper}>
            <TiptapRTE
              value={featuresSection?.section_content || ""}
              onChange={(html) => setFeaturesContent(html)}
            />
            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleFeaturesContentSave}
              disabled={savingFeatures || featuresContent === null}
            >
              {savingFeatures ? (
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
        ) : featuresSection?.section_content ? (
          <div
            className={styles.featuresHtml}
            dangerouslySetInnerHTML={{
              __html: featuresSection.section_content,
            }}
          />
        ) : (
          <>
            <p>Connection timed out. Please try again later.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ChairmanComp;
