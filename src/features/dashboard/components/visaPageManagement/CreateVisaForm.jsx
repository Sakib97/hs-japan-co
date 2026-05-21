import { Button } from "antd";
import { useState, useRef } from "react";
import styles from "./CreateVisaForm.module.css";
import HeroConfigSection from "./HeroConfigSection";
import EligibilitySection from "./EligibilitySection";
import ApplicationProcessSection from "./ApplicationProcessSection";
import RequiredDocSection from "./RequiredDocSection";
import { showToast } from "../../../../components/layout/CustomToast";
import { supabase } from "../../../../config/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { QK_VISA_PAGES } from "../../../../config/queryKeyConfig";

const getInitialState = () => ({
  hero: { title: "", subtitle: "", image: null, imageUrl: null },
  eligibility: {
    title: "",
    subtitle: "",
    subsections: [
      { icon: "fa-solid fa-graduation-cap", title: "", subtitle: "" },
    ],
  },
  applicationProcess: {
    title: "",
    subtitle: "",
    steps: [{ title: "", subtitle: "" }],
  },
  requiredDocs: {
    sectionTitle: "",
    sectionSubtitle: "",
    sideImage: null,
    sideImageUrl: null,
    documents: [{ title: "" }],
  },
});

const CreateVisaForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState(getInitialState);
  const [isPublishing, setIsPublishing] = useState(false);
  const queryClient = useQueryClient();

  const eligibilityRef = useRef(null);
  const applicationProcessRef = useRef(null);
  const requiredDocsRef = useRef(null);

  const heroComplete = !!formData.hero.pageId;

  // Calculate if each section's save draft button is disabled
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

  // Publish button is disabled if any section's save draft is disabled or hero is not complete
  const isPublishDisabled =
    !heroComplete ||
    isEligibilityDisabled ||
    isApplicationProcessDisabled ||
    isRequiredDocsDisabled;

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Save any sections whose data hasn't been persisted yet (upsert — safe to call even if already saved)
      const eligibilityOk = await eligibilityRef.current.saveDraft();
      if (!eligibilityOk) return;

      const applicationProcessOk =
        await applicationProcessRef.current.saveDraft();
      if (!applicationProcessOk) return;

      const requiredDocsOk = await requiredDocsRef.current.saveDraft();
      if (!requiredDocsOk) return;

      // All sections saved — update status to published
      const { error } = await supabase.rpc("publish_visa_page_draft", {
        p_page_id: formData.hero.pageId,
      });

      if (error) {
        showToast(error.message || "Failed to publish visa page.", "error");
        return;
      }

      queryClient.invalidateQueries({ queryKey: [QK_VISA_PAGES] });
      showToast("Visa page published successfully!", "success");
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
          <h1 className={styles.title}>Create New Visa Page</h1>
          <p className={styles.subtitle}>
            Architect a comprehensive visa{" "}
            <span className={styles.accent}>guidance experience</span> with
            modular content blocks.
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
            Publish Visa Page
          </Button>
        </div>
      </div>

      <HeroConfigSection
        data={formData.hero}
        onChange={(val) => setFormData((f) => ({ ...f, hero: val }))}
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
          Publish Visa Page
        </Button>
      </div>
    </div>
  );
};

export default CreateVisaForm;
