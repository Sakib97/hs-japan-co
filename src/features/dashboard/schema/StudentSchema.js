import * as Yup from "yup";

export const StudentSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\+?[0-9\s\-()]{7,20}$/, "Invalid phone number"),
});
