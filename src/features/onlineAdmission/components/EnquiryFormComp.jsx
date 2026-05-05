import { Form, Input, Button, Card } from "antd";
import styles from "../styles/EnquiryFormComp.module.css";

const EnquiryFormComp = () => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Form submitted:", values);
    form.resetFields();
  };

  return (
    <section className={styles.section}>
      <div className={styles.formContainer}>
        <div className={styles.yellowCircle}></div>
        <Card className={styles.contactCard} bordered={false}>
          <Card.Meta
            title={
              <div className={styles.cardTitle}>
                {/* Join over{" "}
                <span className={styles.highlightText}>1500 students</span>{" "}
                who&apos;ve now registered for their courses. Don&apos;t miss
                out. */}
                <span style={{fontSize: '30px', fontWeight: 'bold'}}>Interested ? </span> <br />
                Drop us your contact details and we will get back to you very soon.
              </div>
            }
          />
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className={styles.form}
          >
            <Form.Item
              name="fullName"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <Input
                placeholder="Enter Your Full Name *"
                className={styles.formInput}
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input placeholder="Email Address *" className={styles.formInput} />
            </Form.Item>

            <Form.Item
              name="address"
              rules={[{ required: true, message: "Please enter your address" }]}
            >
              <Input
                placeholder="Current Address *"
                className={styles.formInput}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input
                type="tel"
                placeholder="Phone No *"
                className={styles.formInput}
              />
            </Form.Item>

            <Form.Item className={styles.submitItem}>
              <Button
                type="primary"
                htmlType="submit"
                block
                className={styles.submitButton}
              >
                Apply Today
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </section>
  );
};

export default EnquiryFormComp;
