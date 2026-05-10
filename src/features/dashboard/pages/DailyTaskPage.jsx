import TaskReportComp from "../components/dailyTaskManagement/TaskReportComp";
import TaskDirectoryComp from "../components/dailyTaskManagement/TaskDirectoryComp";
import styles from "./DailyTaskPage.module.css";

const DailyTaskPage = () => {
  return (
    <div className={styles.page}>
      <TaskReportComp />
      <TaskDirectoryComp />
    </div>
  );
};

export default DailyTaskPage;
