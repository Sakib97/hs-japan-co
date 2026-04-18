import styles from "../styles/CourseManagementPage.module.css";
import CourseCreateForm from "../components/courseManagement/CourseCreateForm";
import CourseInventoryTable from "../components/courseManagement/CourseInventoryTable";

const CourseManagementPage = () => {
  const handleCreate = (formData) => {
    console.log("New course:", formData);
  };

  const handleEdit = (course) => {
    console.log("Edit course:", course);
  };

  return (
    <div className={styles.pageWrapper}>
      <CourseCreateForm onSubmit={handleCreate} />
      <CourseInventoryTable onEdit={handleEdit} />
    </div>
  );
};

export default CourseManagementPage;
