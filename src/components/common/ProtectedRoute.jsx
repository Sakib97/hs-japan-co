import { Navigate, useLocation } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from "../../context/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ textAlign: 'center',  margin: '100px'}}>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>;

  if (!user) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;