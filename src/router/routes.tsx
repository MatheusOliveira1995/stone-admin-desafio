import * as React from "react";
import { useRoutes } from "react-router-dom"

import MainLayout from "src/layouts/MainLayout"

import Dashboard from "src/pages/Dashboard"
import Users from "src/pages/Users"
import SignIn from "src/pages/Auth/SignIn"
import Cards from "src/pages/Cards"

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
            path: '/cards',
            element: <MainLayout />,
            children: [
                {
                    path: '/cards',
                    element: <Cards />
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
