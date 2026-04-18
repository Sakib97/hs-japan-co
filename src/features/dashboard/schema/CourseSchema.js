import * as Yup from "yup";

export const CourseSchema = Yup.object({
  courseName: Yup.string().trim().required("Course name is required"),
  level: Yup.string().trim().required("Course level is required"),
  duration: Yup.string().trim().required("Course duration is required"),
  instructorName: Yup.string().trim().required("Instructor name is required"),
  instructorBio: Yup.string()
    .trim()
    .required("Instructor biography is required"),
  description: Yup.string()
    .trim()
    .test("not-empty-html", "Course description is required", (value) => {
      if (!value) return false;
      // strip HTML tags and check there's actual text
      const text = value.replace(/<[^>]*>/g, "").trim();
      return text.length > 0;
    })
    .required("Course description is required"),
  coverImage: Yup.mixed()
    .required("Cover image is required")
    .test(
      "fileType",
      "Only PNG, JPG, JPEG or WEBP images are allowed",
      (value) => {
        if (!value) return true;
        return ["image/png", "image/jpeg", "image/webp", "image/jpg"].includes(
          value.type,
        );
      },
    )
    .test("fileSize", "Image must be smaller than 2MB", (value) => {
      if (!value) return true;
      return value.size <= 2 * 1024 * 1024;
    }),
});

export const CourseEditSchema = Yup.object({
  courseName: Yup.string().trim().required("Course name is required"),
  level: Yup.string().trim().required("Course level is required"),
  duration: Yup.string().trim().required("Course duration is required"),
  instructorName: Yup.string().trim().required("Instructor name is required"),
  instructorBio: Yup.string()
    .trim()
    .required("Instructor biography is required"),
  description: Yup.string()
    .trim()
    .test("not-empty-html", "Course description is required", (value) => {
      if (!value) return false;
      const text = value.replace(/<[^>]*>/g, "").trim();
      return text.length > 0;
    })
    .required("Course description is required"),
  coverImage: Yup.mixed()
    .nullable()
    .test(
      "fileType",
      "Only PNG, JPG, JPEG or WEBP images are allowed",
      (value) => {
        if (!value) return true;
        return ["image/png", "image/jpeg", "image/webp", "image/jpg"].includes(
          value.type,
        );
      },
    )
    .test("fileSize", "Image must be smaller than 2MB", (value) => {
      if (!value) return true;
      return value.size <= 2 * 1024 * 1024;
    }),
});
