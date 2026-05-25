import { Input, Upload } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import styles from "./HeroConfigSection.module.css";
import SaveDraftBtnComp from "./SaveDraftBtnComp";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IMAGE_SIZES } from "../../../../config/imageSizeConfig";
import { slugify } from "../../../../utils/slugAndString";
import { VISA_PAGE_STATUS } from "../../../../config/statusAndRoleConfig";
import { useAuth } from "../../../../context/AuthProvider";
import { uploadImage, replaceImage } from "../../../../utils/handleImage";
import { showToast } from "../../../../components/layout/CustomToast";
import { supabase } from "../../../../config/supabaseClient";
import {
  QK_VISA_PAGES,
  QK_VISA_PAGE_FULL,
  QK_VISA_PAGE_BY_SLUG,
  QK_PUBLISHED_VISA_PAGES,
} from "../../../../config/queryKeyConfig";

const { TextArea } = Input;
const { Dragger } = Upload;
const heroImageConfig = IMAGE_SIZES.VISA_PAGE_HERO;

const HeroConfigSection = ({ data, onChange, isEdit = false }) => {
  const { userMeta } = useAuth();
  const userMail = userMeta?.email || "unknown";
  const queryClient = useQueryClient();
  const [draftSaving, setDraftSaving] = useState(false);

  const isDraftDisabled =
    !data.title?.trim() || !data.subtitle?.trim() || !data.imageUrl;

  const saveDraft = async () => {
    setDraftSaving(true);
    try {
      const slug = slugify(data.title.trim());

      // STEP 1: Validate slug & title (only for new pages, not edits)
      if (!isEdit) {
        const { error: validationError } = await supabase.rpc(
          "validate_visa_page",
          {
            // p_page_id: data.pageId || null,
            p_slug: slug,
            p_title: data.title.trim(),
          },
        );

        if (validationError) {
          if (validationError.message?.includes("SLUG_EXISTS")) {
            showToast("A visa page with this title already exists.", "error");
          } else if (validationError.message?.includes("TITLE_EXISTS")) {
            showToast(
              "A hero section with this title already exists.",
              "error",
            );
          } else {
            showToast(validationError.message || "Validation failed.", "error");
          }
          return;
        }
      }

      // STEP 2: Upload image if a new file was selected
      let uploadedUrl = data.imageUrl?.startsWith("http")
        ? data.imageUrl
        : null;

      if (data.image) {
        // prevImageUrl holds the original storage URL before the blob URL overwrote imageUrl
        let oldUrl = data.prevImageUrl || null;

        // Fallback: fetch from DB if we have a pageId but prevImageUrl wasn't tracked
        if (!oldUrl && data.pageId) {
          const { data: heroRow } = await supabase
            .from("visa_page_hero")
            .select("image_url")
            .eq("page_id", data.pageId)
            .single();
          oldUrl = heroRow?.image_url || null;
        }

        if (oldUrl) {
          uploadedUrl = await replaceImage(
            data.image,
            "combined_page_images",
            "visa_page",
            oldUrl,
          );
        } else {
          uploadedUrl = await uploadImage(
            data.image,
            "combined_page_images",
            "visa_page",
          );
        }
      }

      // STEP 3: Save to database
      //   const imageSize = data.image
      //     ? `${(data.image.size / 1024).toFixed(0)} KB`
      //     : data.imageSize || "";

      // image size in bytes for DB storage
      const imageSize = data.image
        ? data.image.size
        : data.imageSize
          ? data.imageSize
          : null;

      const { data: result, error } = await supabase.rpc(
        "save_visa_page_hero_draft",
        {
          p_page_id: data.pageId || null,
          p_slug: slug,
          p_title: data.title.trim(),
          p_subtitle: data.subtitle.trim(),
          p_image_url: uploadedUrl,
          p_image_size: imageSize,
          p_primary_button_text: data.primaryButtonLabel?.trim() || null,
          p_primary_button_url: data.primaryButtonUrl?.trim() || null,
          p_created_by: userMail,
        },
      );

      if (error) {
        if (error.code === "23505") {
          showToast(
            "A visa page with this title already exists. Please choose a different title.",
            "error",
          );
        } else {
          showToast(error.message || "Failed to save draft.", "error");
        }
        return;
      }

      queryClient.invalidateQueries({ queryKey: [QK_VISA_PAGES] });
      queryClient.invalidateQueries({ queryKey: [QK_VISA_PAGE_FULL, result] });
      queryClient.invalidateQueries({ queryKey: [QK_VISA_PAGE_BY_SLUG] });
      queryClient.invalidateQueries({ queryKey: [QK_PUBLISHED_VISA_PAGES] });
      showToast("Hero section draft saved successfully!", "success");
      // Reset image state: store the final storage URL, clear the pending file and prevImageUrl
      onChange({
        ...data,
        pageId: result,
        imageUrl: uploadedUrl,
        image: null,
        prevImageUrl: null,
      });
    } catch (err) {
      showToast(err.message || "An unexpected error occurred.", "error");
    } finally {
      setDraftSaving(false);
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.iconWrap}>
          <i className="fi fi-rr-graduation-cap"></i>
        </span>
        <div>
          <h2 className={styles.sectionTitle}>Hero Configuration</h2>
          <span className={styles.sectionSubtitle}>
            ** You must fill up this section AND "Save Draft" first to proceed
            with other sections.
          </span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.field}>
            <label className={styles.label}>
              HERO TITLE <span className={styles.req}>*</span>
            </label>
            <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
              ** This title will be used for URL{" "}
              {data.title && <> : /visa/{slugify(data.title)}</>} **
            </span>
            <Input
              placeholder="e.g. Student Visa"
              value={data.title}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              HERO SUBTITLE <span className={styles.req}>*</span>
            </label>
            <TextArea
              rows={4}
              placeholder="Define the core value proposition and primary eligibility criteria for this visa category."
              value={data.subtitle}
              onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              PRIMARY BUTTON LABEL (OPTIONAL)
            </label>
            <Input
              placeholder="e.g. Apply Now"
              value={data.primaryButtonLabel}
              onChange={(e) =>
                onChange({ ...data, primaryButtonLabel: e.target.value })
              }
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              PRIMARY BUTTON URL (OPTIONAL)
            </label>
            <Input
              placeholder="e.g. /apply-now"
              value={data.primaryButtonUrl}
              onChange={(e) =>
                onChange({ ...data, primaryButtonUrl: e.target.value })
              }
            />
          </div>
        </div>

        <div className={styles.right}>
          <label className={styles.label}>
            UPLOAD HERO IMAGE <span className={styles.req}>*</span>
          </label>
          <p className={styles.draggerHint}>
            Supported format: JPG/PNG (Max: {heroImageConfig.label})
            <br />
            Recommended: 1920×1080px
          </p>

          <Dragger
            accept=".jpg,.jpeg,.png"
            maxCount={1}
            showUploadList={false}
            beforeUpload={(file) => {
              const isImage =
                file.type === "image/jpeg" || file.type === "image/png";
              if (!isImage) {
                showToast("Only JPG/PNG image files are allowed.", "error");
                return Upload.LIST_IGNORE;
              }
              if (file.size > heroImageConfig.maxBytes) {
                showToast(
                  `Image exceeds the maximum allowed size of ${heroImageConfig.label}.`,
                  "error",
                );
                return Upload.LIST_IGNORE;
              }
              onChange({
                ...data,
                image: file,
                // Preserve the original storage URL before overwriting with blob URL
                prevImageUrl: data.imageUrl?.startsWith("http")
                  ? data.imageUrl
                  : data.prevImageUrl || null,
                imageUrl: URL.createObjectURL(file),
              });
              return false;
            }}
            className={styles.dragger}
          >
            {data.imageUrl ? (
              <img
                src={data.imageUrl}
                alt="hero"
                className={styles.previewImg}
              />
            ) : (
              <>
                <p className={styles.draggerIcon}>
                  <CloudUploadOutlined />
                </p>
                <p className={styles.draggerText}>
                  Drag and drop high-resolution JPG/PNG (Max:{" "}
                  {heroImageConfig.label})
                </p>
                <p className={styles.draggerHint}>Recommended: 1920×1080px</p>
              </>
            )}
          </Dragger>
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
};

export default HeroConfigSection;
