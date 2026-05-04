import { useState } from "react";
import { Table } from "antd";
import styles from "../../styles/CourseInventoryTable.module.css";
import { supabase } from "../../../../config/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../../../../components/layout/CustomToast";

import { QK_COURSES, QK_HOME_COURSES } from "../../../../config/queryKeyConfig";

const PAGE_SIZE = 10;

const LEVEL_COLORS = {
  N1: { bg: "#dcfce7", color: "#15803d" },
  N2: { bg: "#dbeafe", color: "#1d4ed8" },
  N3: { bg: "#fef9c3", color: "#a16207" },
  N4: { bg: "#f3e8ff", color: "#7e22ce" },
  N5: { bg: "#fee2e2", color: "#b91c1c" },
};

const initials = (name) =>
  (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const CourseInventoryTable = ({ onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [togglingId, setTogglingId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [QK_COURSES, currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from("course")
        .select(
          "id, course_name, course_level, course_duration, instructor_name, instructor_description, course_description, cover_image_url, cover_image_size, created_at, is_active",
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw new Error(error.message);
      return { rows: data ?? [], total: count ?? 0 };
    },
    keepPreviousData: true,
  });

  const handleToggleStatus = async (record) => {
    setTogglingId(record.id);
    const newStatus = !record.is_active;
    const { error } = await supabase
      .from("course")
      .update({ is_active: newStatus })
      .eq("id", record.id);

    if (error) {
      showToast("Failed to update course status.", "error");
    } else {
      await queryClient.invalidateQueries({ queryKey: [QK_COURSES] });
      await queryClient.invalidateQueries({ queryKey: [QK_HOME_COURSES] });
      showToast(
        `Course ${newStatus ? "activated" : "deactivated"} successfully.`,
        "success",
      );
    }
    setTogglingId(null);
  };

  const columns = [
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "course_name",
      render: (name, record) => (
        <div className={styles.courseCell}>
          <div className={styles.thumbnail}>
            {record.cover_image_url ? (
              <img
                src={record.cover_image_url}
                alt={name}
                className={styles.thumbnailImg}
              />
            ) : (
              <span className={styles.thumbnailPlaceholder}>&#127979;</span>
            )}
          </div>
          <div>
            <p className={styles.courseName}>{name}</p>
            <p className={styles.courseUpdated}>
              {record.created_at
                ? new Date(record.created_at).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Level",
      dataIndex: "course_level",
      key: "course_level",
      render: (level) => {
        const levelStyle = LEVEL_COLORS[level] ?? {
          bg: "#f3f4f6",
          color: "#374151",
        };
        return (
          <span
            className={styles.badge}
            style={{ background: levelStyle.bg, color: levelStyle.color }}
          >
            {level || "—"}
          </span>
        );
      },
    },
    {
      title: "Duration",
      dataIndex: "course_duration",
      key: "course_duration",
      render: (v) => <span className={styles.muted}>{v || "—"}</span>,
    },
    {
      title: "Instructor",
      dataIndex: "instructor_name",
      key: "instructor_name",
      render: (name) => (
        <div className={styles.instructorCell}>
          <div className={styles.avatar}>
            <span>{initials(name || "")}</span>
          </div>
          <span className={styles.instructorName}>{name || "—"}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (active) => (
        <span
          className={`${styles.status} ${active !== false ? styles.statusActive : styles.statusInactive}`}
        >
          <span className={styles.statusDot} />
          {active !== false ? "Active" : "Deactivated"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <div className={styles.actionsCell}>
          <button
            type="button"
            className={styles.editBtn}
            title="Edit"
            onClick={() => onEdit?.(record)}
          >
            &#9998;
          </button>
          <button
            type="button"
            className={`${styles.toggle} ${record.is_active !== false ? styles.toggleOn : styles.toggleOff} ${togglingId === record.id ? styles.toggleLoading : ""}`}
            onClick={() => handleToggleStatus(record)}
            title={record.is_active !== false ? "Deactivate" : "Activate"}
            aria-pressed={record.is_active !== false}
            disabled={togglingId === record.id}
          >
            {togglingId === record.id ? (
              <span className={styles.toggleSpinner} />
            ) : (
              <span className={styles.toggleThumb} />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Course Inventory</h2>
        <div className={styles.actions}>
          <button type="button" className={styles.outlineBtn}>
            &#9776;&nbsp; Filter
          </button>
          <button type="button" className={styles.outlineBtn}>
            &#8593;&nbsp; Export
          </button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data?.rows ?? []}
        rowKey="id"
        loading={isLoading}
        className={styles.antTable}
        scroll={{ x: "max-content" }}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: data?.total ?? 0,
          onChange: (page) => setCurrentPage(page),
          showTotal: (t) => `${t} records`,
          showSizeChanger: false,
        }}
      />

      {/* <div className={styles.paginationRow}>
        <Pagination
          current={currentPage}
          pageSize={PAGE_SIZE}
          total={data?.total ?? 0}
          onChange={setCurrentPage}
          showSizeChanger={false}
          showTotal={(total) => `${total} course${total !== 1 ? "s" : ""}`}
        />
      </div> */}
    </section>
  );
};

export default CourseInventoryTable;
