import styles from "./EventsActivitiesManagementPage.module.css";
import EventsTableComp from "../components/eventsActivitiesManagement/EventsTableComp";
import ActivitiesTableComp from "../components/eventsActivitiesManagement/ActivitiesTableComp";

const EventsActivitiesManagementPage = () => {
  return (
    <div className={styles.pageWrapper}>
      <EventsTableComp />
      <ActivitiesTableComp />
    </div>
  );
};

export default EventsActivitiesManagementPage;
