import * as React from "react";
import { useRoutes, Navigate } from "react-router-dom"

import MainLayout from "src/layouts/MainLayout"

import Dashboard from "src/pages/Dashboard"
import Users from "src/pages/Users"
import SignIn from "src/pages/SignIn"
import Cards from "src/pages/Cards"
import Audits from "src/pages/Audits";

import { useAppSelector } from "src/app/hooks";

export default function Routes() {
    const analyst = useAppSelector((state) => state.analyst)
    const isLoggedIn = analyst.id

    const routes = useRoutes([
        {
            path: '*',
            element: isLoggedIn ? <MainLayout /> : <Navigate to='/login'/>,
            children: [
                {
                    path: '*',
                    element: <Dashboard />
                }
            ]
        },
        {
            path: '/users',
            element: isLoggedIn ? <MainLayout /> : <Navigate to='/login'/>,
            children: [
                {
                    path: '/users',
                    element: <Users />
                }
            ]
        },
        {
            path: '/cards',
            element: isLoggedIn ? <MainLayout /> : <Navigate to='/login'/>,
            children: [
                {
                    path: '/cards',
                    element: <Cards />
                }
            ]
        },
        {
            path: '/audits',
            element: isLoggedIn ? <MainLayout /> : <Navigate to='/login'/>,
            children: [
                {
                    path: '/audits',
                    element: <Audits />
                }
            ]
        },
        {
            path:'/login',
            element: !isLoggedIn ? <SignIn/> : <Navigate to='/dashboard'/>,
        }
    ])

    return routes
}
