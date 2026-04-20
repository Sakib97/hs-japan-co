import WhyJapanBannerComp from "../components/WhyJapanBannerComp";
import BetterFutureComp from "../components/BetterFutureComp";
import TechnologyComp from "../components/TechnologyComp";
import BuildDreamComp from "../components/BuildDreamComp";
import { useAuth } from "../../../context/AuthProvider";
import { Button } from "antd";
import styles from "../styles/WhyJapanPage.module.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../config/supabaseClient";

const WhyJapanPage = () => {
  const { user, userMeta } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: sections = [] } = useQuery({
    queryKey: ["why-japan-page"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("why_japan_page")
        .select("section_name, section_content, section_image_link, image_size")
        .order("section_order", { ascending: true });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const betterFuture = sections.find((s) => s.section_name === "better_future");
  const advancedTech = sections.find(
    (s) => s.section_name === "advanced_technology",
  );

  return (
    <div className={styles.page}>
      {user && userMeta?.role === "admin" && (
        <div className={styles.editBtnRow}>
          <Button
            className={styles.editBtn}
            icon={
              isEditMode ? (
                <i className="fa-solid fa-xmark" />
              ) : (
                <i className="fa-solid fa-pen-to-square" />
              )
            }
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? "Cancel" : "Enable Edit Mode"}
          </Button>
        </div>
      )}
      <WhyJapanBannerComp isEditMode={isEditMode} />
      {isEditMode && (
        <div className={styles.editGuideline}>
          <i className="fa-solid fa-circle-info" />
          <span>
            Max image size: <strong>2 MB</strong> &nbsp;|&nbsp; Preferred
            resolution: <strong>840 × 560 px</strong>
          </span>
        </div>
      )}
      <BetterFutureComp isEditMode={isEditMode} data={betterFuture} />
      <TechnologyComp isEditMode={isEditMode} data={advancedTech} />
      <BuildDreamComp isEditMode={isEditMode} />
    </div>
  );
};

export default WhyJapanPage;
