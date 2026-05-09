import { useState } from "react";
import { supabase } from "../../../config/supabaseClient";
import { showToast } from "../../../components/layout/CustomToast";
import styles from "../styles/FinancesPage.module.css";
import FindStudentComp from "../components/financesManagement/FindStudentComp";
import ReceiptParticularsComp from "../components/financesManagement/ReceiptParticularsComp";
import AllTransactionsComp from "../components/financesManagement/AllTransactionsComp";
import FinancialOverviewComp from "../components/financesManagement/FinancialOverviewComp";
import RecentRecordsComp from "../components/financesManagement/RecentRecordsComp";
import FeeTypeComp from "../components/financesManagement/FeeTypeComp";
import { USER_ROLES } from "../../../config/statusAndRoleConfig";
import { useAuth } from "../../../context/AuthProvider";

const FinancesPage = () => {
  const { userMeta } = useAuth();
  const isAdmin = userMeta?.role === USER_ROLES.ADMIN;
  const [foundStudent, setFoundStudent] = useState(null);

  const handleStudentFound = async (query) => {
    const isEmail = query.includes("@");
    const { data, error } = await supabase
      .from("student")
      .select("name, email, phone, session, avatar_url")
      .eq(isEmail ? "email" : "phone", query)
      .single();

    if (error || !data) {
      showToast("No student found with those credentials.", "error");
      setFoundStudent(null);
    } else {
      setFoundStudent(data);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Student Receipts</h1>
        <p className={styles.pageSubtitle}>
          Manage financial documentation and student fee records with surgical
          precision. Generate and send receipts instantly.
        </p>
      </div>

      <div className={styles.layout}>
        {/* ── Left column ── */}
        <div className={styles.leftCol}>
          <FindStudentComp onStudentFound={handleStudentFound} />
          <ReceiptParticularsComp
            studentName={foundStudent?.name}
            studentEmail={foundStudent?.email}
            studentPhone={foundStudent?.phone}
            studentAvatar={foundStudent?.avatar_url}
            studentSession={foundStudent?.session}
          />
        </div>

        {/* ── Right column ── */}
        <div className={styles.rightCol}>
          {isAdmin && <FinancialOverviewComp />}
          {isAdmin && <FeeTypeComp />}
          {/* <RecentRecordsComp /> */}
        </div>
      </div>
      <AllTransactionsComp />
    </div>
  );
};

export default FinancesPage;
