import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Spinner from "react-bootstrap/Spinner";
import NotFound from "./NotFound";

const RoleBasedRoute = ({
  allowedRoles,
  allowedEmployeeStatuses,
  children,
}) => {
  const {
    user,
    userMeta,
    loading,
    userMetaLoading,
    studentStatus,
    employeeStatus,
  } = useAuth();
  const location = useLocation();

  // Show spinner while auth or userMeta is still loading
  if (loading || userMetaLoading) {
    return (
      <div style={{ textAlign: "center", margin: "100px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  //   If not logged in
  if (!user || !userMeta) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  if (userMeta.is_active === false || !allowedRoles.includes(userMeta.role)) {
    return <NotFound />;
  }

  if (userMeta.role === "student" && studentStatus !== "enrolled") {
    return <NotFound />;
  }

  if (
    userMeta.role === "employee" &&
    !["full_time", "part_time"].includes(employeeStatus)
  ) {
    return <NotFound />;
  }

  if (
    userMeta.role === "employee" &&
    allowedEmployeeStatuses &&
    !allowedEmployeeStatuses.includes(employeeStatus)
  ) {
    return <NotFound />;
  }

  return children;
};

export default RoleBasedRoute;
