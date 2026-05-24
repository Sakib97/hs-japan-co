import { Table, Avatar, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { QK_ADMINS } from "../../../../config/queryKeyConfig";
import styles from "../../styles/EmployeeManagementPage.module.css";

const columns = [
  {
    title: "NAME",
    key: "name",
    render: (_, record) => (
      <div className={styles.nameCell}>
        <Avatar
          size={36}
          className={styles.employeeAvatar}
          src={record.avatar_url ?? undefined}
        >
          {!record.avatar_url &&
            (record.name?.charAt(0) ?? record.email?.charAt(0) ?? "?")}
        </Avatar>
        <div>
          <div className={styles.employeeName}>{record.name ?? "—"}</div>
          <div className={styles.employeeEmail}>{record.email ?? "—"}</div>
        </div>
      </div>
    ),
  },
  {
    title: "STATUS",
    key: "status",
    render: (_, record) =>
      record.is_active ? (
        <Tag color="success">Active</Tag>
      ) : (
        <Tag color="default">Inactive</Tag>
      ),
  },
];

const AdminDirectoryComp = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QK_ADMINS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users_meta")
        .select("id, name, email, avatar_url, is_active")
        .eq("role", "admin")
        .order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  return (
    <div className={styles.directorySection}>
      <div className={styles.directoryHeader}>
        <div>
          <h2 className={styles.directoryTitle}>Admin Directory</h2>
          <p className={styles.directorySubtitle}>
            System administrators with full access
          </p>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data ?? []}
        rowKey="id"
        loading={isLoading}
        size="small"
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10, showTotal: (t) => `${t} admins` }}
        className={styles.employeeTable}
      />
    </div>
  );
};

export default AdminDirectoryComp;
