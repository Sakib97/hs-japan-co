import WhyJapanBannerComp from "../components/WhyJapanBannerComp";
import BetterFutureComp from "../components/BetterFutureComp";
import TechnologyComp from "../components/TechnologyComp";
import BuildDreamComp from "../components/BuildDreamComp";
import { IMAGE_SIZES } from "../../../config/imageSizeConfig";
import { useAuth } from "../../../context/AuthProvider";
import { Spin, Skeleton } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import EditModeToggleBtn from "../../../components/common/EditModeToggleBtn";
import styles from "../styles/WhyJapanPage.module.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QK_WHY_JAPAN_PAGE } from "../../../config/queryKeyConfig";
import { supabase } from "../../../config/supabaseClient";
import WhyJapanLoading from "../../../components/loadingSkeletons/WhyJapanLoading";

const WhyJapanPage = () => {
  const { user, userMeta } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: pageData, isLoading } = useQuery({
    queryKey: [QK_WHY_JAPAN_PAGE],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_why_japan_page");

      if (error) throw new Error(error.message);
      return data;
    },
  });

  const sections = pageData?.sections ?? [];
  const bydCards = pageData?.bydCards ?? [];

  const betterFuture = sections.find((s) => s.section_name === "better_future");
  const advancedTech = sections.find(
    (s) => s.section_name === "advanced_technology",
  );

  return (
    <div className={styles.page}>
      {isLoading ? (
        // <div style={{ padding: "120px 10vw 4rem" }}>
        //   <Skeleton active paragraph={{ rows: 10 }} />
        // </div>
        <WhyJapanLoading />
      ) : (
        <>
          {user && userMeta?.role === "admin" && (
            <EditModeToggleBtn
              isEditMode={isEditMode}
              onToggle={() => setIsEditMode(!isEditMode)}
            />
          )}
          <WhyJapanBannerComp isEditMode={isEditMode} />
          {isEditMode && (
            <div className={styles.editGuideline}>
              <i className="fa-solid fa-circle-info" />
              <span>
                Max image size:{" "}
                <strong>{IMAGE_SIZES.WHY_JAPAN_PAGE.label}</strong>{" "}
                &nbsp;|&nbsp; Preferred resolution:{" "}
                <strong>840 × 560 px</strong>
              </span>
            </div>
          )}
        {/* <WhyJapanLoading /> */}

          <BetterFutureComp isEditMode={isEditMode} data={betterFuture} />
          <TechnologyComp isEditMode={isEditMode} data={advancedTech} />
          <BuildDreamComp isEditMode={isEditMode} data={bydCards} />
        </>
      )}
    </div>
  );
};

export default WhyJapanPage;
