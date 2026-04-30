import { Modal, Spin, Tag, Tabs } from "antd";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { QK_STUDENT_PROFILE } from "../../../../config/queryKeyConfig";
import {
  STUDENT_STATUS_COLOR,
  STUDENT_STATUS_OPTIONS,
} from "../../../../config/statusAndRoleConfig";
import styles from "../../styles/StudentProfileModal.module.css";

const statusLabelMap = Object.fromEntries(
  STUDENT_STATUS_OPTIONS.map(({ value, label }) => [value, label]),
);

const formatDob = (dob) => {
  if (!dob) return "—";
  return new Date(dob + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const yearLabel = (edu) => {
  const end =
    edu.is_current || !edu.passing_year ? "Present" : String(edu.passing_year);
  return `${edu.start_year} – ${end}`;
};

const StudentProfileModal = ({ email, open, onClose }) => {
  const { data, isLoading } = useQuery({
    queryKey: [QK_STUDENT_PROFILE, email],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_student_full_profile", {
        p_email: email,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!email && open,
  });

  const student = data?.student ?? {};
  const education = data?.education ?? [];
  const avatarUrl = data?.avatar_url ?? null;

  const initials = (student?.name ?? email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const tabItems = [
    {
      key: "personal",
      label: "Personal",
      children: (
        <div className={styles.section}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <span className={styles.label}>FATHER&apos;S NAME</span>
              <span className={styles.value}>{student.father_name || "—"}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>MOTHER&apos;S NAME</span>
              <span className={styles.value}>{student.mother_name || "—"}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>DATE OF BIRTH</span>
              <span className={styles.value}>{formatDob(student.dob)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>NID </span>
              <span className={styles.value}>{student.nid || "—"}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      children: (
        <div className={styles.section}>
          <div className={styles.field}>
            <span className={styles.label}>PHONE</span>
            <span className={styles.value}>{student.phone || "—"}</span>
          </div>
          <div className={`${styles.field} ${styles.fieldSpaced}`}>
            <span className={styles.label}>PRESENT ADDRESS</span>
            <span className={styles.value}>
              {student.present_address || "—"}
            </span>
          </div>
          <div className={`${styles.field} ${styles.fieldSpaced}`}>
            <span className={styles.label}>PERMANENT ADDRESS</span>
            <span className={styles.value}>
              {student.permanent_address || "—"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "education",
      label: "Education",
      children: (
        <div className={styles.section}>
          {education.length === 0 ? (
            <p className={styles.empty}>No education records.</p>
          ) : (
            <div className={styles.timeline}>
              {education.map((edu, index) => (
                <div key={edu.id} className={styles.timelineItem}>
                  <div className={styles.dotCol}>
                    <div
                      className={`${styles.timelineDot} ${
                        edu.is_current || !edu.passing_year
                          ? styles.dotCurrent
                          : styles.dotPast
                      }`}
                    />
                    {index < education.length - 1 && (
                      <div className={styles.connector} />
                    )}
                  </div>
                  <div className={styles.timelineBody}>
                    <span className={styles.yearRange}>{yearLabel(edu)}</span>
                    <span className={styles.institution}>
                      {edu.institution}
                    </span>
                    {(edu.degree || edu.major) && (
                      <span className={styles.degree}>
                        {[edu.degree, edu.major].filter(Boolean).join(", ")}
                      </span>
                    )}
                    {edu.result && (
                      <span className={styles.badge}>GPA: {edu.result}</span>
                    )}
                    {edu.board && (
                      <span className={styles.note}>Board: {edu.board}</span>
                    )}
                    {edu.additional_note && (
                      <span className={styles.note}>Note: {edu.additional_note}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={620}
      title={null}
      destroyOnClose
    >
      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <Spin />
        </div>
      ) : (
        <>
          <div className={styles.profileHeader}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={student.name ?? email}
                className={styles.avatarImg}
              />
            ) : (
              <div className={styles.avatarFallback}>{initials}</div>
            )}
            <div className={styles.headerMeta}>
              <h3 className={styles.studentName}>{student.name || "—"}</h3>
              <span className={styles.studentEmail}>{email}</span>
              <div className={styles.headerTags}>
                <Tag color={STUDENT_STATUS_COLOR[student.status] ?? "default"}>
                  {statusLabelMap[student.status] ?? student.status ?? "—"}
                </Tag>
                {student.student_id && (
                  <span className={styles.idBadge}>
                    ID: {student.student_id}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Tabs items={tabItems} className={styles.tabs} />
        </>
      )}
    </Modal>
  );
};

export default StudentProfileModal;
