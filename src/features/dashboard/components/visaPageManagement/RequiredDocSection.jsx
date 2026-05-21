import { Input, Upload, Button } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useState, forwardRef, useImperativeHandle } from "react";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./RequiredDocSection.module.css";
import SaveDraftBtnComp from "./SaveDraftBtnComp";
import { showToast } from "../../../../components/layout/CustomToast";
import { supabase } from "../../../../config/supabaseClient";
import { uploadImage } from "../../../../utils/handleImage";
import { IMAGE_SIZES } from "../../../../config/imageSizeConfig";
import { QK_VISA_PAGES } from "../../../../config/queryKeyConfig";

const RequiredDocSection = forwardRef(
  ({ data, onChange, disabled, pageId }, ref) => {
    const sideImageConfig = IMAGE_SIZES.VISA_PAGE_OTHERS;

    const handleImageUpload = (file) => {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        showToast(
          "Only JPG and PNG images are allowed. Please select a valid image file.",
          "error",
        );
        return false;
      }

      // Validate file size
      if (file.size > sideImageConfig.maxBytes) {
        showToast(
          `Image size must not exceed ${sideImageConfig.label}.`,
          "error",
        );
        return false;
      }

      onChange({
        ...data,
        sideImage: file,
        sideImageUrl: URL.createObjectURL(file),
      });
      return false;
    };

    const addDocument = () => {
      onChange({
        ...data,
        documents: [...data.documents, { title: "" }],
      });
    };

    const updateDocument = (idx, value) => {
      onChange({
        ...data,
        documents: data.documents.map((d, i) =>
          i === idx ? { ...d, title: value } : d,
        ),
      });
    };

    const removeDocument = (idx) => {
      if (data.documents.length === 1) return;
      onChange({
        ...data,
        documents: data.documents.filter((_, i) => i !== idx),
      });
    };

    const queryClient = useQueryClient();
    const [draftSaving, setDraftSaving] = useState(false);

    // Calculate if save draft button should be disabled
    const isDraftDisabled =
      !data.sectionTitle?.trim() ||
      !data.sectionSubtitle?.trim() ||
      !data.sideImageUrl ||
      data.documents.length === 0 ||
      data.documents.some((d) => !d.title?.trim());

    const saveDraft = async () => {
      setDraftSaving(true);
      try {
        let uploadedImageUrl = data.sideImageUrl;

        // Upload image only if it's a new file (not a URL)
        if (data.sideImage && !data.sideImageUrl.startsWith("http")) {
          uploadedImageUrl = await uploadImage(
            data.sideImage,
            "combined_page_images",
            "visa_page",
          );
        }

        const { error } = await supabase.rpc(
          "save_visa_page_required_docs_draft",
          {
            p_page_id: pageId,
            p_section_title: data.sectionTitle.trim(),
            p_section_subtitle: data.sectionSubtitle.trim(),
            p_side_image_url: uploadedImageUrl,
            p_side_image_size: `${(data.sideImage.size / 1024).toFixed(0)} KB`,
            p_documents: data.documents.map((d, i) => ({
              title: d.title.trim(),
              order: i,
            })),
          },
        );

        if (error) {
          showToast(
            error.message || "Failed to save required docs draft.",
            "error",
          );
          return false;
        }

        queryClient.invalidateQueries({ queryKey: [QK_VISA_PAGES] });
        showToast("Required documentation saved successfully!", "success");
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
            <i className="fi fi-rr-folder-open"></i>
          </span>
          <h2 className={styles.sectionTitle}>Required Documentation</h2>
        </div>

        <div className={styles.grid}>
          <div className={styles.imageCol}>
            <label className={styles.label}>
              SIDE IMAGE <span className={styles.req}>*</span>
            </label>
            <div
              style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}
            >
              <div>Recommended: 400×500px</div>
              <div>Max file size: {sideImageConfig.label}</div>
            </div>
            <Upload.Dragger
              accept=".jpg,.jpeg,.png"
              maxCount={1}
              showUploadList={false}
              beforeUpload={handleImageUpload}
              className={styles.imageUpload}
            >
              {data.sideImageUrl ? (
                <img
                  src={data.sideImageUrl}
                  alt="side"
                  className={styles.previewImg}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <i className="fi fi-rr-picture"></i>
                  <span>Upload</span>
                </div>
              )}
            </Upload.Dragger>
          </div>

          <div className={styles.contentCol}>
            <div className={styles.topRow}>
              <div className={styles.field}>
                <label className={styles.label}>
                  SECTION TITLE <span className={styles.req}>*</span>
                </label>
                <Input
                  placeholder="Supporting Evidence"
                  value={data.sectionTitle}
                  onChange={(e) =>
                    onChange({ ...data, sectionTitle: e.target.value })
                  }
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  SECTION SUBTITLE <span className={styles.req}>*</span>
                </label>
                <Input
                  placeholder="Documents you need to prepare for your visa application"
                  value={data.sectionSubtitle}
                  onChange={(e) =>
                    onChange({ ...data, sectionSubtitle: e.target.value })
                  }
                />
              </div>
            </div>

            <label className={styles.checklistLabel}>DOCUMENT CHECKLIST</label>
            <div className={styles.docList}>
              {data.documents.map((doc, idx) => (
                <div key={idx} className={styles.docItem}>
                  <i
                    className="fi fi-rs-check-circle"
                    style={{
                      color: "#b91c1c",
                      flexShrink: 0,
                      fontSize: "18px",
                      marginRight: "8px",
                    }}
                  ></i>
                  <Input
                    placeholder="Add Document Title..."
                    value={doc.title}
                    onChange={(e) => updateDocument(idx, e.target.value)}
                    variant="borderless"
                    className={styles.docInput}
                  />
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeDocument(idx)}
                    disabled={data.documents.length === 1}
                  />
                </div>
              ))}
            </div>

            <Button
              type="link"
              icon={<PlusCircleOutlined />}
              onClick={addDocument}
              className={styles.addBtn}
            >
              ADD NEW DOCUMENT FIELD
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

export default RequiredDocSection;
