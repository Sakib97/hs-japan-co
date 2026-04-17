import { useQuery } from "@tanstack/react-query";
import styles from "../styles/TeamMembersComp.module.css";
import { supabase } from "../../../config/supabaseClient";

const TeamMembersComp = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["team_page_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_page")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data.map((d) => ({ ...d, key: String(d.id) }));
    },
  });

  const chairman = data[0] ?? null;
  const members = data.slice(1);

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <span className={styles.spinner} />
            <span>Loading team members...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* ── decorative dot + heading ── */}
        <div className={styles.headerArea}>
          <span className={styles.decorDot}></span>
          <h2 className={styles.heading}>Our Qualified Team</h2>
        </div>

        {/* ── chairman card ── */}
        {chairman && (
          <div className={styles.chairmanWrapper}>
            <div className={styles.chairmanCard}>
              <div className={styles.chairmanImgWrap}>
                <img
                  src={chairman.member_image_url}
                  alt={chairman.member_name}
                  className={styles.chairmanImg}
                />
              </div>
              <h3 className={styles.chairmanName}>{chairman.member_name}</h3>
              <p className={styles.chairmanRole}>
                {chairman.member_designation}
              </p>
            </div>
          </div>
        )}

        {/* ── members grid ── */}
        <div className={styles.grid}>
          {members.map((m) => (
            <div key={m.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardInfo}>
                  <h4 className={styles.memberName}>{m.member_name}</h4>
                  <p className={styles.memberRole}>{m.member_designation}</p>
                </div>
              </div>
              <div className={styles.memberImgWrap}>
                <img
                  src={m.member_image_url}
                  alt={m.member_name}
                  className={styles.memberImg}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMembersComp;
