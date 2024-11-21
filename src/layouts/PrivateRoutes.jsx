import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = () => {
    let token = Boolean(localStorage.getItem('access_token'));

    return (
        token ? <Outlet /> : <Navigate to='/login' />
    )
}

export default PrivateRoutes;