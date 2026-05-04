// ─── User Roles ────────────────────────────────────────────────────────────────
// Used in: users_meta.role, user_invite_tokens.role
export const USER_ROLES = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
  STUDENT: "student",
};

export const USER_ROLE_OPTIONS = [
  { value: USER_ROLES.ADMIN, label: "Admin" },
  { value: USER_ROLES.EMPLOYEE, label: "Employee" },
  { value: USER_ROLES.STUDENT, label: "Student" },
];

// ─── Student Status ─────────────────────────────────────────────────────────────
// Used in: students.status
export const STUDENT_STATUS = {
  ACCOUNT_CREATION_MAIL_SENT: "account_creation_mail_sent",
  STUDENT_EXPRESSED_INTEREST: "student_expressed_interest",
  ENROLLED: "enrolled",
  SUSPENDED: "suspended",
  GRADUATED: "graduated",
  WITHDRAWN: "withdrawn",
};

export const STUDENT_STATUS_OPTIONS = [
  {
    value: STUDENT_STATUS.STUDENT_EXPRESSED_INTEREST,
    label: "Expressed Interest",
  },
  { value: STUDENT_STATUS.ENROLLED, label: "Enrolled" },
  { value: STUDENT_STATUS.GRADUATED, label: "Graduated" },
  { value: STUDENT_STATUS.WITHDRAWN, label: "Withdrawn" },
  { value: STUDENT_STATUS.SUSPENDED, label: "Suspended" },
  {
    value: STUDENT_STATUS.ACCOUNT_CREATION_MAIL_SENT,
    label: "Account Creation Mail Sent",
  },
];

export const STUDENT_STATUS_COLOR = {
  [STUDENT_STATUS.STUDENT_EXPRESSED_INTEREST]: "orange",
  [STUDENT_STATUS.ACCOUNT_CREATION_MAIL_SENT]: "blue",
  [STUDENT_STATUS.ENROLLED]: "green",
  [STUDENT_STATUS.SUSPENDED]: "red",
  [STUDENT_STATUS.GRADUATED]: "purple",
  [STUDENT_STATUS.WITHDRAWN]: "red",
};

// ─── Employee / User Account Status ─────────────────────────────────────────────
// Used in: employees.activity_status, users_meta.is_active
export const EMP_ACCOUNT_STATUS = {
  FULLTIME: "full_time",
  PARTTIME: "part_time",
  INACTIVE: "inactive",
  RETIRED: "retired",
};

export const EMP_ACCOUNT_STATUS_OPTIONS = [
  { value: EMP_ACCOUNT_STATUS.FULLTIME, label: "Full Time" },
  { value: EMP_ACCOUNT_STATUS.PARTTIME, label: "Part Time" },
  { value: EMP_ACCOUNT_STATUS.INACTIVE, label: "Inactive" },
  { value: EMP_ACCOUNT_STATUS.RETIRED, label: "Retired" },
];

export const EMP_ACCOUNT_STATUS_COLOR = {
  [EMP_ACCOUNT_STATUS.FULLTIME]: "green",
  [EMP_ACCOUNT_STATUS.PARTTIME]: "blue",
  [EMP_ACCOUNT_STATUS.INACTIVE]: "red",
  [EMP_ACCOUNT_STATUS.RETIRED]: "gray",
};

// ─── Course Status ───────────────────────────────────────────────────────────────
// Used in: courses.is_active
export const COURSE_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
};

// ─── Department / Designation Status ─────────────────────────────────────────────
// Used in: departments.is_active, designations.is_active
export const DEPT_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
};

// ─── Enquiry / Application Status ────────────────────────────────────────────────
// Used in: online_admissions / enquiries table (future)
export const ENQUIRY_STATUS = {
  NEW: "new",
  IN_REVIEW: "in_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

export const ENQUIRY_STATUS_OPTIONS = [
  { value: ENQUIRY_STATUS.NEW, label: "New" },
  { value: ENQUIRY_STATUS.IN_REVIEW, label: "In Review" },
  { value: ENQUIRY_STATUS.APPROVED, label: "Approved" },
  { value: ENQUIRY_STATUS.REJECTED, label: "Rejected" },
  { value: ENQUIRY_STATUS.CANCELLED, label: "Cancelled" },
];

export const ENQUIRY_STATUS_COLOR = {
  [ENQUIRY_STATUS.NEW]: "blue",
  [ENQUIRY_STATUS.IN_REVIEW]: "orange",
  [ENQUIRY_STATUS.APPROVED]: "green",
  [ENQUIRY_STATUS.REJECTED]: "red",
  [ENQUIRY_STATUS.CANCELLED]: "default",
};

// ─── Payment / Transaction Status ────────────────────────────────────────────────
// Used in: finances / transactions / payments table (future)
export const PAYMENT_STATUS = {
  PENDING: "pending",
  VERIFICATION_PENDING: "verification_pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const PAYMENT_STATUS_OPTIONS = [
  { value: PAYMENT_STATUS.PENDING, label: "Payment Due" },
  { value: PAYMENT_STATUS.VERIFICATION_PENDING, label: "Verification Pending" },
  { value: PAYMENT_STATUS.PAID, label: "Paid" },
  { value: PAYMENT_STATUS.FAILED, label: "Failed" },
  { value: PAYMENT_STATUS.REFUNDED, label: "Refunded" },
];

export const PAYMENT_STATUS_COLOR = {
  [PAYMENT_STATUS.PENDING]: "orange",
  [PAYMENT_STATUS.VERIFICATION_PENDING]: "yellow",
  [PAYMENT_STATUS.PAID]: "green",
  [PAYMENT_STATUS.FAILED]: "red",
  [PAYMENT_STATUS.REFUNDED]: "blue",
};
