import React from 'react'
import Header from './Header'
import SideBar from './Sidebar'
import { Outlet } from 'react-router-dom'

const Main = () => {
    return (
        <div className='sb-nav-fixed'>
            <Header />
            <div id="layoutSidenav">
                <SideBar />
                <Outlet />
            </div>
        </div>
    )
}

export default Main