import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const accessLevel = localStorage.getItem("accessLevel");
  console.log("PR", accessLevel);

  if (!accessLevel) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
