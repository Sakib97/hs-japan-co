import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "antd";
import { supabase } from "../../../config/supabaseClient";
import styles from "../styles/AcademicCoursesComp.module.css";
import { showToast } from "../../../components/layout/CustomToast";
import FAIconPicker from "../../../components/common/FAIconPicker";

const COLORS = [
  "#4f46e5",
  "#e74c3c",
  "#f39c12",
  "#2ecc71",
  "#9b59b6",
  "#3498db",
  "#1abc9c",
  "#e67e22",
  "#e91e63",
  "#00bcd4",
];

const DEFAULT_ICON = "fa-solid fa-star";
let tempIdCounter = 0;

const AcademicCoursesComp = ({ isEditMode, data = [], isLoading }) => {
  const queryClient = useQueryClient();
  // Existing DB rows being updated/deleted
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  // Local unsaved rows
  const [newRows, setNewRows] = useState([]);
  const [savingTempId, setSavingTempId] = useState(null);
  // Edit state for existing rows
  const [editLabels, setEditLabels] = useState({});

  const courses = data.filter((d) => d.section_name === "courses_section");

  // ── Existing rows ──────────────────────────────────────────────────

  const handleIconChange = async (id, newIcon) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("about_page")
        .update({ content_icon: newIcon })
        .eq("id", id);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["about-page"] });
      showToast("Icon updated!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update icon.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLabelSave = async (id) => {
    const label = editLabels[id];
    if (label === undefined) return;
    if (!label.trim()) {
      showToast("Course label cannot be empty.", "error");
      return;
    }
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("about_page")
        .update({ section_content: label })
        .eq("id", id);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["about-page"] });
      showToast("Label updated!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update label.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Delete Course",
      content: "Are you sure you want to delete this course?",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => handleDelete(id),
    });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from("about_page").delete().eq("id", id);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["about-page"] });
      showToast("Course deleted!", "success");
    } catch (err) {
      showToast(err.message || "Failed to delete course.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // ── New (unsaved) rows ─────────────────────────────────────────────

  const handleAddNew = () => {
    const tempId = `new-${++tempIdCounter}`;
    setNewRows((prev) => [...prev, { tempId, icon: DEFAULT_ICON, label: "" }]);
  };

  const handleNewIconChange = (tempId, icon) => {
    setNewRows((prev) =>
      prev.map((r) => (r.tempId === tempId ? { ...r, icon } : r)),
    );
  };

  const handleNewLabelChange = (tempId, value) => {
    setNewRows((prev) =>
      prev.map((r) => (r.tempId === tempId ? { ...r, label: value } : r)),
    );
  };

  const handleNewRowDiscard = (tempId) => {
    setNewRows((prev) => prev.filter((r) => r.tempId !== tempId));
  };

  const handleNewRowSave = async (tempId) => {
    const row = newRows.find((r) => r.tempId === tempId);
    if (!row) return;
    if (!row.label.trim()) {
      showToast("Course label cannot be empty.", "error");
      return;
    }
    setSavingTempId(tempId);
    try {
      const { error } = await supabase.from("about_page").insert({
        section_name: "courses_section",
        section_content: row.label.trim(),
        content_icon: row.icon,
      });
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["about-page"] });
      setNewRows((prev) => prev.filter((r) => r.tempId !== tempId));
      showToast("Course added!", "success");
    } catch (err) {
      showToast(err.message || "Failed to add course.", "error");
    } finally {
      setSavingTempId(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────

  const totalCount = courses.length + newRows.length;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Academic Courses</h3>
      <ul className={styles.list}>
        {/* Existing DB rows */}
        {courses.map((course, index) => {
          const color = COLORS[index % COLORS.length];
          const isBusy = updatingId === course.id || deletingId === course.id;
          const currentLabel =
            editLabels[course.id] !== undefined
              ? editLabels[course.id]
              : course.section_content || "";

          return (
            <li key={course.id} className={styles.item}>
              {isEditMode ? (
                <FAIconPicker
                  value={course.content_icon || DEFAULT_ICON}
                  onChange={(icon) => handleIconChange(course.id, icon)}
                >
                  <span
                    className={`${styles.iconWrapper} ${styles.iconEditable}`}
                    style={{ backgroundColor: color }}
                    title="Click to change icon"
                  >
                    {updatingId === course.id ? (
                      <i className="fa-solid fa-spinner fa-spin" />
                    ) : (
                      <i className={course.content_icon || DEFAULT_ICON} />
                    )}
                    <span className={styles.iconEditHint}>
                      <i className="fa-solid fa-pen-to-square" />
                    </span>
                  </span>
                </FAIconPicker>
              ) : (
                <span
                  className={styles.iconWrapper}
                  style={{ backgroundColor: color }}
                >
                  <i className={course.content_icon || DEFAULT_ICON} />
                </span>
              )}

              {isEditMode ? (
                <div className={styles.editRow}>
                  <input
                    className={styles.labelInput}
                    value={currentLabel}
                    onChange={(e) =>
                      setEditLabels((prev) => ({
                        ...prev,
                        [course.id]: e.target.value,
                      }))
                    }
                    disabled={isBusy}
                    placeholder="Course label"
                  />
                  <button
                    type="button"
                    className={styles.tickBtn}
                    onClick={() => handleLabelSave(course.id)}
                    disabled={isBusy || editLabels[course.id] === undefined}
                    title="Save label"
                  >
                    {updatingId === course.id ? (
                      <i className="fa-solid fa-spinner fa-spin" />
                    ) : (
                      <i className="fa-solid fa-check" />
                    )}
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => confirmDelete(course.id)}
                    disabled={isBusy}
                    title="Delete course"
                  >
                    {deletingId === course.id ? (
                      <i className="fa-solid fa-spinner fa-spin" />
                    ) : (
                      <i className="fa-solid fa-trash" />
                    )}
                  </button>
                </div>
              ) : (
                <span className={styles.label}>
                  {course.section_content || ""}
                </span>
              )}
            </li>
          );
        })}

        {/* Unsaved new rows */}
        {isEditMode &&
          newRows.map((row, i) => {
            const color = COLORS[(courses.length + i) % COLORS.length];
            const isSaving = savingTempId === row.tempId;
            return (
              <li
                key={row.tempId}
                className={`${styles.item} ${styles.newItem}`}
              >
                <FAIconPicker
                  value={row.icon}
                  onChange={(icon) => handleNewIconChange(row.tempId, icon)}
                >
                  <span
                    className={`${styles.iconWrapper} ${styles.iconEditable}`}
                    style={{ backgroundColor: color }}
                    title="Click to change icon"
                  >
                    <i className={row.icon} />
                    <span className={styles.iconEditHint}>
                      <i className="fa-solid fa-pen-to-square" />
                    </span>
                  </span>
                </FAIconPicker>
                <div className={styles.editRow}>
                  <input
                    className={styles.labelInput}
                    value={row.label}
                    onChange={(e) =>
                      handleNewLabelChange(row.tempId, e.target.value)
                    }
                    disabled={isSaving}
                    placeholder="Course label"
                    autoFocus
                  />
                  <button
                    type="button"
                    className={styles.tickBtn}
                    onClick={() => handleNewRowSave(row.tempId)}
                    disabled={isSaving}
                    title="Save course"
                  >
                    {isSaving ? (
                      <i className="fa-solid fa-spinner fa-spin" />
                    ) : (
                      <i className="fa-solid fa-check" />
                    )}
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => handleNewRowDiscard(row.tempId)}
                    disabled={isSaving}
                    title="Discard"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
              </li>
            );
          })}
      </ul>

      {isEditMode && (
        <button type="button" className={styles.addBtn} onClick={handleAddNew}>
          <i className="fa-solid fa-plus" />
          &nbsp; Add New
        </button>
      )}
    </div>
  );
};

export default AcademicCoursesComp;
