import { useAuth } from "../../../context/AuthProvider";
import { USER_ROLES } from "../../../config/statusAndRoleConfig";
import SuccessStoriesComp from "../components/homePageManagement/SuccessStoriesComp";
import CorePillersComp from "../components/homePageManagement/CorePillersComp";

const HomePageManagement = () => {
  const { userMeta } = useAuth();
  const isAdmin = userMeta?.role === USER_ROLES.ADMIN;

  return (
    <div>
      <h3>Home Page Management</h3>
      {isAdmin && <CorePillersComp />}
      <br />
      <SuccessStoriesComp />
      <br />
      <br />
      <br />
      <br />
      
    </div>
  );
};

export default HomePageManagement;
