import { useAuth } from "../../context/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import NotFound from "./NotFound";

const AdminOnlyRoute = ({ children }) => {
  const { user, userMeta, loading, userMetaLoading } = useAuth();
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

  // If not logged in
  if (!user) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  // If user is not an active admin
  if (!userMeta || userMeta.is_active === false || userMeta.role !== "admin") {
    return <NotFound />;
  }

  // Authorized admin
  return children;
};

export default AdminOnlyRoute;
