import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../config/supabaseClient";
import { useAuth } from "../../../context/AuthProvider";
import {
  QK_MY_PAYMENTS,
  QK_MY_STUDENT_INFO,
} from "../../../config/queryKeyConfig";
import styles from "../styles/MyFinancesPage.module.css";
import MyPaymentSummaryComp from "../components/myFinances/MyPaymentSummaryComp";
import MyPaymentHistoryComp from "../components/myFinances/MyPaymentHistoryComp";

const MyFinancesPage = () => {
  const { user } = useAuth();
  const email = user?.email;

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: [QK_MY_PAYMENTS, email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_payment")
        .select("*")
        .eq("student_email", email)
        .order("receipt_gen_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!email,
    staleTime: 1000 * 60 * 5,
  });

  const { data: studentInfo } = useQuery({
    queryKey: [QK_MY_STUDENT_INFO, email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student")
        .select("name, phone")
        .eq("email", email)
        .single();
      if (error) return null;
      return data;
    },
    enabled: !!email,
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Finances</h1>
        <p className={styles.pageSubtitle}>
          View your fee history, pending balances, and download receipts.
        </p>
      </div>

      <MyPaymentSummaryComp payments={payments} loading={paymentsLoading} />

      <MyPaymentHistoryComp
        payments={payments}
        loading={paymentsLoading}
        studentName={studentInfo?.name}
        studentPhone={studentInfo?.phone}
      />
    </div>
  );
};

export default MyFinancesPage;
