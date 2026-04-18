import { useState, useRef } from "react";
import TiptapRTE from "../../../../components/layout/TiptapRTE";
import styles from "../../styles/CourseCreateForm.module.css";

const LEVEL_OPTIONS = [
  { value: "N5", label: "N5 – Beginner" },
  { value: "N4", label: "N4 – Elementary" },
  { value: "N3", label: "N3 – Intermediate" },
  { value: "N2", label: "N2 – Upper Intermediate" },
  { value: "N1", label: "N1 – Advanced" },
];

const DURATION_OPTIONS = [
  "1 Month",
  "2 Months",
  "3 Months",
  "6 Months",
  "12 Months",
];

const INITIAL = {
  courseName: "",
  level: "N5",
  duration: "3 Months",
  instructorName: "",
  instructorBio: "",
  description: "",
  coverImage: null,
};

const CourseCreateForm = ({ onSubmit }) => {
  const [form, setForm] = useState(INITIAL);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) return;
    setForm((prev) => ({ ...prev, coverImage: file }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  const previewUrl = form.coverImage
    ? URL.createObjectURL(form.coverImage)
    : null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Curriculum Creation</h2>
        <p className={styles.sectionSubtitle}>
          Design a new educational path by defining structural parameters and
          pedagogical objectives.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        {/* ── Left column ── */}
        <div className={styles.leftCol}>
          <div className={styles.field}>
            <label className={styles.label}>Course Name</label>
            <input
              className={styles.input}
              type="text"
              name="courseName"
              value={form.courseName}
              onChange={handleChange}
              placeholder="e.g., Intensive N3 Business Japanese"
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Course Level</label>
              <select
                className={styles.select}
                name="level"
                value={form.level}
                onChange={handleChange}
              >
                {LEVEL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Course Duration</label>
              <select
                className={styles.select}
                name="duration"
                value={form.duration}
                onChange={handleChange}
              >
                {DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Instructor Info</label>
            <input
              className={styles.input}
              type="text"
              name="instructorName"
              value={form.instructorName}
              onChange={handleChange}
              placeholder="Instructor Full Name"
            />
            <input
              className={`${styles.input} ${styles.inputGap}`}
              type="text"
              name="instructorBio"
              value={form.instructorBio}
              onChange={handleChange}
              placeholder="Instructor Short Biography"
            />
          </div>
        </div>

        {/* ── Right column ── */}
        <div className={styles.rightCol}>
          <div className={styles.field}>
            <label className={styles.label}>Cover Image</label>
            <div
              className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && fileInputRef.current?.click()
              }
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Cover preview"
                  className={styles.preview}
                />
              ) : (
                <>
                  <span className={styles.dropzoneIcon}>&#128196;</span>
                  <p className={styles.dropzoneText}>
                    Drag and drop high-resolution asset
                  </p>
                  <p className={styles.dropzoneHint}>
                    PNG, JPG up to 10MB (TBLP ratio)
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className={styles.fileInput}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Course Description</label>
            <TiptapRTE
              value={form.description}
              onChange={(html) =>
                setForm((prev) => ({ ...prev, description: html }))
              }
            />
          </div>
        </div>

        {/* ── Submit ── */}
        <div className={styles.submitRow}>
          <button type="submit" className={styles.submitBtn}>
            Create Course&nbsp;&#10140;
          </button>
        </div>
      </form>
    </section>
  );
};

export default CourseCreateForm;
