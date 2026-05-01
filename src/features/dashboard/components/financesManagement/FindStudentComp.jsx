import { useState } from "react";
import { Input, Button } from "antd";
import styles from "../../styles/FindStudentComp.module.css";

const FindStudentComp = ({ onStudentFound }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const val = query.trim();
    if (!val) return;
    setLoading(true);
    // Caller handles the actual lookup; pass raw query up
    await onStudentFound?.(val);
    setLoading(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrap}>
          <i className="fi fi-rr-student"></i>
        </div>
        <div>
          <h3 className={styles.title}>Find Student</h3>
          <p className={styles.subtitle}>
            Search the database by verified credentials
          </p>
        </div>
      </div>

      <div className={styles.searchRow}>
        <Input
          className={styles.input}
          placeholder="Email or Phone Number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={handleSearch}
          allowClear
        />
        <Button
          type="primary"
          className={styles.searchBtn}
          onClick={handleSearch}
          loading={loading}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default FindStudentComp;
