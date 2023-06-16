import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/login/Login'
import Chart from '../pages/chart/Chart'
const PageRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/login' element={<Login />} />

                <Route path='/chart' element={<Chart />} />

            </Routes>
        </>
    )
}

export default PageRoutes
