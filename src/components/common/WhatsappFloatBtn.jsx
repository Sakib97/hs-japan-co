import { AiOutlineWhatsApp } from "react-icons/ai";
import styles from "./WhatsappFloatBtn.module.css";

const WhatsappFloatBtn = () => {
  const WHATSAPP_NUMBER = "88016232476"; 
  const WHATSAPP_MESSAGE = "Hello, I'd like to know more about your courses.";

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      className={styles.whatsappBtn}
      onClick={handleWhatsAppClick}
      title="Chat with us on WhatsApp"
      aria-label="Open WhatsApp"
    >
      <AiOutlineWhatsApp className={styles.whatsappIcon} />
    </button>
  );
};

export default WhatsappFloatBtn;
