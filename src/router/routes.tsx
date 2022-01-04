import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from 'src/pages/Dashboard'
import User from 'src/pages/Users'


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/dashboard/users" element={<User/>}/>
            <Route path="*" element={<Dashboard/>}/>
        </Routes>
    )
}