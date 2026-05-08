import { useState, useEffect } from "react";
import { Button, Popconfirm, Spin } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../config/supabaseClient";
import { QK_CONTACT_US } from "../../../config/queryKeyConfig";
import { showToast } from "../../../components/layout/CustomToast";
import styles from "../styles/ContactInfoComp.module.css";

const EMPTY_OFFICE = {
  office_name: "",
  office_hours: "",
  address: "",
  phone: "",
  email: "",
};

const ContactInfoComp = ({ isEditMode }) => {
  const queryClient = useQueryClient();
  const [draftMap, setDraftMap] = useState({});
  const [newOffice, setNewOffice] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const { data: offices = [], isLoading } = useQuery({
    queryKey: [QK_CONTACT_US],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_us")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Sync draft state from fetched data whenever edit mode is on or data refreshes
  useEffect(() => {
    if (isEditMode) {
      const map = {};
      offices.forEach((o) => {
        map[o.id] = {
          office_name: o.office_name ?? "",
          office_hours: o.office_hours ?? "",
          address: o.address ?? "",
          phone: o.phone ?? "",
          email: o.email ?? "",
        };
      });
      setDraftMap(map);
    } else {
      setNewOffice(null);
    }
  }, [isEditMode, offices]);

  const setField = (id, field, value) =>
    setDraftMap((m) => ({ ...m, [id]: { ...m[id], [field]: value } }));

  const setNewField = (field, value) =>
    setNewOffice((n) => ({ ...n, [field]: value }));

  const { mutate: updateOffice } = useMutation({
    mutationFn: async ({ id, ...fields }) => {
      const { error } = await supabase
        .from("contact_us")
        .update(fields)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QK_CONTACT_US] });
      showToast("Office updated", "success");
    },
    onError: (err) => showToast(err.message || "Failed to update !", "error"),
    onSettled: () => setSavingId(null),
  });

  const { mutate: deleteOffice } = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("contact_us").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QK_CONTACT_US] });
      showToast("Office deleted", "success");
    },
    onError: (err) => showToast(err.message || "Failed to delete !", "error"),
  });

  const { mutate: addOffice, isPending: adding } = useMutation({
    mutationFn: async (fields) => {
      const { error } = await supabase.from("contact_us").insert(fields);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QK_CONTACT_US] });
      showToast("Office added", "success");
      setNewOffice(null);
    },
    onError: (err) => showToast(err.message || "Failed to add !", "error"),
  });

  const handleSave = (id) => {
    setSavingId(id);
    updateOffice({ id, ...draftMap[id] });
  };

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "60px 0",
            }}
          >
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.mainHeading}>Find Us</h2>

        <div className={styles.layout}>
          <div className={styles.officesGrid}>
            {/* ── Existing offices ── */}
            {offices.map((o) => (
              <div key={o.id} className={styles.officeBlock}>
                {isEditMode ? (
                  <>
                    <input
                      className={styles.editInput}
                      placeholder="Office Name"
                      value={draftMap[o.id]?.office_name ?? ""}
                      onChange={(e) =>
                        setField(o.id, "office_name", e.target.value)
                      }
                    />
                    <div className={styles.editRow}>
                      <span className={styles.editLabel}>
                        <i className="fa-solid fa-clock" />
                      </span>
                      <input
                        className={styles.editInput}
                        placeholder="Office Hours"
                        value={draftMap[o.id]?.office_hours ?? ""}
                        onChange={(e) =>
                          setField(o.id, "office_hours", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.editRow}>
                      <span className={styles.editLabel}>
                        <i className="fa-solid fa-location-dot" />
                      </span>
                      <input
                        className={styles.editInput}
                        placeholder="Address"
                        value={draftMap[o.id]?.address ?? ""}
                        onChange={(e) =>
                          setField(o.id, "address", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.editRow}>
                      <span className={styles.editLabel}>
                        <i className="fa-solid fa-phone" />
                      </span>
                      <input
                        className={styles.editInput}
                        placeholder="Phone"
                        value={draftMap[o.id]?.phone ?? ""}
                        onChange={(e) =>
                          setField(o.id, "phone", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.editRow}>
                      <span className={styles.editLabel}>
                        <i className="fa-solid fa-envelope" />
                      </span>
                      <input
                        className={styles.editInput}
                        placeholder="Email"
                        value={draftMap[o.id]?.email ?? ""}
                        onChange={(e) =>
                          setField(o.id, "email", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.editActions}>
                      <Button
                        size="small"
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={savingId === o.id}
                        onClick={() => handleSave(o.id)}
                      >
                        Save
                      </Button>
                      <Popconfirm
                        title="Delete this office?"
                        description="This action cannot be undone."
                        okText="Delete"
                        okType="danger"
                        cancelText="Cancel"
                        onConfirm={() => deleteOffice(o.id)}
                      >
                        <Button size="small" danger icon={<DeleteOutlined />}>
                          Delete
                        </Button>
                      </Popconfirm>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className={styles.officeName}>{o.office_name}</h3>
                    {o.office_hours && (
                      <div className={styles.infoRow}>
                        <span className={styles.iconCircle}>
                          <i
                            className={`${styles.iconStyle} fa-solid fa-clock`}
                          />
                        </span>
                        <span className={styles.infoText}>
                          {o.office_hours}
                        </span>
                      </div>
                    )}
                    {o.address && (
                      <div className={styles.infoRow}>
                        <span className={styles.iconCircle}>
                          <i
                            className={`${styles.iconStyle} fa-solid fa-location-dot`}
                          />
                        </span>
                        <span
                          className={`${styles.infoText} ${styles.linkText}`}
                        >
                          {o.address}
                        </span>
                      </div>
                    )}
                    {o.phone && (
                      <div className={styles.infoRow}>
                        <span className={styles.iconCircle}>
                          <i
                            className={`${styles.iconStyle} fa-solid fa-phone`}
                          />
                        </span>
                        <span className={styles.infoText}>{o.phone}</span>
                      </div>
                    )}
                    {o.email && (
                      <div className={styles.infoRow}>
                        <span className={styles.iconCircle}>
                          <i
                            className={`${styles.iconStyle} fa-solid fa-envelope`}
                          />
                        </span>
                        <span
                          className={`${styles.infoText} ${styles.linkText}`}
                        >
                          {o.email}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* ── New Office Form ── */}
            {isEditMode && newOffice && (
              <div className={`${styles.officeBlock} ${styles.newOfficeBlock}`}>
                <input
                  className={styles.editInput}
                  placeholder="Office Name *"
                  value={newOffice.office_name}
                  onChange={(e) => setNewField("office_name", e.target.value)}
                  autoFocus
                />
                <div className={styles.editRow}>
                  <span className={styles.editLabel}>
                    <i className="fa-solid fa-clock" />
                  </span>
                  <input
                    className={styles.editInput}
                    placeholder="Office Hours"
                    value={newOffice.office_hours}
                    onChange={(e) =>
                      setNewField("office_hours", e.target.value)
                    }
                  />
                </div>
                <div className={styles.editRow}>
                  <span className={styles.editLabel}>
                    <i className="fa-solid fa-location-dot" />
                  </span>
                  <input
                    className={styles.editInput}
                    placeholder="Address"
                    value={newOffice.address}
                    onChange={(e) => setNewField("address", e.target.value)}
                  />
                </div>
                <div className={styles.editRow}>
                  <span className={styles.editLabel}>
                    <i className="fa-solid fa-phone" />
                  </span>
                  <input
                    className={styles.editInput}
                    placeholder="Phone"
                    value={newOffice.phone}
                    onChange={(e) => setNewField("phone", e.target.value)}
                  />
                </div>
                <div className={styles.editRow}>
                  <span className={styles.editLabel}>
                    <i className="fa-solid fa-envelope" />
                  </span>
                  <input
                    className={styles.editInput}
                    placeholder="Email"
                    value={newOffice.email}
                    onChange={(e) => setNewField("email", e.target.value)}
                  />
                </div>
                <div className={styles.editActions}>
                  <Button
                    size="small"
                    type="primary"
                   
                    icon={<PlusOutlined />}
                    loading={adding}
                    disabled={!newOffice.office_name.trim()}
                    onClick={() => addOffice(newOffice)}
                  >
                    Add Office
                  </Button>
                  <Button size="small" onClick={() => setNewOffice(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Add Office button ── */}
        {isEditMode && !newOffice && (
          <div className={styles.addOfficeRow}>
            <Button
              icon={<PlusOutlined />}
               className={styles.editBtn}
              onClick={() => setNewOffice({ ...EMPTY_OFFICE })}
            >
              Add Office
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactInfoComp;
