import { useState } from "react";
import styles from "../styles/CourseManagementPage.module.css";
import CourseCreateForm from "../components/courseManagement/CourseCreateForm";
import CourseInventoryTable from "../components/courseManagement/CourseInventoryTable";

const CourseManagementPage = () => {
  const [editingCourse, setEditingCourse] = useState(null);

  return (
    <div className={styles.pageWrapper}>
      <CourseCreateForm
        editingCourse={editingCourse}
        onEditComplete={() => setEditingCourse(null)}
      />
      <CourseInventoryTable onEdit={setEditingCourse} />
    </div>
  );
};

export default CourseManagementPage;
