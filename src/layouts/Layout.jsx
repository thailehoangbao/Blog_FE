import React from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { ScaleLoader } from 'react-spinners'
import { useSelector } from 'react-redux'

const override = {
    position: "absolute",
    top:"0",
    left:"0",
    textAlign: "center",
    backgroundColor: 'rgb(0 0 0 / 30%)',
    zIndex: "999",
    width: "100%",
    height: "100%",
    display: "block"
}

const Layout = () => {
    const statusLoading = useSelector(state => state.globalLoading.status)
    return (
        <div style={{ position:"relative", marginTop: '100px' }}>
            <ScaleLoader loading={statusLoading} cssOverride={override} color='#36d7b7'/>
            <Outlet />
            <ToastContainer />
        </div>
    )
}

export default Layout