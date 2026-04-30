import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Spin } from "antd";
import { supabase } from "../../../../config/supabaseClient";
import {
  QK_STUDENT_PERSONAL,
  QK_STUDENT_PROFILE,
} from "../../../../config/queryKeyConfig";
import { showToast } from "../../../../components/layout/CustomToast";
import styles from "../../styles/StudentPersonalDetailsComp.module.css";

const StudentPersonalDetailsComp = ({ email }) => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  const { data: student, isLoading } = useQuery({
    queryKey: [QK_STUDENT_PERSONAL, email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student")
        .select("father_name, mother_name, dob, nid")
        .eq("email", email)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!email,
  });

  const handleEdit = () => {
    setForm({
      father_name: student?.father_name ?? "",
      mother_name: student?.mother_name ?? "",
      dob: student?.dob ?? "",
      nid: student?.nid ?? "",
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
      showToast("Failed to update personal details.", "error");
    } else {
      queryClient.invalidateQueries({ queryKey: [QK_STUDENT_PERSONAL, email] });
      queryClient.invalidateQueries({ queryKey: [QK_STUDENT_PROFILE, email] });
      showToast("Personal details updated.", "success");
      setEditing(false);
    }
    setSaving(false);
  };

  const formatDob = (dob) => {
    if (!dob) return "—";
    return new Date(dob + "T00:00:00").toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
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
        <h3 className={styles.cardTitle}>Personal Details</h3>
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
          <span className={styles.label}>FATHER&apos;S NAME</span>
          {editing ? (
            <input
              className={styles.input}
              value={form.father_name}
              onChange={(e) =>
                setForm({ ...form, father_name: e.target.value })
              }
              placeholder="Father's name"
            />
          ) : (
            <span className={styles.value}>{student?.father_name || "—"}</span>
          )}
        </div>

        <div className={styles.field}>
          <span className={styles.label}>MOTHER&apos;S NAME</span>
          {editing ? (
            <input
              className={styles.input}
              value={form.mother_name}
              onChange={(e) =>
                setForm({ ...form, mother_name: e.target.value })
              }
              placeholder="Mother's name"
            />
          ) : (
            <span className={styles.value}>{student?.mother_name || "—"}</span>
          )}
        </div>

        <div className={styles.field}>
          <span className={styles.label}>NID Number</span>
          {editing ? (
            <input
              className={styles.input}
              value={form.nid}
              onChange={(e) => setForm({ ...form, nid: e.target.value })}
              placeholder="1234567891011"
            />
          ) : (
            <span className={styles.value}>{student?.nid || "—"}</span>
          )}
        </div>

        <div className={styles.field}>
          <span className={styles.label}>DATE OF BIRTH</span>
          {editing ? (
            <input
              type="date"
              className={styles.input}
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          ) : (
            <span className={styles.value}>
              {student?.dob ? (
                <>
                  <i
                    className="fa-regular fa-calendar"
                    style={{ color: "#b91c1c", marginRight: 6 }}
                  ></i>
                  {formatDob(student.dob)}
                </>
              ) : (
                "—"
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPersonalDetailsComp;
