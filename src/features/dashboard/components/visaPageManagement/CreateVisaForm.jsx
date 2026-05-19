import { Button } from "antd";
import { useState } from "react";
import styles from "./CreateVisaForm.module.css";
import HeroConfigSection from "./HeroConfigSection";
import EligibilitySection from "./EligibilitySection";
import ApplicationProcessSection from "./ApplicationProcessSection";
import RequiredDocSection from "./RequiredDocSection";

const getInitialState = () => ({
  hero: { title: "", subtitle: "", image: null, imageUrl: null },
  eligibility: {
    title: "",
    subtitle: "",
    subsections: [{ icon: "fi-rr-graduation-cap", title: "", subtitle: "" }],
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

const CreateVisaForm = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState(getInitialState);

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
            onClick={() => onSubmit(formData)}
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
        data={formData.eligibility}
        onChange={(val) => setFormData((f) => ({ ...f, eligibility: val }))}
      />
      <ApplicationProcessSection
        data={formData.applicationProcess}
        onChange={(val) =>
          setFormData((f) => ({ ...f, applicationProcess: val }))
        }
      />
      <RequiredDocSection
        data={formData.requiredDocs}
        onChange={(val) => setFormData((f) => ({ ...f, requiredDocs: val }))}
      />

      <div className={styles.footer}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          type="primary"
          className={styles.publishBtn}
          onClick={() => onSubmit(formData)}
        >
          Publish Visa Page
        </Button>
      </div>
    </div>
  );
};

export default CreateVisaForm;
