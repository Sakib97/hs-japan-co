import { useState } from "react";
import { Skeleton, Input } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "../styles/AdmissionPage.module.css";
import editStyles from "../styles/AdmissionEditShared.module.css";
import AdmissionBannerComp from "../components/AdmissionBannerComp";
import AdmissionAboutComp from "../components/AdmissionAboutComp";
import AdmissionSchoolComp from "../components/AdmissionSchoolComp";
import AdmissionSSWComp from "../components/AdmissionSSWComp";
import EditModeToggleBtn from "../../../components/common/EditModeToggleBtn";
import { useAuth } from "../../../context/AuthProvider";
import { supabase } from "../../../config/supabaseClient";
import { QK_ADMISSION_PAGE } from "../../../config/queryKeyConfig";
import { showToast } from "../../../components/layout/CustomToast";
import {
  ADMISSION_SECTION_KEYS,
  findAdmissionSection,
  saveAdmissionSection,
} from "../utils/admissionPageUtils";
import { ADMISSION_DEFAULTS } from "../components/AdmissionSectionContent";

const AdmissionPage = () => {
  const { user, userMeta } = useAuth();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [headingDraft, setHeadingDraft] = useState(null);
  const [savingHeading, setSavingHeading] = useState(false);

  const { data: pageData = [], isLoading } = useQuery({
    queryKey: [QK_ADMISSION_PAGE],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admission_page")
        .select(
          "id, section_key, section_title, section_content, sidebar_title, sidebar_items",
        )
        .order("id", { ascending: true });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const bannerData = findAdmissionSection(
    pageData,
    ADMISSION_SECTION_KEYS.BANNER,
  );
  const headingData = findAdmissionSection(
    pageData,
    ADMISSION_SECTION_KEYS.PAGE_HEADING,
  );
  const aboutData = findAdmissionSection(
    pageData,
    ADMISSION_SECTION_KEYS.ABOUT_ACADEMIC,
  );
  const schoolData = findAdmissionSection(
    pageData,
    ADMISSION_SECTION_KEYS.LANGUAGE_SCHOOL,
  );
  const sswData = findAdmissionSection(pageData, ADMISSION_SECTION_KEYS.SSW);

  const pageHeading =
    headingDraft ??
    headingData?.section_title ??
    ADMISSION_DEFAULTS.page_heading.title;

  const handleHeadingSave = async () => {
    if (!pageHeading.trim()) {
      showToast("Heading cannot be empty.", "error");
      return;
    }
    setSavingHeading(true);
    try {
      await saveAdmissionSection(
        supabase,
        ADMISSION_SECTION_KEYS.PAGE_HEADING,
        { section_title: pageHeading.trim() },
      );
      await queryClient.invalidateQueries({ queryKey: [QK_ADMISSION_PAGE] });
      showToast("Page heading updated.", "success");
    } catch (err) {
      showToast(err.message || "Failed to update heading.", "error");
    } finally {
      setSavingHeading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page} style={{ padding: "120px 10vw 4rem" }}>
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {user && userMeta?.role === "admin" && (
        <EditModeToggleBtn
          isEditMode={isEditMode}
          onToggle={() => setIsEditMode(!isEditMode)}
        />
      )}

      <AdmissionBannerComp isEditMode={isEditMode} data={bannerData} />

      <div style={{ textAlign: "center", padding: "50px 20px 0" }}>
        {isEditMode ? (
          <div
            className={editStyles.editRow}
            style={{ justifyContent: "center", maxWidth: 720, margin: "0 auto" }}
          >
            <Input
              value={pageHeading}
              onChange={(e) => setHeadingDraft(e.target.value)}
              placeholder="Page heading"
              style={{ maxWidth: 520 }}
            />
            <button
              type="button"
              className={editStyles.tickBtn}
              onClick={handleHeadingSave}
              disabled={savingHeading}
              title="Save heading"
            >
              {savingHeading ? (
                <i className="fa-solid fa-spinner fa-spin" />
              ) : (
                <i className="fa-solid fa-check" />
              )}
            </button>
          </div>
        ) : (
          <h2 className={styles.sectionHeading}>{pageHeading}</h2>
        )}
      </div>

      <AdmissionAboutComp isEditMode={isEditMode} data={aboutData} />
      <hr className={styles.divider} />
      <AdmissionSchoolComp isEditMode={isEditMode} data={schoolData} />
      <hr className={styles.divider} />
      <AdmissionSSWComp isEditMode={isEditMode} data={sswData} />
    </div>
  );
};

export default AdmissionPage;
