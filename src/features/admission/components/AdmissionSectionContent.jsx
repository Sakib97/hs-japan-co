import { useState } from "react";
import { Input } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import TiptapRTE from "../../../components/layout/TiptapRTE";
import { supabase } from "../../../config/supabaseClient";
import { showToast } from "../../../components/layout/CustomToast";
import { QK_ADMISSION_PAGE } from "../../../config/queryKeyConfig";
import { saveAdmissionSection } from "../utils/admissionPageUtils";
import editStyles from "../styles/AdmissionEditShared.module.css";

const DEFAULT_ABOUT_CONTENT = `<p>Students can apply any time during the year. There is no application deadline for the Japanese Language Course. A member of HS Japan Academy Student Recruitment Team will assist you to complete your admission application. We aim to make your admissions process as simple and easy as possible.</p><p>Students have to submit all necessary academic documents to our office or may email scanned copies of these to our mail. Students will be informed about their eligibility for being admitted once these documents have been scrutinized and evaluated.</p>`;

const DEFAULT_SCHOOL_CONTENT = `<p>Each Japanese Language School has their own atmosphere and course structure, so you need to find a school that fits your study style. At HS Japan Academy we work closely with all our partner schools to make sure that we find the right school for you based on your language level, study habits and which city you want to study in.</p><p>In Japan there are 4 intakes in a year for the Japanese Language School program — January, April, July and October. Deadlines can be earlier or at a later time depending on when the school reaches its maximum student limit. We always suggest applying early so you can secure a spot at your preferred school.</p>`;

const DEFAULT_SSW_CONTENT = `<p>The purpose of the Japan training visa is to allow an applicant from any country to come to Japan under Technical Intern Training Program and train in an implementing organization in order to acquire technology, skills, and knowledge. Upon return from Japan, participants are expected to utilize their newly learned technology, skills, and knowledge in their home countries.</p><p>Trainees are able to choose from 137 jobs in 77 categories. For example, agriculture, construction and machinery work, food processing, etc. We have vast connections with Japanese companies who need technical interns. We process and give guidance to those who want to get a technical intern visa in Japan.</p>`;

export const ADMISSION_DEFAULTS = {
  about_academic: {
    title: "About Academic",
    content: DEFAULT_ABOUT_CONTENT,
    sidebarTitle: "Academic Resources",
    sidebarItems: [
      { icon: "fa-solid fa-briefcase", label: "Employment Opportunities" },
      { icon: "fa-solid fa-flask", label: "Research and Education" },
      {
        icon: "fa-solid fa-chart-line",
        label: "Business and Trade Opportunities",
      },
    ],
  },
  language_school: {
    title: "Japanese Language School Admission (Japan)",
    content: DEFAULT_SCHOOL_CONTENT,
    sidebarTitle: "Academic Resources",
    sidebarItems: [
      { icon: "fa-solid fa-torii-gate", label: "Access to Japanese Market" },
      { icon: "fa-solid fa-hotel", label: "Tourism and Hospitality" },
      {
        icon: "fa-solid fa-language",
        label: "Translation and Interpretation Services",
      },
    ],
  },
  ssw: {
    title: "Specified Skilled Workers (Japan)",
    content: DEFAULT_SSW_CONTENT,
    sidebarTitle: "Academic Resources",
    sidebarItems: [
      { icon: "fa-solid fa-graduation-cap", label: "Admission Opportunity" },
      { icon: "fa-solid fa-clock", label: "Part-time Job Opportunity" },
      { icon: "fa-solid fa-award", label: "Graduate Programme" },
    ],
    media: {
      videoUrl: "https://youtu.be/pEQlcsNAVmc",
      sidebarImage:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=300&h=300&fit=crop",
    },
  },
  banner: {
    title: "Admission",
    content:
      'Over <span class="highlight">10000+</span> students come to Japan every year to fulfill their dream',
  },
  page_heading: {
    title: "Student Admission & SSW Job Placement",
  },
};

const AdmissionSectionContent = ({
  isEditMode,
  data,
  sectionKey,
  defaults,
  styles,
  children,
}) => {
  const queryClient = useQueryClient();
  const [editContent, setEditContent] = useState(null);
  const [titleDraft, setTitleDraft] = useState(null);
  const [saving, setSaving] = useState(null);

  const title = titleDraft ?? data?.section_title ?? defaults.title;
  const content = data?.section_content ?? defaults.content;

  const saveField = async (fields, message) => {
    setSaving("field");
    try {
      await saveAdmissionSection(supabase, sectionKey, fields);
      await queryClient.invalidateQueries({ queryKey: [QK_ADMISSION_PAGE] });
      showToast(message, "success");
    } catch (err) {
      showToast(err.message || "Failed to update.", "error");
    } finally {
      setSaving(null);
    }
  };

  const handleTitleSave = () => {
    if (!title.trim()) {
      showToast("Title cannot be empty.", "error");
      return;
    }
    saveField({ section_title: title.trim() }, "Title updated.");
  };

  const handleContentSave = () => {
    if (editContent === null) return;
    saveField({ section_content: editContent }, "Content updated.");
  };

  return (
    <div className={styles.content}>
      {isEditMode ? (
        <div className={editStyles.editRow}>
          <Input
            className={editStyles.titleInput}
            value={title}
            onChange={(e) => setTitleDraft(e.target.value)}
            placeholder="Section title"
          />
          <button
            type="button"
            className={editStyles.tickBtn}
            onClick={handleTitleSave}
            disabled={saving === "field"}
            title="Save title"
          >
            {saving === "field" ? (
              <i className="fa-solid fa-spinner fa-spin" />
            ) : (
              <i className="fa-solid fa-check" />
            )}
          </button>
        </div>
      ) : (
        <h3 className={styles.heading}>{title}</h3>
      )}

      {isEditMode ? (
        <div className={editStyles.rteWrapper}>
          <TiptapRTE
            value={content}
            onChange={(html) => setEditContent(html)}
          />
          <button
            type="button"
            className={editStyles.saveBtn}
            onClick={handleContentSave}
            disabled={saving === "field" || editContent === null}
          >
            {saving === "field" ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" /> Saving...
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk" /> Save Content
              </>
            )}
          </button>
        </div>
      ) : (
        <div
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {children}
    </div>
  );
};

export default AdmissionSectionContent;
