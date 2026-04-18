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
  coverImage: Yup.mixed().required("Cover image is required"),
});
