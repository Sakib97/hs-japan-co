import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal, Spin } from "antd";
import { supabase } from "../../../../config/supabaseClient";
import {
  QK_STUDENT_EDUCATION,
  QK_STUDENT_PROFILE,
} from "../../../../config/queryKeyConfig";
import { showToast } from "../../../../components/layout/CustomToast";
import styles from "../../styles/StudentEducationComp.module.css";
import { useAuth } from "../../../../context/AuthProvider";
import {
  USER_ROLES,
  STUDENT_STATUS,
} from "../../../../config/statusAndRoleConfig";

const defaultForm = () => ({
  degree: "",
  institution: "",
  major: "",
  board: "",
  start_year: "",
  passing_year: "",
  is_current: false,
  result: "",
  additional_note: "",
});

const StudentEducationComp = ({ email }) => {
  const queryClient = useQueryClient();
  const { userMeta, studentStatus } = useAuth();
  const canEdit =
    userMeta?.role !== USER_ROLES.STUDENT ||
    studentStatus === STUDENT_STATUS.ENROLLED;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState(defaultForm());

  // Fetch student id from email first, then education records
  const { data: educations = [], isLoading } = useQuery({
    queryKey: [QK_STUDENT_EDUCATION, email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_education")
        .select("*")
        .eq("email", email)
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
      major: entry.major ?? "",
      board: entry.board ?? "",
      start_year: String(entry.start_year ?? ""),
      passing_year: String(entry.passing_year ?? ""),
      is_current: entry.is_current ?? false,
      result: entry.result ?? "",
      additional_note: entry.additional_note ?? "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (
      !form.degree.trim() ||
      !form.institution.trim() ||
      !form.major.trim() ||
      !form.start_year ||
      isNaN(Number(form.start_year)) ||
      !form.result.trim()
    ) {
      showToast("Please fill in all required fields correctly!", "error");
      return;
    }
    setSaving(true);

    // Get student id for insert
    const { data: studentRow, error: studentErr } = await supabase
      .from("student")
      .select("student_id, phone")
      .eq("email", email)
      .single();
    if (studentErr) {
      showToast("Could not resolve student record.", "error");
      setSaving(false);
      return;
    }

    const payload = {
      email: email,
      phone: studentRow.phone,
      student_id: studentRow.student_id,
      degree: form.degree.trim() || null,
      institution: form.institution.trim(),
      major: form.major.trim() || null,
      board: form.board.trim() || null,
      start_year: Number(form.start_year),
      passing_year: form.is_current
        ? null
        : form.passing_year
          ? Number(form.passing_year)
          : null,
      is_current: form.is_current,
      result: form.result.trim() || null,
      additional_note: form.additional_note.trim() || null,
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
      queryClient.invalidateQueries({
        queryKey: [QK_STUDENT_EDUCATION, email],
      });
      queryClient.invalidateQueries({
        queryKey: [QK_STUDENT_PROFILE, email],
      });
      showToast(
        editingEntry ? "Education updated." : "Education added.",
        "success",
      );
      setModalOpen(false);
    }
    setSaving(false);
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Delete Education Entry",
      content: "Are you sure you want to delete this education entry?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setDeleting(id);
        const { error } = await supabase
          .from("student_education")
          .delete()
          .eq("id", id);
        if (error) {
          showToast("Failed to delete entry.", "error");
        } else {
          queryClient.invalidateQueries({
            queryKey: [QK_STUDENT_EDUCATION, email],
          });
          queryClient.invalidateQueries({
            queryKey: [QK_STUDENT_PROFILE, email],
          });
          showToast("Education entry removed.", "success");
        }
        setDeleting(null);
      },
    });
  };

  const yearLabel = (edu) => {
    const end =
      edu.is_current || !edu.passing_year
        ? "Present"
        : String(edu.passing_year);
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
                className={`${styles.timelineDot} ${edu.is_current || !edu.passing_year ? styles.dotCurrent : styles.dotPast}`}
              />
              <div className={styles.timelineBody}>
                <span className={styles.yearRange}>{yearLabel(edu)}</span>
                <div className={styles.entryRow}>
                  <div className={styles.entryDetails}>
                    <span className={styles.institution}>
                      {edu.institution}
                    </span>
                    {(edu.degree || edu.major) && (
                      <span className={styles.degree}>
                        {[edu.degree, edu.major].filter(Boolean).join(", ")}
                      </span>
                    )}
                    {edu.result && (
                      <span className={styles.badge}>
                        {`GPA: ${edu.result}`}
                      </span>
                    )}
                  </div>
                  <div className={styles.entryActions}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => openEdit(edu)}
                      disabled={!canEdit}
                      title={
                        canEdit ? "Edit" : "Only enrolled students can edit"
                      }
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                      onClick={() => confirmDelete(edu.id)}
                      disabled={deleting === edu.id || !canEdit}
                      title={
                        canEdit ? "Delete" : "Only enrolled students can edit"
                      }
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

      <button
        className={styles.addBtn}
        onClick={openAdd}
        disabled={!canEdit}
        title={
          canEdit ? undefined : "Only enrolled students can edit their profile"
        }
      >
        + ADD EDUCATION
      </button>

      <Modal
        open={modalOpen}
        title={editingEntry ? "Edit Education" : "Add Education"}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText={saving ? "Saving..." : "Save"}
        confirmLoading={saving}
        destroyOnClose
      >
        <div className={styles.modalForm}>
          <div className={styles.modalField}>
            <label className={styles.modalLabel}>Degree *</label>
            <input
              className={styles.modalInput}
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              placeholder="SSC, HSC, BSc, BA, MSc, MA etc."
            />
          </div>

          <div className={styles.modalField}>
            <label className={styles.modalLabel}>Institution *</label>
            <input
              className={styles.modalInput}
              value={form.institution}
              onChange={(e) =>
                setForm({ ...form, institution: e.target.value })
              }
              placeholder="School / College / University"
            />
          </div>

          <div className={styles.modalRow}>
            <div className={styles.modalField}>
              <label className={styles.modalLabel}>
                Field of Study / Major *
              </label>
              <input
                className={styles.modalInput}
                value={form.major}
                onChange={(e) => setForm({ ...form, major: e.target.value })}
                placeholder="Science, Business, CSE, EEE etc."
              />
            </div>

            <div className={styles.modalField}>
              <label className={styles.modalLabel}>Board (if any) </label>
              <input
                className={styles.modalInput}
                value={form.board}
                onChange={(e) => setForm({ ...form, board: e.target.value })}
                placeholder="Dhaka, Comilla etc."
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
                value={form.passing_year}
                onChange={(e) =>
                  setForm({ ...form, passing_year: e.target.value })
                }
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
                setForm({
                  ...form,
                  is_current: e.target.checked,
                  passing_year: "",
                })
              }
            />
            Currently studying here
          </label>

          <div className={styles.modalRow}>
            <div className={styles.modalField}>
              <label className={styles.modalLabel}>GPA / CGPA *</label>
              <input
                className={styles.modalInput}
                value={form.result}
                onChange={(e) => setForm({ ...form, result: e.target.value })}
                placeholder="4.8/5.0, 3.5/4.0  etc."
              />
            </div>
            <div className={styles.modalField}>
              <label className={styles.modalLabel}>
                Additional Note (if any)
              </label>
              <input
                className={styles.modalInput}
                value={form.additional_note}
                onChange={(e) =>
                  setForm({ ...form, additional_note: e.target.value })
                }
                placeholder="Additional info"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentEducationComp;
