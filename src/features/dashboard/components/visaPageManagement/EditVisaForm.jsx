import { Button, Skeleton } from "antd";
import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import {
  QK_VISA_PAGES,
  QK_VISA_PAGE_FULL,
  QK_VISA_PAGE_BY_SLUG,
  QK_PUBLISHED_VISA_PAGES,
} from "../../../../config/queryKeyConfig";
import { showToast } from "../../../../components/layout/CustomToast";
import styles from "./CreateVisaForm.module.css";
import HeroConfigSection from "./HeroConfigSection";
import EligibilitySection from "./EligibilitySection";
import ApplicationProcessSection from "./ApplicationProcessSection";
import RequiredDocSection from "./RequiredDocSection";

// ─── Map DB response → formData shape ─────────────────────────────────────────
const mapToFormData = (d) => ({
  hero: {
    pageId: d.page.id,
    title: d.hero?.title || "",
    subtitle: d.hero?.subtitle || "",
    image: null,
    imageUrl: d.hero?.image_url || null,
    imageSize: d.hero?.image_size || "",
    primaryButtonLabel: d.hero?.primary_button_text || "",
    primaryButtonUrl: d.hero?.primary_button_url || "",
  },
  eligibility: {
    title: d.eligibility_section?.title || "",
    subtitle: d.eligibility_section?.subtitle || "",
    subsections:
      d.eligibility_subsections?.length > 0
        ? d.eligibility_subsections.map((s) => ({
            icon: s.icon || "fa-solid fa-graduation-cap",
            title: s.title || "",
            subtitle: s.subtitle || "",
          }))
        : [{ icon: "fa-solid fa-graduation-cap", title: "", subtitle: "" }],
  },
  applicationProcess: {
    title: d.application_process_section?.title || "",
    subtitle: d.application_process_section?.subtitle || "",
    steps:
      d.application_steps?.length > 0
        ? d.application_steps.map((s) => ({
            title: s.title || "",
            subtitle: s.subtitle || "",
          }))
        : [{ title: "", subtitle: "" }],
  },
  requiredDocs: {
    sectionTitle: d.required_docs_section?.title || "",
    sectionSubtitle: d.required_docs_section?.subtitle || "",
    sideImage: null,
    sideImageUrl: d.side_image?.image_url || null,
    sideImageSize: d.side_image?.image_size || "",
    documents:
      d.documents?.length > 0
        ? d.documents.map((doc) => ({ title: doc.title || "" }))
        : [{ title: "" }],
  },
});

// ─── Inner form (receives pre-loaded data, initialises state once) ─────────────
const EditVisaFormInner = ({ initialData, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState(() => mapToFormData(initialData));
  const [isPublishing, setIsPublishing] = useState(false);
  const queryClient = useQueryClient();

  const eligibilityRef = useRef(null);
  const applicationProcessRef = useRef(null);
  const requiredDocsRef = useRef(null);

  const heroComplete = !!formData.hero.pageId;

  const isEligibilityDisabled =
    !formData.eligibility.title?.trim() ||
    !formData.eligibility.subtitle?.trim() ||
    formData.eligibility.subsections.some(
      (s) => !s.title?.trim() || !s.subtitle?.trim(),
    );

  const isApplicationProcessDisabled =
    !formData.applicationProcess.title?.trim() ||
    !formData.applicationProcess.subtitle?.trim() ||
    formData.applicationProcess.steps.some(
      (s) => !s.title?.trim() || !s.subtitle?.trim(),
    );

  const isRequiredDocsDisabled =
    !formData.requiredDocs.sectionTitle?.trim() ||
    !formData.requiredDocs.sectionSubtitle?.trim() ||
    !formData.requiredDocs.sideImageUrl ||
    formData.requiredDocs.documents.length === 0 ||
    formData.requiredDocs.documents.some((d) => !d.title?.trim());

  const isPublishDisabled =
    !heroComplete ||
    isEligibilityDisabled ||
    isApplicationProcessDisabled ||
    isRequiredDocsDisabled;

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const eligibilityOk = await eligibilityRef.current.saveDraft();
      if (!eligibilityOk) return;

      const applicationProcessOk =
        await applicationProcessRef.current.saveDraft();
      if (!applicationProcessOk) return;

      const requiredDocsOk = await requiredDocsRef.current.saveDraft();
      if (!requiredDocsOk) return;

      const { error } = await supabase.rpc("publish_visa_page_draft", {
        p_page_id: formData.hero.pageId,
      });

      if (error) {
        showToast(error.message || "Failed to publish visa page.", "error");
        return;
      }

      queryClient.invalidateQueries({ queryKey: [QK_VISA_PAGES] });
      queryClient.invalidateQueries({
        queryKey: [QK_VISA_PAGE_FULL, formData.hero.pageId],
      });
      queryClient.invalidateQueries({ queryKey: [QK_VISA_PAGE_BY_SLUG] });
      queryClient.invalidateQueries({ queryKey: [QK_PUBLISHED_VISA_PAGES] });
      showToast("Visa page updated and published!", "success");
      if (onSuccess) onSuccess();
    } catch (err) {
      showToast(err.message || "An unexpected error occurred.", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Edit Visa Page</h1>
          <p className={styles.subtitle}>
            Update the content blocks for this{" "}
            <span className={styles.accent}>visa guidance page</span>.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            className={styles.publishBtn}
            onClick={handlePublish}
            loading={isPublishing}
            disabled={isPublishDisabled}
          >
            Publish Changes
          </Button>
        </div>
      </div>

      <HeroConfigSection
        data={formData.hero}
        onChange={(val) => setFormData((f) => ({ ...f, hero: val }))}
        isEdit
      />
      <EligibilitySection
        ref={eligibilityRef}
        data={formData.eligibility}
        onChange={(val) => setFormData((f) => ({ ...f, eligibility: val }))}
        disabled={!heroComplete}
        pageId={formData.hero.pageId}
      />
      <ApplicationProcessSection
        ref={applicationProcessRef}
        data={formData.applicationProcess}
        onChange={(val) =>
          setFormData((f) => ({ ...f, applicationProcess: val }))
        }
        disabled={!heroComplete}
        pageId={formData.hero.pageId}
      />
      <RequiredDocSection
        ref={requiredDocsRef}
        data={formData.requiredDocs}
        onChange={(val) => setFormData((f) => ({ ...f, requiredDocs: val }))}
        disabled={!heroComplete}
        pageId={formData.hero.pageId}
      />

      <div className={styles.footer}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          type="primary"
          className={styles.publishBtn}
          onClick={handlePublish}
          loading={isPublishing}
          disabled={isPublishDisabled}
        >
          Publish Changes
        </Button>
      </div>
    </div>
  );
};

// ─── Outer loader — fetches data, then renders inner form ──────────────────────
const EditVisaForm = ({ pageId, onCancel, onSuccess }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QK_VISA_PAGE_FULL, pageId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_visa_page_full", {
        p_page_id: pageId,
      });
      if (error) throw error;
      return data;
    },
    staleTime: 20 * 60 * 1000, // 20 mins - avoid refetching while editing
  });

  if (isLoading) {
    return (
      <div style={{ padding: "2rem" }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        Failed to load visa page data. Please try again.
      </div>
    );
  }

  return (
    <EditVisaFormInner
      initialData={data}
      onCancel={onCancel}
      onSuccess={onSuccess}
    />
  );
};

export default EditVisaForm;
