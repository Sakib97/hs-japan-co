import { useState } from "react";
import styles from "../styles/SubscribeComp.module.css";

const cards = [
  {
    icon: "fa-solid fa-school",
    title: "Top 10 Japanese School",
    text: "Select a school and make your dream true!",
  },
  {
    icon: "fa-solid fa-chalkboard-user",
    title: "Expert Instruction",
    text: "Find the right instructor for you",
  },
];

const highlights = [
  {
    icon: "fa-solid fa-briefcase",
    title: "Employment Opportunities",
    text: "Proficiency in the Japanese language can open up various job opportunities, both in Japan and internationally.",
  },
  {
    icon: "fa-solid fa-flask",
    title: "Research and Education",
    text: "Japan has a strong presence in scientific research, technology development, and higher education.",
  },
];

const SubscribeComp = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Subscribe Us</h2>

        <div className={styles.topCards}>
          {cards.map((card, i) => (
            <div key={i} className={styles.card}>
              <i className={`${card.icon} ${styles.cardIcon}`} />
              <div>
                <h4 className={styles.cardTitle}>{card.title}</h4>
                <p className={styles.cardText}>{card.text}</p>
              </div>
            </div>
          ))}
          <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <button type="submit" className={styles.subscribeBtn}>
              Subscribe
            </button>
          </form>
        </div>

        <div className={styles.highlights}>
          {highlights.map((h, i) => (
            <div key={i} className={styles.highlightCard}>
              <i className={`${h.icon} ${styles.highlightIcon}`} />
              <h4 className={styles.highlightTitle}>{h.title}</h4>
              <p className={styles.highlightText}>{h.text}</p>
              <button className={styles.moreBtn}>Get More Info</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscribeComp;
