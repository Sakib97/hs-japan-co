import { useState, useEffect } from "react";
import styles from "../styles/AdmissionSSWComp.module.css";
import AdmissionSectionContent, {
  ADMISSION_DEFAULTS,
} from "./AdmissionSectionContent";
import AdmissionSectionSidebar from "./AdmissionSectionSidebar";
import {
  ADMISSION_SECTION_KEYS,
  getSidebarMeta,
  getYoutubeThumbnail,
} from "../utils/admissionPageUtils";

const AdmissionSSWComp = ({ isEditMode, data }) => {
  const defaults = ADMISSION_DEFAULTS.ssw;
  const meta = getSidebarMeta(data?.sidebar_items);
  const videoUrl = meta.videoUrl ?? defaults.media.videoUrl;
  const [thumbQuality, setThumbQuality] = useState("maxresdefault");

  useEffect(() => {
    setThumbQuality("maxresdefault");
  }, [videoUrl]);

  const videoThumbnail =
    getYoutubeThumbnail(videoUrl, thumbQuality) ??
    getYoutubeThumbnail(videoUrl, "hqdefault");

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <AdmissionSectionContent
            isEditMode={isEditMode}
            data={data}
            sectionKey={ADMISSION_SECTION_KEYS.SSW}
            defaults={defaults}
            styles={styles}
          >
            {!isEditMode && videoUrl && videoThumbnail && (
              <div className={styles.videoWrapper}>
                <img
                  src={videoThumbnail}
                  alt="Video thumbnail"
                  className={styles.videoThumb}
                  onError={() => {
                    if (thumbQuality !== "hqdefault") {
                      setThumbQuality("hqdefault");
                    }
                  }}
                />
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.playButton}
                >
                  <i className="fa-solid fa-play" />
                </a>
              </div>
            )}
          </AdmissionSectionContent>

          <AdmissionSectionSidebar
            isEditMode={isEditMode}
            data={data}
            sectionKey={ADMISSION_SECTION_KEYS.SSW}
            defaultTitle={defaults.sidebarTitle}
            defaultItems={defaults.sidebarItems}
            styles={styles}
            showMediaFields
            defaultSidebarImage={defaults.media.sidebarImage}
          />
        </div>
      </div>
    </section>
  );
};

export default AdmissionSSWComp;
