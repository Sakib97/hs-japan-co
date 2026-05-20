import { FaRegSave } from "react-icons/fa";
import styles from "./SaveDraftBtnComp.module.css";
import { Button } from "antd";


const SaveDraftBtnComp = () => {
    return (
        <Button
            icon={<FaRegSave style={{ fontSize: "1rem" }} />}
            className={styles.drafteBtn}
        >
            Save Draft
        </Button>
    );
}
 
export default SaveDraftBtnComp;