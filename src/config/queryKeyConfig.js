// ─── Student ──────────────────────────────────────────────────────────────────
// Used in: StudentDirectoryComp, CreateStudentModal, StudentStatsComp
//          StudentPersonalDetailsComp, StudentContactComp, StudentEducationComp
export const QK_STUDENTS = "student";
export const QK_STUDENT_STATS = "student-stats";
export const QK_STUDENT_PERSONAL = "student-personal";
export const QK_STUDENT_CONTACT = "student-contact";
export const QK_STUDENT_EDUCATION = "student-education";
export const QK_STUDENT_PROFILE = "student-profile"; // full profile via RPC (read-only modal)

// ─── Finances ─────────────────────────────────────────────────────────────────
// Used in: ReceiptParticularsComp
export const QK_FEE_TYPES = "fee-types";
// Used in: MyFinancesPage — student's own payment history
export const QK_MY_PAYMENTS = "my-payments";
// Used in: MyFinancesPage — student's own name/phone for PDF
export const QK_MY_STUDENT_INFO = "my-student-info";
// Used in: AllTransactionsComp — admin view of all student payments
export const QK_ALL_TRANSACTIONS = "all-transactions";
// Used in: FinancialOverviewComp — aggregate payment stats
export const QK_FINANCIAL_OVERVIEW = "financial-overview";
// Used in: PaymentVerifyPage — public receipt verification by receiptId
export const QK_VERIFY_RECEIPT = "verify-receipt";

// ─── Employee / HR ─────────────────────────────────────────────────────────────
// Used in: EmployeeDirectoryComp, CreateEmployeeModal
export const QK_EMPLOYEES = "employees";
export const QK_DEPARTMENTS = "departments";
export const QK_DESIGNATIONS = "designations";
export const QK_DEPT_AND_DESIG = "dept-and-desig";

// ─── Courses ──────────────────────────────────────────────────────────────────
// Used in: CourseInventoryTable, CourseCreateForm, CourseComp, CourseDetailsPage
export const QK_COURSES = "courses";
export const QK_HOME_COURSES = "home-courses";
export const QK_ALL_COURSES = "all-courses";
export const QK_COURSE_DETAIL = "course-detail";

// ─── Pages ────────────────────────────────────────────────────────────────────
// Used in: AboutPage, AcademicCoursesComp, ChairmanComp, AdmissionProcessComp
export const QK_ABOUT_PAGE = "about-page";

// Used in: WhyJapanPage, TechnologyComp, BetterFutureComp, BuildDreamComp
export const QK_WHY_JAPAN_PAGE = "why-japan-page";

// Used in: GalleryGridComp, GalleryPanel
export const QK_GALLERY_PAGE_IMAGES = "gallery_page_images";

// Used in: TeamMembersComp, TeamStaffPanel
export const QK_TEAM_PAGE_MEMBERS = "team_page_members";

// Used in: CarouselComp, HomepagePanel
export const QK_HOMEPAGE_CAROUSEL = "homepage_carousel_slides";

// ─── Events & Activities ──────────────────────────────────────────────────────
// Used in: EventsTableComp
export const QK_EVENTS = "events_page";
// Used in: ActivitiesTableComp
export const QK_ACTIVITIES = "activities_page";

// ─── Contact ─────────────────────────────────────────────────────────────────
// Used in: ContactInfoComp
export const QK_CONTACT_US = "contact_us";

// ─── Notifications ───────────────────────────────────────────────────────────
// Used in: useNotification
export const QK_NOTIFICATIONS = "notifications";
