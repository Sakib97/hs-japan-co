import GalleryBannerComp from "../components/GalleryBannerComp";
import GalleryGridComp from "../components/GalleryGridComp";
import styles from "../styles/GalleryPage.module.css";

const GalleryPage = () => {
  return (
    <div className={styles.galleryPage}>
      <GalleryBannerComp />
      <GalleryGridComp />
    </div>
  );
};

export default GalleryPage;
