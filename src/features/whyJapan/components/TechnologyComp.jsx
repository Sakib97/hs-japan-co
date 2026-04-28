import { useRef, useState } from "react";
import styles from "../styles/TechnologyComp.module.css";
import TiptapRTE from "../../../components/layout/TiptapRTE";
import { supabase } from "../../../config/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { replaceImage } from "../../../utils/handleImage";
import { showToast } from "../../../components/layout/CustomToast";
import { IMAGE_SIZES } from "../../../config/imageSizeConfig";

const BUCKET = "combined_page_images";
const FOLDER = "why_japan_page";

const TechnologyComp = ({ isEditMode, data }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editContent, setEditContent] = useState(null);

  const imgSrc =
    data?.section_image_link ||
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=350&fit=crop";
  const text =
    data?.section_content ||
    "Japan has long been known as a world leader in technology. One of the biggest advantages of going to Japan for your work or for your education is that you get access to advanced technology. The country makes some of the most advanced products in the world. Also, their scientific research is among the best in the world. So you can get a lot of experience and learn a lot while you are in Japan.";

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file.", "error");
      return;
    }
    if (file.size > IMAGE_SIZES.WHY_JAPAN_PAGE.maxBytes) {
      showToast(
        `Image must be smaller than ${IMAGE_SIZES.WHY_JAPAN_PAGE.label}.`,
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
        data?.section_image_link,
      );
      const { error } = await supabase
        .from("why_japan_page")
        .update({ section_image_link: publicUrl, image_size: file.size })
        .eq("section_name", "advanced_technology");
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["why-japan-page"] });
      showToast("Image updated successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update image.", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleContentSave = async () => {
    if (editContent === null) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("why_japan_page")
        .update({ section_content: editContent })
        .eq("section_name", "advanced_technology");
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["why-japan-page"] });
      showToast("Content updated successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update content.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.content}>
            {/* <h2 className={styles.heading}>Access to Advanced Technology</h2> */}
            {isEditMode ? (
              <div className={styles.rteWrapper}>
                <TiptapRTE
                  value={data?.section_content || text}
                  onChange={(html) => setEditContent(html)}
                />
                <button
                  type="button"
                  className={styles.saveBtn}
                  onClick={handleContentSave}
                  disabled={saving || editContent === null}
                >
                  {saving ? (
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
                className={styles.text}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>
          <div className={styles.imageWrapper}>
            <img
              src={imgSrc}
              alt="Tokyo night cityscape"
              className={styles.image}
            />
            {isEditMode && (
              <>
                <button
                  type="button"
                  className={styles.imageEditOverlay}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  title="Change image"
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
        </div>
      </div>
    </section>
  );
};

export default TechnologyComp;
