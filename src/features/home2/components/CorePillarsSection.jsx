import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../config/supabaseClient";
import { QK_HOME_CORE_PILLERS } from "../../../config/queryKeyConfig";
import CorePillarsLoading from "../../../components/loadingSkeletons/CorePillarsLoading";
import styles from "./CorePillarsSection.module.css";

const CorePillarsSection = () => {
  const { data: pillars = [], isLoading } = useQuery({
    queryKey: [QK_HOME_CORE_PILLERS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("core_pillers")
        .select("id, title, content, icon")
        .order("id", { ascending: true });

      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  if (isLoading) return <CorePillarsLoading />;

  if (pillars.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Our Core Pillars</h2>
        <div className={styles.titleBar} />
      </div>
      <div className={styles.cards}>
        {pillars.map((pillar) => (
          <div key={pillar.id} className={styles.card}>
            {pillar.icon && (
              <div className={styles.iconWrap}>
                <i className={pillar.icon} />
              </div>
            )}
            <h3 className={styles.cardTitle}>{pillar.title}</h3>
            {pillar.content && (
              <div
                className={styles.cardDesc}
                dangerouslySetInnerHTML={{ __html: pillar.content }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CorePillarsSection;
