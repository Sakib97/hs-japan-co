import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Spin } from "antd";
import { supabase } from "../../../../config/supabaseClient";
import {
  QK_STUDENT_CONTACT,
  QK_STUDENT_PROFILE,
} from "../../../../config/queryKeyConfig";
import { showToast } from "../../../../components/layout/CustomToast";
import styles from "../../styles/StudentContactComp.module.css";

const StudentContactComp = ({ email }) => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  const { data: student, isLoading } = useQuery({
    queryKey: [QK_STUDENT_CONTACT, email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student")
        .select("phone, present_address, permanent_address")
        .eq("email", email)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!email,
  });

  const handleEdit = () => {
    setForm({
      //   phone: student?.phone ?? "",
      present_address: student?.present_address ?? "",
      permanent_address: student?.permanent_address ?? "",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("student")
      .update(form)
      .eq("email", email);
    if (error) {
      showToast("Failed to update contact information.", "error");
    } else {
      queryClient.invalidateQueries({ queryKey: [QK_STUDENT_CONTACT, email] });
      queryClient.invalidateQueries({ queryKey: [QK_STUDENT_PROFILE, email] });
      showToast("Contact information updated.", "success");
      setEditing(false);
    }
    setSaving(false);
  };

  if (isLoading)
    return (
      <div className={styles.loadingWrapper}>
        <Spin />
      </div>
    );

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Contact Information</h3>
        {!editing ? (
          <button className={styles.editBtn} onClick={handleEdit}>
            <i className="fa-solid fa-pen"></i> EDIT
          </button>
        ) : (
          <div className={styles.headerActions}>
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <span className={styles.label}>PHONE NUMBER</span>

          <span className={styles.value}>{student?.phone || "—"}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>PRESENT ADDRESS</span>
          {editing ? (
            <textarea
              className={styles.textarea}
              value={form.present_address}
              onChange={(e) =>
                setForm({ ...form, present_address: e.target.value })
              }
              placeholder="Present address"
              rows={2}
            />
          ) : (
            <span className={styles.value}>
              {student?.present_address || "—"}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <span className={styles.label}>PERMANENT ADDRESS</span>
          {editing ? (
            <textarea
              className={styles.textarea}
              value={form.permanent_address}
              onChange={(e) =>
                setForm({ ...form, permanent_address: e.target.value })
              }
              placeholder="Permanent address"
              rows={2}
            />
          ) : (
            <span className={styles.value}>
              {student?.permanent_address || "—"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentContactComp;
