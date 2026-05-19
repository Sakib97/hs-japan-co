import { Button, Card, Tag, Avatar, Tooltip, Dropdown } from "antd";
import {
  PlusOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import styles from "./VisaPageManagement.module.css";
import CreateVisaForm from "../components/visaPageManagement/CreateVisaForm";

const VisaPageManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handlePublish = (data) => {
    // TODO: persist to Supabase
    console.log("Publish visa page:", data);
    setShowCreateForm(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Visa Page Management</h1>
          <p className={styles.pageSubtitle}>
            Create and manage visa guidance pages for prospective students.
          </p>
        </div>
        {!showCreateForm && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className={styles.createBtn}
            onClick={() => setShowCreateForm(true)}
          >
            Create New Visa Page
          </Button>
        )}
      </div>

      {showCreateForm && (
        <CreateVisaForm
          onCancel={() => setShowCreateForm(false)}
          onSubmit={handlePublish}
        />
      )}

      <div className={styles.directorySection}>
        <h3 className={styles.directoryTitle}>Visa Page Directory</h3>
        <p className={styles.directoryEmpty}>
          No visa pages created yet. Click &ldquo;Create New Visa Page&rdquo; to
          get started.
        </p>
      </div>
    </div>
  );
};

export default VisaPageManagement;
