import TaskReportComp from "../components/dailyTaskManagement/TaskReportComp";
import TaskDirectoryComp from "../components/dailyTaskManagement/TaskDirectoryComp";
import styles from "./DailyTaskPage.module.css";
import { useAuth } from "../../../context/AuthProvider";

const DailyTaskPage = () => {
  const { userMeta } = useAuth();
  return (
    <div className={styles.page}>
      {userMeta?.role === "employee" && <TaskReportComp />}
 {/* <TaskReportComp /> */}
      <TaskDirectoryComp />
    </div>
  );
};

export default DailyTaskPage;
