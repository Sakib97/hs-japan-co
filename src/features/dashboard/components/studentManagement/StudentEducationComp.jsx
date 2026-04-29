import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal, Spin } from "antd";
import { supabase } from "../../../../config/supabaseClient";
import { showToast } from "../../../../components/layout/CustomToast";
import styles from "../../styles/StudentEducationComp.module.css";

const defaultForm = () => ({
  institution: "",
  degree: "",
  field_of_study: "",
  start_year: "",
  end_year: "",
  is_current: false,
  gpa: "",
  grade_class: "",
});

const StudentEducationComp = ({ email }) => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState(defaultForm());

  // Fetch student id from email first, then education records
  const { data: educations = [], isLoading } = useQuery({
    queryKey: ["student-education", email],
    queryFn: async () => {
      const { data: studentRow, error: studentErr } = await supabase
        .from("student")
        .select("id")
        .eq("email", email)
        .single();
      if (studentErr) throw new Error(studentErr.message);

      const { data, error } = await supabase
        .from("student_education")
        .select("*")
        .eq("student_id", studentRow.id)
        .order("start_year", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!email,
  });

  const openAdd = () => {
    setEditingEntry(null);
    setForm(defaultForm());
    setModalOpen(true);
  };

  const openEdit = (entry) => {
    setEditingEntry(entry);
    setForm({
      institution: entry.institution ?? "",
      degree: entry.degree ?? "",
      field_of_study: entry.field_of_study ?? "",
      start_year: String(entry.start_year ?? ""),
      end_year: String(entry.end_year ?? ""),
      is_current: entry.is_current ?? false,
      gpa: entry.gpa ?? "",
      grade_class: entry.grade_class ?? "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.institution.trim() || !form.start_year) {
      showToast("Institution and start year are required.", "error");
      return;
    }
    setSaving(true);

    // Get student id for insert
    const { data: studentRow, error: studentErr } = await supabase
      .from("student")
      .select("id")
      .eq("email", email)
      .single();
    if (studentErr) {
      showToast("Could not resolve student record.", "error");
      setSaving(false);
      return;
    }

    const payload = {
      student_id: studentRow.id,
      institution: form.institution.trim(),
      degree: form.degree.trim() || null,
      field_of_study: form.field_of_study.trim() || null,
      start_year: Number(form.start_year),
      end_year: form.is_current
        ? null
        : form.end_year
          ? Number(form.end_year)
          : null,
      is_current: form.is_current,
      gpa: form.gpa.trim() || null,
      grade_class: form.grade_class.trim() || null,
    };

    let error;
    if (editingEntry) {
      ({ error } = await supabase
        .from("student_education")
        .update(payload)
        .eq("id", editingEntry.id));
    } else {
      ({ error } = await supabase.from("student_education").insert(payload));
    }

    if (error) {
      showToast("Failed to save education entry.", "error");
    } else {
      queryClient.invalidateQueries({ queryKey: ["student-education", email] });
      showToast(
        editingEntry ? "Education updated." : "Education added.",
        "success",
      );
      setModalOpen(false);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    const { error } = await supabase
      .from("student_education")
      .delete()
      .eq("id", id);
    if (error) {
      showToast("Failed to delete entry.", "error");
    } else {
      queryClient.invalidateQueries({ queryKey: ["student-education", email] });
      showToast("Education entry removed.", "success");
    }
    setDeleting(null);
  };

  const yearLabel = (edu) => {
    const end =
      edu.is_current || !edu.end_year ? "Present" : String(edu.end_year);
    return `${edu.start_year} – ${end}`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Education</h3>
      </div>

      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <Spin />
        </div>
      ) : educations.length === 0 ? (
        <p className={styles.empty}>No education entries yet.</p>
      ) : (
        <div className={styles.timeline}>
          {educations.map((edu) => (
            <div key={edu.id} className={styles.timelineItem}>
              <div
                className={`${styles.timelineDot} ${edu.is_current || !edu.end_year ? styles.dotCurrent : styles.dotPast}`}
              />
              <div className={styles.timelineBody}>
                <span className={styles.yearRange}>{yearLabel(edu)}</span>
                <div className={styles.entryRow}>
                  <div className={styles.entryDetails}>
                    <span className={styles.institution}>
                      {edu.institution}
                    </span>
                    {(edu.degree || edu.field_of_study) && (
                      <span className={styles.degree}>
                        {[edu.degree, edu.field_of_study]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    )}
                    {(edu.gpa || edu.grade_class) && (
                      <span className={styles.badge}>
                        {edu.gpa
                          ? `GPA: ${edu.gpa}`
                          : `Class: ${edu.grade_class}`}
                      </span>
                    )}
                  </div>
                  <div className={styles.entryActions}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => openEdit(edu)}
                      title="Edit"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                      onClick={() => handleDelete(edu.id)}
                      disabled={deleting === edu.id}
                      title="Delete"
                    >
                      {deleting === edu.id ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fa-solid fa-trash"></i>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className={styles.addBtn} onClick={openAdd}>
        + ADD INSTITUTION
      </button>

      <Modal
        open={modalOpen}
        title={editingEntry ? "Edit Education" : "Add Institution"}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText={saving ? "Saving..." : "Save"}
        confirmLoading={saving}
        destroyOnClose
      >
        <div className={styles.modalForm}>
          <div className={styles.modalField}>
            <label className={styles.modalLabel}>Institution *</label>
            <input
              className={styles.modalInput}
              value={form.institution}
              onChange={(e) =>
                setForm({ ...form, institution: e.target.value })
              }
              placeholder="University of Tokyo"
            />
          </div>

          <div className={styles.modalRow}>
            <div className={styles.modalField}>
              <label className={styles.modalLabel}>Degree</label>
              <input
                className={styles.modalInput}
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                placeholder="M.A., B.Sc., Ph.D."
              />
            </div>
            <div className={styles.modalField}>
              <label className={styles.modalLabel}>Field of Study</label>
              <input
                className={styles.modalInput}
                value={form.field_of_study}
                onChange={(e) =>
                  setForm({ ...form, field_of_study: e.target.value })
                }
                placeholder="International Relations"
              />
            </div>
          </div>

          <div className={styles.modalRow}>
            <div className={styles.modalField}>
              <label className={styles.modalLabel}>Start Year *</label>
              <input
                type="number"
                className={styles.modalInput}
                value={form.start_year}
                onChange={(e) =>
                  setForm({ ...form, start_year: e.target.value })
                }
                placeholder="2019"
                min={1950}
                max={new Date().getFullYear()}
              />
            </div>
            <div className={styles.modalField}>
              <label className={styles.modalLabel}>End Year</label>
              <input
                type="number"
                className={styles.modalInput}
                value={form.end_year}
                onChange={(e) => setForm({ ...form, end_year: e.target.value })}
                placeholder="2023"
                disabled={form.is_current}
                min={1950}
                max={new Date().getFullYear() + 10}
              />
            </div>
          </div>

          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={form.is_current}
              onChange={(e) =>
                setForm({ ...form, is_current: e.target.checked, end_year: "" })
              }
            />
            Currently studying here
          </label>

          <div className={styles.modalRow}>
            <div className={styles.modalField}>
              <label className={styles.modalLabel}>GPA (optional)</label>
              <input
                className={styles.modalInput}
                value={form.gpa}
                onChange={(e) => setForm({ ...form, gpa: e.target.value })}
                placeholder="3.9/4.0"
              />
            </div>
            <div className={styles.modalField}>
              <label className={styles.modalLabel}>
                Grade / Class (optional)
              </label>
              <input
                className={styles.modalInput}
                value={form.grade_class}
                onChange={(e) =>
                  setForm({ ...form, grade_class: e.target.value })
                }
                placeholder="First Division"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentEducationComp;
