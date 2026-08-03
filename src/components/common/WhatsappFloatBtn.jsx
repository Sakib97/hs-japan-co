import { AiOutlineWhatsApp } from "react-icons/ai";
import styles from "./WhatsappFloatBtn.module.css";

const WHATSAPP_NUMBER = "8801323183993";
const WHATSAPP_MESSAGE = "Hello, I'd like to know more about your courses.";

const WhatsappFloatBtn = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      className={styles.whatsappBtn}
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
      aria-label="Open WhatsApp"
    >
      <AiOutlineWhatsApp className={styles.whatsappIcon} />
    </a>
  );
};

export default WhatsappFloatBtn;
