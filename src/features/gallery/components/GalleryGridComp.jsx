import styles from "../styles/GalleryGridComp.module.css";

const galleryData = [
  {
    image:
      "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=500&h=350&fit=crop",
    title: "Japanese language School Visit By HS Japan Academy",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=350&fit=crop",
    title: "Visa Received For October 2024 Session",
  },
  {
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&h=350&fit=crop",
    title: "Visa Received by HS Japan Academy Students",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&h=350&fit=crop",
    title: "Entrance ceremony of a Japanese school at Kobe",
  },
  {
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=350&fit=crop",
    title: "Japanese Delegate Visited Our Office",
  },
  {
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&h=350&fit=crop",
    title: "April 2025 Session Visa Approved",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=350&fit=crop",
    title: "Textbooks were handed over to the new students.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500&h=350&fit=crop",
    title: "Journey Begins! Visa Approved for July 2025",
  },
  {
    image:
      "https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=500&h=350&fit=crop",
    title: "Academic Orientation for Newcomers",
  },
];

const GalleryGridComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {galleryData.map((item, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.image}
                />
              </div>
              <p className={styles.title}>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryGridComp;
