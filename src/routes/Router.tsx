import { Navigate, RouteObject } from "react-router-dom";
import Layout from "./Layout";
import Home from "@/pages/Home";
import VisualizadorPlaca from "@/pages/VisualizadorPlaca";
import CoordinatorHome from "@/pages/CoordinatorHome";
import VisualizadorPlacaCoordinator from "@/pages/VisualizadorPlacaCoordinator";
import CommissionHome from "@/pages/CommissionHome";

export const PublicRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: '/egressos/', element: <Home/> },
            { path: '*', element: <Navigate to="/egressos/" replace /> },
            { path: '/egressos/placa/:id', element: <VisualizadorPlaca />},
            { path: '/egressos/coordenador/placa/:id', element: <VisualizadorPlacaCoordinator />},
            { path: '/egressos/coordenador', element: <CoordinatorHome /> },
            { path: '/egressos/comissao', element: <CommissionHome />}
        ]
    }
];