import Carousel from "react-bootstrap/Carousel";
import styles from "../styles/CarouselComp.module.css";

const CarouselComp = () => {
  return (
    <div>
      <Carousel fade>
        <Carousel.Item interval={2000}>
          <div className={styles.overlay}></div>
          <img
            className={`d-block w-100 ${styles.carouselImg}`}
            src="https://picsum.photos/1920/1080?random=1"
            alt="First slide"
          />
          <Carousel.Caption className={styles.carouselCaption}>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={2000}>
          <div className={styles.overlay}></div>
          <img
            className={`d-block w-100 ${styles.carouselImg}`}
            src="https://picsum.photos/1920/1080?random=2"
            alt="Second slide"
          />

          <Carousel.Caption className={styles.carouselCaption}>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={2000}>
          <div className={styles.overlay}></div>
          <img
            className={`d-block w-100 ${styles.carouselImg}`}
            src="https://picsum.photos/1920/1080?random=3"
            alt="Third slide"
          />
          <Carousel.Caption className={styles.carouselCaption}>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default CarouselComp;
