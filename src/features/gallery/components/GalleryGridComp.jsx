import { supabase } from "../../../config/supabaseClient";
import styles from "../styles/GalleryGridComp.module.css";
import { useQuery } from "@tanstack/react-query";
import { QK_GALLERY_PAGE_IMAGES } from "../../../config/queryKeyConfig";
import { LoadingOutlined } from "@ant-design/icons";

const fetchGalleryImages = async () => {
  const { data, error } = await supabase
    .from("gallery_page")
    .select("id, image_link, image_description")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data.map((row) => ({
    id: row.id,
    url: row.image_link,
    caption: row.image_description ?? "",
  }));
};

const GalleryGridComp = () => {
  const {
    data: galleryData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QK_GALLERY_PAGE_IMAGES],
    queryFn: fetchGalleryImages,
  });

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p
            style={{
              textAlign: "center",
              padding: "40px 0",
              fontSize: "1.2rem",
              color: "#888",
            }}
          >
            <LoadingOutlined spin /> &nbsp;Loading gallery...
          </p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p
            style={{ textAlign: "center", padding: "40px 0", color: "#b91c1c" }}
          >
            Failed to load gallery images.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {galleryData.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={item.url}
                  alt={item.caption || "Gallery image"}
                  className={styles.image}
                />
              </div>
              {item.caption && <p className={styles.title}>{item.caption}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryGridComp;
