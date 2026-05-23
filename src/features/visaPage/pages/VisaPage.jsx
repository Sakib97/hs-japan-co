import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Skeleton, Result } from "antd";
import { supabase } from "../../../config/supabaseClient";
import { QK_VISA_PAGE_BY_SLUG } from "../../../config/queryKeyConfig";
import VisaPageHeroComp from "../components/VisaPageHeroComp";
import VisaPageEligibilityComp from "../components/VisaPageEligibilityComp";
import VisaPageApplicationProcessComp from "../components/VisaPageApplicationProcessComp";
import VisaPageRequiredDocsComp from "../components/VisaPageRequiredDocsComp";
import VisaPageLoading from "../../../components/loadingSkeletons/VisaPageLoading";


const VisaPage = () => {
  const { visaSlug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: [QK_VISA_PAGE_BY_SLUG, visaSlug],
    queryFn: async () => {
      const { data: result, error } = await supabase.rpc(
        "get_visa_page_by_slug",
        { p_slug: visaSlug },
      );
      if (error) throw error;
      return result;
    },
    enabled: !!visaSlug,
  });

  if (isLoading) {
    return (
    //   <div style={{ padding: "120px 10vw 4rem" }}>
    //     <Skeleton active paragraph={{ rows: 10 }} />
    //   </div>
        <VisaPageLoading />
    );
  }

  if (isError || !data) {
    return (
      <div style={{ paddingTop: "80px" }}>
        <Result
          status="404"
          title="Page Not Found"
          subTitle="This visa page does not exist or has not been published yet."
        />
      </div>
    );
  }

  return (
    <div>
      {data.hero && <VisaPageHeroComp hero={data.hero} />}

      {data.eligibility_section && data.eligibility_items?.length > 0 && (
        <VisaPageEligibilityComp
          section={data.eligibility_section}
          items={data.eligibility_items}
        />
      )}

      {data.application_process_section &&
        data.application_steps?.length > 0 && (
          <VisaPageApplicationProcessComp
            section={data.application_process_section}
            steps={data.application_steps}
          />
        )}


      {data.required_docs_section && (
        <VisaPageRequiredDocsComp
          section={data.required_docs_section}
          documents={data.documents || []}
          sideImage={data.side_image}
        />
      )}
    </div>
  );
};

export default VisaPage;
