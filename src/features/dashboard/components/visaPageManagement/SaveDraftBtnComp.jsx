import { FaRegSave } from "react-icons/fa";
import styles from "./SaveDraftBtnComp.module.css";
import { Button } from "antd";

const SaveDraftBtnComp = ({ onClick, loading, disabled }) => {
  return (
    <Button
      icon={<FaRegSave style={{ fontSize: "1rem" }} />}
      className={styles.drafteBtn}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
    >
      Save Draft
    </Button>
  );
};

export default SaveDraftBtnComp;
