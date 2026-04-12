import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthProvider";

const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div
        style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}
      >
        Loading...
      </div>
    );
  return user ? <Navigate to="/dashboard" /> : children;
};

export default AuthRedirect;
