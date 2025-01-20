import React from "react";
import { Route, Navigate, RouteProps } from "react-router-dom";

type PrivateRouteProps = RouteProps & {
    requiredRole: string;
    component: React.ComponentType<any>;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, requiredRole, ...rest }) => {
    const token = localStorage.getItem("userToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userRole = user?.platformUsage;

    return (
        <Route
            {...rest}
            element={
                token && userRole === requiredRole ? (
                    <Component />
                ) : (
                    <Navigate to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;
