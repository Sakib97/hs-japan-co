import { useState, useEffect } from "react";
import styles from "../styles/SplashScreen.module.css";

function SplashScreen({ onDone }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setFadingOut(true), 1000);
    const doneTimer = setTimeout(onDone, 1300);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className={`${styles.splash} ${fadingOut ? styles.fadeOut : ""}`}>
      <img
        src="/assets/logo_round.png"
        alt="HS Japan Academy"
        className={styles.logo}
      />
    </div>
  );
}

export default SplashScreen;
