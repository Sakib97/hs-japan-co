import styles from "../styles/GalleryComp.module.css";

const images = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&h=220&fit=crop",
    alt: "Group photo of students and staff",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&h=220&fit=crop",
    alt: "Classroom session",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=300&h=220&fit=crop",
    alt: "Students in class",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=220&fit=crop",
    alt: "Team collaboration",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=300&h=220&fit=crop",
    alt: "Cultural event",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=300&h=220&fit=crop",
    alt: "Award ceremony",
  },
];

const GalleryComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Gallery</h2>
        <div className={styles.grid}>
          {images.map((img) => (
            <div key={img.id} className={styles.imageCard}>
              <img src={img.src} alt={img.alt} className={styles.image} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryComp;
