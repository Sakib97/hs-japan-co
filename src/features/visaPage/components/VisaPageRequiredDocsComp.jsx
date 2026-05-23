import { CheckCircleFilled } from "@ant-design/icons";
import styles from "./VisaPageRequiredDocsComp.module.css";

const VisaPageRequiredDocsComp = ({ section, documents, sideImage }) => {
  return (
    <section className={styles.section}>
      <div className={styles.left}>
        <h2 className={styles.title}>{section.title}</h2>
        {section.subtitle && (
          <p className={styles.subtitle}>{section.subtitle}</p>
        )}
        <div className={styles.docsGrid}>
          {documents.map((doc, i) => (
            <div key={i} className={styles.docItem}>
              <CheckCircleFilled className={styles.checkIcon} />
              <span className={styles.docLabel}>{doc.title}</span>
            </div>
          ))}
        </div>
      </div>

      {sideImage?.image_url && (
        <div className={styles.right}>
          <img
            src={sideImage.image_url}
            alt="Required documents"
            className={styles.sideImage}
          />
        </div>
      )}
    </section>
  );
};

export default VisaPageRequiredDocsComp;
