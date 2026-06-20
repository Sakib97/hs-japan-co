// ─── Student ──────────────────────────────────────────────────────────────────
// Used in: StudentDirectoryComp, CreateStudentModal, StudentStatsComp
//          StudentPersonalDetailsComp, StudentContactComp, StudentEducationComp
export const QK_STUDENTS = "student";
export const QK_STUDENT_STATS = "student-stats";
export const QK_STUDENT_PERSONAL = "student-personal";
export const QK_STUDENT_CONTACT = "student-contact";
export const QK_STUDENT_EDUCATION = "student-education";
export const QK_STUDENT_PROFILE = "student-profile"; // full profile via RPC (read-only modal)

// ─── Sessions ─────────────────────────────────────────────────────────────────
// Used in: SessionDirectoryComp
export const QK_SESSIONS = "sessions";

// ─── Finances ─────────────────────────────────────────────────────────────────
// Used in: ReceiptParticularsComp
export const QK_FEE_TYPES = "fee-types";
// Used in: MyFinancesPage — student's own payment history
export const QK_MY_PAYMENTS = "my-payments";
// Used in: MyFinancesPage — student's own name/phone for PDF
export const QK_MY_STUDENT_INFO = "my-student-info";
// Used in: AllTransactionsComp — admin view of all student payments (page + pageSize in query key)
export const QK_ALL_TRANSACTIONS = "all-transactions";
// Used in: AllTransactionsComp — filter-aware aggregate summary (RPC)
export const QK_TRANSACTION_SUMMARY = "transaction-summary";
// Used in: FinancialOverviewComp — aggregate payment stats
export const QK_FINANCIAL_OVERVIEW = "financial-overview";
// Used in: PaymentVerifyPage — public receipt verification by receiptId
export const QK_VERIFY_RECEIPT = "verify-receipt";

// ─── Employee / HR ─────────────────────────────────────────────────────────────
// Used in: EmployeeDirectoryComp, CreateEmployeeModal
export const QK_EMPLOYEES = "employees";
// Used in: AdminDirectoryComp, CreateEmployeeModal
export const QK_ADMINS = "admins";
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

// Used in: AdmissionPage and admission section components
export const QK_ADMISSION_PAGE = "admission-page";

// Used in: GalleryGridComp, GalleryPanel
export const QK_GALLERY_PAGE_IMAGES = "gallery_page_images";

// Used in: TeamMembersComp, TeamStaffPanel
export const QK_TEAM_PAGE_MEMBERS = "team_page_members";

// Used in: CarouselComp, HomepagePanel
export const QK_HOMEPAGE_CAROUSEL = "homepage_carousel_slides";
// Used in: HeroSectionComp (admin dashboard)
export const QK_HOMEPAGE_HERO = "homepage_hero";
// Used in: HeroSection2 (public home)
export const QK_HOME_HERO = "home-hero";

// ─── Events & Activities ──────────────────────────────────────────────────────
// Used in: EventsTableComp (admin dashboard)
export const QK_EVENTS = "events_page";
// Used in: AllEventsPage (public paginated listing)
export const QK_ALL_EVENTS = "all-events";
// Used in: ActivitiesTableComp (admin dashboard)
export const QK_ACTIVITIES = "activities_page";
// Used in: ActivitiesSection2 (home page — active only, limit 4)
export const QK_HOME_ACTIVITIES = "home-activities";
// Used in: AllActivitiesPage (public paginated listing)
export const QK_ALL_ACTIVITIES = "all-activities";

// ─── Contact ─────────────────────────────────────────────────────────────────
// Used in: ContactInfoComp
export const QK_CONTACT_US = "contact_us";

// ─── Daily Tasks ──────────────────────────────────────────────────────────────
// Used in: TaskDirectoryComp, TaskReportComp
export const QK_DAILY_TASKS = "daily-tasks";

// ─── Notifications ───────────────────────────────────────────────────────────
// Used in: useNotification
export const QK_NOTIFICATIONS = "notifications";

// ─── Announcements ───────────────────────────────────────────────────────────
// Used in: AnnouncementCreateForm, AnnouncementDirectory
export const QK_ANNOUNCEMENTS = "announcements";
// Used in: AnnouncementComp (home page public carousel — active + in-range only)
export const QK_HOME_ANNOUNCEMENTS = "home-announcements";

// ─── Visa Pages ───────────────────────────────────────────────────────────────
// Used in: VisaPageManagement, HeroConfigSection (save draft)
export const QK_VISA_PAGES = "visa_pages";
// Used in: EditVisaForm (fetch full page data for editing)
export const QK_VISA_PAGE_FULL = "visa_page_full";
// Used in: VisaPage (public display by slug)
export const QK_VISA_PAGE_BY_SLUG = "visa_page_by_slug";
// Used in: NavigationBar (dynamic Japan Visa dropdown)
export const QK_PUBLISHED_VISA_PAGES = "published_visa_pages";

// ─── Success Stories ──────────────────────────────────────────────────────────
// Used in: SuccessStoriesComp (admin dashboard)
export const QK_SUCCESS_STORIES = "success_stories";
// Used in: EventsTestimonialsSection (public home)
export const QK_HOME_SUCCESS_STORIES = "home-success-stories";

// ─── Core Pillars ─────────────────────────────────────────────────────────────
// Used in: CorePillersComp (admin dashboard)
export const QK_CORE_PILLERS = "core_pillers";
// Used in: CorePillarsSection (public home)
export const QK_HOME_CORE_PILLERS = "home-core-pillers";
