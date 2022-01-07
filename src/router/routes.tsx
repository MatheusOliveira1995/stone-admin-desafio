import * as React from "react";
import { useRoutes } from "react-router-dom";

import MainLayout from "src/layouts/MainLayout";

import Dashboard from "src/pages/Dashboard"
import Users from "src/pages/Users";
import SignIn from "src/pages/Auth/SignIn"


export default function Routes() {

    const routes = useRoutes([
        {
            path: '*',
            element: <MainLayout />,
            children: [
                {
                    path: 'dashboard',
                    element: <Dashboard />
                }
            ]
        },
        {
            path: '/users',
            element: <MainLayout />,
            children: [
                {
                    path: '/users',
                    element: <Users />
                }
            ]
        },
        {
            path:'/login',
            element: <SignIn/>
        }
    ])

    return routes
}
