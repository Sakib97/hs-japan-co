import { useState } from "react";
import { Button } from "antd";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { QK_DAILY_TASKS } from "../../../../config/queryKeyConfig";
import { showToast } from "../../../../components/layout/CustomToast";
import TiptapRTE from "../../../../components/layout/TiptapRTE";
import { useAuth } from "../../../../context/AuthProvider";
import styles from "./TaskReportComp.module.css";

const TaskReportComp = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const handleSubmit = async () => {
    if (!content.trim()) {
      showToast("Please enter a task report.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("daily_task").insert({
        content: content.trim(),
        created_by: user?.email ?? null,
        status: "under_review",
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: [QK_DAILY_TASKS] });
      setContent("");
      showToast("Task report submitted successfully.", "success");
    } catch (err) {
      showToast(err.message || "Failed to submit report.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Daily Task Reporting</h2>
        <p className={styles.subtitle}>
          Maintain consistent momentum. Log your daily progress, milestones
          achieved, and focus areas for the next sprint.
        </p>
      </div>

      <div className={styles.contentWrapper}>
        {/* Left sidebar — Today's date */}
        <div className={styles.sidebar}>
          <div className={styles.dateBox}>
            <div className={styles.dateLabel}>TODAY'S DATE</div>
            <div className={styles.dateValue}>{dateStr}</div>
          </div>
        </div>

        {/* Right section — Activity Log */}
        <div className={styles.mainContent}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Activity Log</h3>
            <p className={styles.sectionSubtitle}>
              Document tasks, blockers, and achievements.
            </p>

            <TiptapRTE content={content} onChange={setContent} />

            <Button
              type="primary"
              size="large"
              className={styles.submitBtn}
              onClick={handleSubmit}
              loading={submitting}
            >
              SUBMIT REPORT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskReportComp;
