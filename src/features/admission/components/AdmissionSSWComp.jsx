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

const VideoThumb = ({ url }) => {
  const [thumbQuality, setThumbQuality] = useState("maxresdefault");

  useEffect(() => {
    setThumbQuality("maxresdefault");
  }, [url]);

  const thumbnail =
    getYoutubeThumbnail(url, thumbQuality) ??
    getYoutubeThumbnail(url, "hqdefault");

  if (!url || !thumbnail) return null;

  return (
    <div className={styles.videoWrapper}>
      <img
        src={thumbnail}
        alt="Video thumbnail"
        className={styles.videoThumb}
        onError={() => {
          if (thumbQuality !== "hqdefault") {
            setThumbQuality("hqdefault");
          }
        }}
      />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.playButton}
      >
        <i className="fa-solid fa-play" />
      </a>
    </div>
  );
};

const AdmissionSSWComp = ({ isEditMode, data }) => {
  const defaults = ADMISSION_DEFAULTS.ssw;
  const meta = getSidebarMeta(data?.sidebar_items);
  const videoUrl = meta.videoUrl ?? defaults.media.videoUrl;
  const videoUrl2 = meta.videoUrl2 ?? defaults.media.videoUrl2;
  const videos = [videoUrl, videoUrl2].filter(Boolean);

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
          />

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

        {!isEditMode && videos.length > 0 && (
          <div
            className={`${styles.videoContainer} ${
              videos.length === 1 ? styles.videoContainerSingle : ""
            }`}
          >
            {videos.map((url) => (
              <VideoThumb key={url} url={url} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdmissionSSWComp;
