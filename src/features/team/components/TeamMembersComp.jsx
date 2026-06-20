import { useQuery } from "@tanstack/react-query";
import { QK_TEAM_PAGE_MEMBERS } from "../../../config/queryKeyConfig";
import styles from "../styles/TeamMembersComp.module.css";
import { supabase } from "../../../config/supabaseClient";
import TeamPageLoading from "../../../components/loadingSkeletons/TeamPageLoading";

const MemberDetails = ({ details, className }) => {
  if (!details?.trim()) return null;

  return <p className={className}>{details.trim()}</p>;
};

const TeamMembersComp = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: [QK_TEAM_PAGE_MEMBERS],
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

  if (isLoading) return <TeamPageLoading />;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <span className={styles.decorDot} />
          <h2 className={styles.heading}>Our Qualified Team</h2>
        </div>

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
              <div className={styles.chairmanBody}>
                <h3 className={styles.chairmanName}>{chairman.member_name}</h3>
                <p className={styles.chairmanRole}>
                  {chairman.member_designation}
                </p>
                <MemberDetails
                  details={chairman.member_details}
                  className={styles.chairmanDetails}
                />
              </div>
            </div>
          </div>
        )}

        {members.length > 0 && (
          <div className={styles.grid}>
            {members.map((m) => (
              <article key={m.id} className={styles.card}>
                <div className={styles.memberImgWrap}>
                  <img
                    src={m.member_image_url}
                    alt={m.member_name}
                    className={styles.memberImg}
                  />
                </div>
                <div className={styles.cardBody}>
                  <h4 className={styles.memberName}>{m.member_name}</h4>
                  <p className={styles.memberRole}>{m.member_designation}</p>
                  <MemberDetails
                    details={m.member_details}
                    className={styles.memberDetails}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamMembersComp;
