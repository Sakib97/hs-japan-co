import TeamCareerComp from "../components/TeamCareerComp";
import TeamMembersComp from "../components/TeamMembersComp";
import styles from "../styles/TeamPage.module.css";

const TeamPage = () => {
  return (
    <div className={styles.teamPage}>
      <TeamCareerComp />
      <TeamMembersComp />
    </div>
  );
};

export default TeamPage;
