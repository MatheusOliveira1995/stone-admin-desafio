import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from 'src/pages/Dashboard'


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
        </Routes>
    )
}