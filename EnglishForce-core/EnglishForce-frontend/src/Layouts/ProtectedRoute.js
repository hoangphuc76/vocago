import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const userRole = localStorage.getItem("userRole") || "user";
    // Nếu không có user hoặc role không khớp, chuyển hướng về trang home hoặc login
    if (!userRole || userRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
