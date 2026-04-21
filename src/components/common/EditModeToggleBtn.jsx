import { Button } from "antd";
import styles from "../styles/EditModeToggleBtn.module.css";

const EditModeToggleBtn = ({ isEditMode, onToggle }) => {
  return (
    <Button
      className={styles.editBtn}
      icon={
        isEditMode ? (
          <i className="fa-solid fa-xmark" />
        ) : (
          <i className="fa-solid fa-pen-to-square" />
        )
      }
      onClick={onToggle}
    >
      {isEditMode ? "Cancel" : "Edit"}
    </Button>
  );
};

export default EditModeToggleBtn;
