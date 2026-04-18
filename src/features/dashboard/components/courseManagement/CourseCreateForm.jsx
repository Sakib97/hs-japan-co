import { useRef } from "react";
import { useFormik } from "formik";
import TiptapRTE from "../../../../components/layout/TiptapRTE";
import styles from "../../styles/CourseCreateForm.module.css";
import { CourseSchema } from "../../schema/CourseSchema";

const CourseCreateForm = ({ onSubmit }) => {
  const fileInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      courseName: "",
      level: "",
      duration: "",
      instructorName: "",
      instructorBio: "",
      description: "",
      coverImage: null,
    },
    validationSchema: CourseSchema,
    onSubmit: (values) => {
      onSubmit?.(values);
    },
  });

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) return;
    formik.setFieldValue("coverImage", file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    formik.setFieldTouched("coverImage", true);
    handleFile(e.dataTransfer.files[0]);
  };

  const previewUrl = formik.values.coverImage
    ? URL.createObjectURL(formik.values.coverImage)
    : null;

  const err = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <span className={styles.errorMsg}>{formik.errors[field]}</span>
    ) : null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Course Creation</h2>
        <p className={styles.sectionSubtitle}>
          Design courses by defining structural parameters and course
          objectives.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className={styles.formGrid}>
        {/* Left column */}
        <div className={styles.leftCol}>
          <div className={styles.field}>
            <label className={styles.label}>Course Name *</label>
            <input
              className={`${styles.input}${formik.touched.courseName && formik.errors.courseName ? " " + styles.inputError : ""}`}
              type="text"
              name="courseName"
              value={formik.values.courseName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g., Intensive N3 Business Japanese"
            />
            {err("courseName")}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Course Level *</label>
              <input
                className={`${styles.input}${formik.touched.level && formik.errors.level ? " " + styles.inputError : ""}`}
                type="text"
                name="level"
                value={formik.values.level}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., N5 - Beginner"
              />
              {err("level")}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Course Duration *</label>
              <input
                className={`${styles.input}${formik.touched.duration && formik.errors.duration ? " " + styles.inputError : ""}`}
                type="text"
                name="duration"
                value={formik.values.duration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., 3 Months"
              />
              {err("duration")}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Instructor Info *</label>
            <input
              className={`${styles.input}${formik.touched.instructorName && formik.errors.instructorName ? " " + styles.inputError : ""}`}
              type="text"
              name="instructorName"
              value={formik.values.instructorName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Instructor Full Name"
            />
            {err("instructorName")}
            <input
              className={`${styles.input} ${styles.inputGap}${formik.touched.instructorBio && formik.errors.instructorBio ? " " + styles.inputError : ""}`}
              type="text"
              name="instructorBio"
              value={formik.values.instructorBio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Instructor Short Biography"
            />
            {err("instructorBio")}
          </div>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          <div className={styles.field}>
            <label className={styles.label}>Cover Image *</label>
            <div
              className={`${styles.dropzone}${formik.touched.coverImage && formik.errors.coverImage ? " " + styles.dropzoneError : ""}`}
              onDragOver={(e) => e.preventDefault()}
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
                onChange={(e) => {
                  formik.setFieldTouched("coverImage", true);
                  handleFile(e.target.files[0]);
                }}
              />
            </div>
            {err("coverImage")}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Course Description *</label>
            <div
              className={
                formik.touched.description && formik.errors.description
                  ? styles.rteError
                  : ""
              }
            >
              <TiptapRTE
                value={formik.values.description}
                onChange={(html) => {
                  formik.setFieldValue("description", html);
                  formik.setFieldTouched("description", true, false);
                }}
              />
            </div>
            {err("description")}
          </div>
        </div>

        {/* Submit */}
        <div className={styles.submitRow}>
          <button type="submit" className={styles.submitBtn}>
            <span className={styles.submitIcon}>
              <i className="fi fi-br-plus"></i>
            </span>
            &nbsp; Create Course
          </button>
        </div>
      </form>
    </section>
  );
};

export default CourseCreateForm;
