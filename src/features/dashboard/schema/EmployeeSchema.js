import * as Yup from "yup";

export const EmployeeSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  designation: Yup.string().required("Designation is required"),

  department: Yup.string().required("Department is required"),
});
