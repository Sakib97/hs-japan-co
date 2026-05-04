import { useState } from "react";
import { Table, Tag, Avatar, Button, Tooltip, Dropdown } from "antd";
import {
  FilterOutlined,
  DownloadOutlined,
  SettingOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import styles from "../../styles/EmployeeManagementPage.module.css";
import { supabase } from "../../../../config/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  QK_EMPLOYEES,
  QK_DEPARTMENTS,
  QK_DESIGNATIONS,
} from "../../../../config/queryKeyConfig";

const PAGE_SIZE = 10;

const ACTIVITY_STATUS_OPTIONS = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];

const columns = [
  {
    title: "NAME",
    key: "name",
    render: (_, record) => (
      <div className={styles.nameCell}>
        <Avatar size={36} className={styles.employeeAvatar}>
          {record.users_meta?.name?.charAt(0) ?? record.email.charAt(0)}
        </Avatar>
        <div>
          <div className={styles.employeeName}>
            {record.users_meta?.name ?? "—"}
          </div>
          <div className={styles.employeeEmail}>{record.email}</div>
        </div>
      </div>
    ),
  },
  {
    title: "DESIGNATION",
    key: "designation",
    render: (_, record) => (
      <span className={styles.cellText}>
        {record.designations?.designation_name ?? "—"}
      </span>
    ),
  },
  {
    title: "DEPARTMENT",
    key: "department",
    render: (_, record) => (
      <span className={styles.cellText}>
        {record.departments?.department_name ?? "—"}
      </span>
    ),
  },
  {
    title: "STATUS",
    key: "status",
    render: (_, record) => {
      const active = record.activity_status !== false;
      return (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      );
    },
  },
  {
    title: "ACTIONS",
    key: "actions",
    fixed: "right",
    render: () => (
      <div style={{ display: "flex", gap: 18 }}>
        <Tooltip title="Change Status">
          <i className={`fi fi-rr-career-growth ${styles.actionIcon}`}></i>
        </Tooltip>
        <Tooltip title="Change Department/Designation">
          <i className={`fi fi-rr-pc-chair ${styles.actionIcon}`}></i>
        </Tooltip>
      </div>
    ),
  },
];

const EmployeeDirectoryComp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const queryClient = useQueryClient();

  const { data: departmentsData = [] } = useQuery({
    queryKey: [QK_DEPARTMENTS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("department_name")
        .order("department_name", { ascending: true });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const { data: designationsData = [] } = useQuery({
    queryKey: [QK_DESIGNATIONS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("designations")
        .select("designation_name")
        .order("designation_name", { ascending: true });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      QK_EMPLOYEES,
      currentPage,
      selectedStatus,
      selectedDepartment,
      selectedDesignation,
    ],
    queryFn: async () => {
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("employees")
        .select(
          `
          email,
          activity_status,
          departments(department_name),
          designations(designation_name),
          users_meta(name, avatar_url)
          `,
          // { count: "exact" },
        )
        .range(from, to);

      if (selectedStatus !== null) {
        query = query.eq("activity_status", selectedStatus);
      }
      if (selectedDepartment) {
        query = query.eq("departments.department_name", selectedDepartment);
      }
      if (selectedDesignation) {
        query = query.eq("designations.designation_name", selectedDesignation);
      }

      const { data, error, count } = await query;
      if (error) throw new Error(error.message);
      return { rows: data, total: count };
    },
    keepPreviousData: true,
  });

  return (
    <div className={styles.directorySection}>
      <div className={styles.directoryHeader}>
        <div>
          <h2 className={styles.directoryTitle}>Employee Directory</h2>
          <p className={styles.directorySubtitle}>
            Manage personnel records and access permissions
          </p>
        </div>
        <Button
          icon={<i className="fi fi-rr-refresh"></i>}
          size={"medium"}
          // loading={isFetching}
          onClick={() => {
            setCurrentPage(1);
            queryClient.invalidateQueries({ queryKey: [QK_EMPLOYEES] });
          }}
        >
          Refresh
        </Button>

        <Dropdown
          menu={{
            items: [
              {
                key: "__all__",
                label: <span>All Statuses</span>,
                onClick: () => {
                  setSelectedStatus(null);
                  setCurrentPage(1);
                },
              },
              ...ACTIVITY_STATUS_OPTIONS.map((opt) => ({
                key: String(opt.value),
                label: <span>{opt.label}</span>,
                onClick: () => {
                  setSelectedStatus(opt.value);
                  setCurrentPage(1);
                },
              })),
            ],
          }}
          placement="bottomLeft"
        >
          <Button
            type={selectedStatus !== null ? "primary" : ""}
            icon={<i className="fi fi-rr-filter"></i>}
            size={"medium"}
          >
            {ACTIVITY_STATUS_OPTIONS.find((o) => o.value === selectedStatus)
              ?.label ?? "Status"}
          </Button>
        </Dropdown>

        <Dropdown
          menu={{
            items: [
              {
                key: "__all__",
                label: <span>All Departments</span>,
                onClick: () => {
                  setSelectedDepartment(null);
                  setCurrentPage(1);
                },
              },
              ...departmentsData.map((d) => ({
                key: d.department_name,
                label: <span>{d.department_name}</span>,
                onClick: () => {
                  setSelectedDepartment(d.department_name);
                  setCurrentPage(1);
                },
              })),
            ],
          }}
          placement="bottomLeft"
        >
          <Button
            type={selectedDepartment ? "primary" : ""}
            icon={<i className="fi fi-rr-filter"></i>}
            size={"medium"}
          >
            {selectedDepartment ?? "Department"}
          </Button>
        </Dropdown>

        <Dropdown
          menu={{
            items: [
              {
                key: "__all__",
                label: <span>All Designations</span>,
                onClick: () => {
                  setSelectedDesignation(null);
                  setCurrentPage(1);
                },
              },
              ...designationsData.map((d) => ({
                key: d.designation_name,
                label: <span>{d.designation_name}</span>,
                onClick: () => {
                  setSelectedDesignation(d.designation_name);
                  setCurrentPage(1);
                },
              })),
            ],
          }}
          placement="bottomLeft"
        >
          <Button
            type={selectedDesignation ? "primary" : ""}
            icon={<i className="fi fi-rr-filter"></i>}
            size={"medium"}
          >
            {selectedDesignation ?? "Designation"}
          </Button>
        </Dropdown>
      </div>

      <Table
        columns={columns}
        dataSource={data?.rows ?? []}
        rowKey="email"
        loading={isLoading || isFetching}
        size="small"
        scroll={{ x: "max-content" }}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: data?.total ?? 0,
          showTotal: (total, range) =>
            `Showing ${range[0]}–${range[1]} of ${total.toLocaleString()} employees`,
          onChange: (page) => setCurrentPage(page),
        }}
        className={styles.employeeTable}
      />
    </div>
  );
};

export default EmployeeDirectoryComp;
