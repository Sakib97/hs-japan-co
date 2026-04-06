import { Modal, Input, Select, Button, Tabs } from "antd";
import styles from "./CreateEmployeeModal.module.css";

const designationOptions = [
  { value: "senior_visa_officer", label: "Senior Visa Officer" },
  { value: "language_specialist", label: "Language Specialist" },
  { value: "legal_consultant", label: "Legal Consultant" },
  { value: "training_director", label: "Training Director" },
  { value: "immigration_analyst", label: "Immigration Analyst" },
];

const departmentOptions = [
  { value: "consular_affairs", label: "Consular Affairs" },
  { value: "education_culture", label: "Education & Culture" },
  { value: "legal_compliance", label: "Legal Compliance" },
  { value: "human_resources", label: "Human Resources" },
];

const CreateEmployeeModal = ({ open, onClose }) => {
  const handleAdminSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log("Create admin:", data);
    onClose();
  };

  const handleEmployeeSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log("Create employee:", data);
    onClose();
  };

  const items = [
    {
      key: "1",
      label: "New Admin",
      children: (
        <form onSubmit={handleAdminSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>FULL NAME</label>
            <Input
              name="fullName"
              placeholder="e.g. Kenji Tanaka"
              size="large"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>EMAIL ADDRESS</label>
            <Input
              name="email"
              type="email"
              placeholder="k.tanaka@consulate.gov"
              size="large"
              required
            />
          </div>

          <div className={styles.footer}>
            <Button onClick={onClose} size="large">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className={styles.submitBtn}
            >
              Create Admin
            </Button>
          </div>
          <div>
            <span className={styles.note}>
              *New admin will receive an email with login instructions.
            </span>
          </div>
        </form>
      ),
    },
    {
      key: "2",
      label: "New Employee",
      children: (
        <form onSubmit={handleEmployeeSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>FULL NAME</label>
            <Input
              name="fullName"
              placeholder="e.g. Kenji Tanaka"
              size="large"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>EMAIL ADDRESS</label>
            <Input
              name="email"
              type="email"
              placeholder="k.tanaka@consulate.gov"
              size="large"
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>DESIGNATION</label>
              <Select
                placeholder="Select Role"
                options={designationOptions}
                size="large"
                className={styles.select}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>DEPARTMENT</label>
              <Select
                placeholder="Select Dept"
                options={departmentOptions}
                size="large"
                className={styles.select}
              />
            </div>
          </div>

          <div className={styles.footer}>
            <Button onClick={onClose} size="large">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className={styles.submitBtn}
            >
              Create Account
            </Button>
          </div>
          <div>
            <span className={styles.note}>
              * New employee will receive an email with login instructions.
            </span>
          </div>
        </form>
      ),
    },
  ];

  return (
    <Modal
      title="Create New Account"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      className={styles.modal}
      width={480}
      zIndex={1100}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Modal>
  );
};

export default CreateEmployeeModal;
