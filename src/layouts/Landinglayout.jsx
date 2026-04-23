import React from 'react'
import {Outlet} from 'react-router'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

function Landinglayout() {
    const {  loading } = useAuth()
    if(loading) return <div>Loading...</div>
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default Landinglayout
