import { useState } from "react";
import { supabase } from "../../../config/supabaseClient";
import { useAuth } from "../../../context/AuthProvider";
import { showToast } from "../../../components/layout/CustomToast";
import { useNavigate } from "react-router";
import { Button, Modal, Alert } from "react-bootstrap";
import { LogoutOutlined } from "@ant-design/icons";
import styles from "../styles/LogoutButton.module.css";

const LogoutButton = () => {
  const [show, setShow] = useState(false);

  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { setUser, setUserMeta, setLoading } = useAuth();

  const handleLogout = async () => {
    setLogoutLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout failed:", error.message);
        setError("Failed to log out. Please try again.");
        showToast("Logout failed. Please try again.", "error");
        setLogoutLoading(false);
        return;
      }

      // Clear user context
      setUser(null);
      setUserMeta(null);
      setLoading(false);

      // Redirect to sign-in
      navigate("/auth/signin");
    } catch (err) {
      console.error("Unexpected logout error:", err);
      setError("An unexpected error occurred. Please try again.");
      showToast("Unexpected logout error.", "error");
    } finally {
      setLogoutLoading(false);
      setShow(false);
      // setError(null);
    }
  };

  return (
    <>
      {/* Trigger — styled as a sidebar menu item */}
      <div className={styles.menuItem} onClick={() => setShow(true)}>
        <span className={styles.menuIcon}>
          <LogoutOutlined />
        </span>
        <span className={styles.menuLabel}>Logout</span>
      </div>

      {/* Confirmation modal */}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ textAlign: "center" }}>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          Are you sure you want to log out of your account?
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShow(false)}
            disabled={logoutLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? "Logging out..." : "Logout"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LogoutButton;
