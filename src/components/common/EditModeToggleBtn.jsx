import { Button } from "antd";
import styles from "../styles/EditModeToggleBtn.module.css";

const EditModeToggleBtn = ({ isEditMode, onToggle }) => {
  return (
    // <Button
    //   className={styles.editBtn}
    //   icon={
    //     isEditMode ? (
    //       <i className="fa-solid fa-xmark" />
    //     ) : (
    //       <i className="fa-solid fa-pen-to-square" />
    //     )
    //   }
    //   onClick={onToggle}
    // >
    //   {isEditMode ? "Cancel" : "Edit"}
    // </Button>

    <button
      className={styles.editBtn}
      // icon={
      //   isEditMode ? (
      //     <i className="fa-solid fa-xmark" />
      //   ) : (
      //     <i className="fa-solid fa-pen-to-square" />
      //   )
      // }
      onClick={onToggle}
      // disabled={disabled}
    >
      {isEditMode ? (
        <>
          <i className="fa-solid fa-xmark" />
          <span>Cancel</span>
        </>
      ) : (
        <>
          <i className="fa-solid fa-pen-to-square" />
          <span>Edit</span>
        </>
      )}
    </button>
  );
};

export default EditModeToggleBtn;
