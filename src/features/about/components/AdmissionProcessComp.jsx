import { supabase } from "../../../config/supabaseClient";
import styles from "../styles/AdmissionProcessComp.module.css";
import { showToast } from "../../../components/layout/CustomToast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const AdmissionProcessComp = ({ isEditMode, data = [], isLoading }) => {
  const queryClient = useQueryClient();
  const [editingValues, setEditingValues] = useState({});
  const [savingKey, setSavingKey] = useState(null);

  const processRows = data.filter(
    (row) => row.section_name === "process_section",
  );
  const phoneRow = processRows.find((row) => row.special_que === "phone");
  const emailRow = processRows.find((row) => row.special_que === "email");

  const phoneValue =
    editingValues.phone !== undefined
      ? editingValues.phone
      : phoneRow?.section_content || "+881 77655 4321";
  const emailValue =
    editingValues.email !== undefined
      ? editingValues.email
      : emailRow?.section_content || "info@hsjapan.co.jp";

  const initialPhoneValue = phoneRow?.section_content || "+881 77655 4321";
  const initialEmailValue = emailRow?.section_content || "info@hsjapan.co.jp";
  const isPhoneUnchanged = phoneValue.trim() === initialPhoneValue.trim();
  const isEmailUnchanged = emailValue.trim() === initialEmailValue.trim();
  const isPhoneEmpty = !phoneValue.trim();
  const isEmailEmpty = !emailValue.trim();

  const handleSave = async (key) => {
    const rawValue = key === "phone" ? phoneValue : emailValue;
    const cleanValue = rawValue?.trim() || "";

    if (!cleanValue) {
      showToast("This field cannot be empty.", "error");
      return;
    }

    setSavingKey(key);
    try {
      const currentRow = key === "phone" ? phoneRow : emailRow;

      if (currentRow?.id) {
        const { error } = await supabase
          .from("about_page")
          .update({ section_content: cleanValue })
          .eq("id", currentRow.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("about_page").insert({
          section_name: "process_section",
          special_que: key,
          section_content: cleanValue,
        });
        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ["about-page"] });
      showToast("Updated successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update.", "error");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Admission Process</h3>
      <div className={styles.contactItem}>
        <i className="fa-solid fa-phone" />
        {isEditMode ? (
          <div className={styles.editRow}>
            <input
              className={styles.input}
              value={phoneValue}
              onChange={(e) =>
                setEditingValues((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Phone number"
              disabled={savingKey === "phone"}
            />
            <button
              type="button"
              className={styles.tickBtn}
              onClick={() => handleSave("phone")}
              disabled={
                savingKey === "phone" || isPhoneUnchanged || isPhoneEmpty
              }
              title="Save phone"
            >
              {savingKey === "phone" ? (
                <i className="fa-solid fa-spinner fa-spin" />
              ) : (
                <i className="fa-solid fa-check" />
              )}
            </button>
          </div>
        ) : isLoading ? (
          <span className={styles.loadingText}>
            <i className="fa-solid fa-spinner fa-spin" />
          </span>
        ) : (
          <span>{phoneValue}</span>
        )}
      </div>
      <div className={styles.contactItem}>
        <i className="fa-solid fa-envelope" />
        {isEditMode ? (
          <div className={styles.editRow}>
            <input
              className={styles.input}
              value={emailValue}
              onChange={(e) =>
                setEditingValues((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Email"
              disabled={savingKey === "email"}
            />
            <button
              type="button"
              className={styles.tickBtn}
              onClick={() => handleSave("email")}
              disabled={
                savingKey === "email" || isEmailUnchanged || isEmailEmpty
              }
              title="Save email"
            >
              {savingKey === "email" ? (
                <i className="fa-solid fa-spinner fa-spin" />
              ) : (
                <i className="fa-solid fa-check" />
              )}
            </button>
          </div>
        ) : isLoading ? (
          <span className={styles.loadingText}>
            <i className="fa-solid fa-spinner fa-spin" />
          </span>
        ) : (
          <span>{emailValue}</span>
        )}
      </div>
    </div>
  );
};

export default AdmissionProcessComp;
