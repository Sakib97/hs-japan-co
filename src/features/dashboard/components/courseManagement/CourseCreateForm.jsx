import { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import TiptapRTE from "../../../../components/layout/TiptapRTE";
import styles from "../../styles/CourseCreateForm.module.css";
import { CourseSchema, CourseEditSchema } from "../../schema/CourseSchema";
import { supabase } from "../../../../config/supabaseClient";
import { uploadImage } from "../../../../utils/handleImage";
import { showToast } from "../../../../components/layout/CustomToast";
import { useQueryClient } from "@tanstack/react-query";
import { COURSES_QUERY_KEY } from "./CourseInventoryTable";

const BUCKET = "course_images";
const FOLDER = "course_cover_images";

const CourseCreateForm = ({ onSubmit, editingCourse, onEditComplete }) => {
  const fileInputRef = useRef(null);
  const sectionRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const queryClient = useQueryClient();

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
    validationSchema: editingCourse ? CourseEditSchema : CourseSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      try {
        let coverImageUrl = editingCourse?.cover_image_url ?? null;
        let coverImageSize = editingCourse?.cover_image_size ?? null;

        if (values.coverImage) {
          coverImageUrl = await uploadImage(values.coverImage, BUCKET, FOLDER);
          coverImageSize = values.coverImage.size;
        }

        if (editingCourse) {
          const { error } = await supabase
            .from("course")
            .update({
              course_name: values.courseName.trim(),
              course_level: values.level.trim(),
              course_duration: values.duration.trim(),
              instructor_name: values.instructorName.trim(),
              instructor_description: values.instructorBio.trim(),
              course_description: values.description,
              cover_image_url: coverImageUrl,
              cover_image_size: coverImageSize,
            })
            .eq("id", editingCourse.id);
          if (error) throw error;
          showToast("Course updated successfully!", "success");
          onEditComplete?.();
        } else {
          const { error } = await supabase.from("course").insert({
            course_name: values.courseName.trim(),
            course_level: values.level.trim(),
            course_duration: values.duration.trim(),
            instructor_name: values.instructorName.trim(),
            instructor_description: values.instructorBio.trim(),
            course_description: values.description,
            cover_image_url: coverImageUrl,
            cover_image_size: coverImageSize,
          });
          if (error) throw error;
          showToast("Course created successfully!", "success");
          onSubmit?.(values);
        }

        await queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
        resetForm();
        setResetKey((k) => k + 1);
      } catch (err) {
        console.error("Course submission failed:", err);
        showToast(
          err.message || "Failed to save course. Please try again.",
          "error",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (editingCourse) {
      formik.setValues({
        courseName: editingCourse.course_name ?? "",
        level: editingCourse.course_level ?? "",
        duration: editingCourse.course_duration ?? "",
        instructorName: editingCourse.instructor_name ?? "",
        instructorBio: editingCourse.instructor_description ?? "",
        description: editingCourse.course_description ?? "",
        coverImage: null,
      });
      setResetKey((k) => k + 1);
      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      formik.resetForm();
      setResetKey((k) => k + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingCourse?.id]);

  const handleFile = (file) => {
    if (!file) return;
    formik.setFieldTouched("coverImage", true);
    formik.setFieldValue("coverImage", file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const previewUrl = formik.values.coverImage
    ? URL.createObjectURL(formik.values.coverImage)
    : (editingCourse?.cover_image_url ?? null);

  const err = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <span className={styles.errorMsg}>{formik.errors[field]}</span>
    ) : null;

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {editingCourse ? "Edit Course" : "Course Creation"}
        </h2>
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
                key={resetKey}
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
          {editingCourse && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onEditComplete}
              disabled={submitting}
            >
              Cancel Edit
            </button>
          )}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className={styles.submitIcon}>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                </span>
                &nbsp; {editingCourse ? "Updating..." : "Uploading..."}
              </>
            ) : (
              <>
                <span className={styles.submitIcon}>
                  <i className="fi fi-br-plus"></i>
                </span>
                &nbsp; {editingCourse ? "Update Course" : "Create Course"}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CourseCreateForm;
