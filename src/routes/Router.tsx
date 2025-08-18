import { Navigate, RouteObject } from "react-router-dom";
import Layout from "./Layout";
import Home from "@/pages/Home";

export const PublicRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: '/egressos/', element: <Home/> },
            { path: '*', element: <Navigate to="/egressos/" replace /> },
        ]
    }
];