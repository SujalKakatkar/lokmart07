import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router'
import { useEffect } from 'react';

function ProtectRoleSelection({ children }) {

    const { user, loading } = useAuth()
    if(!user) {
        return <Navigate to="/auth/signin" replace />;
    }



    if(loading) return <div>loding...</div>

    return (
        children
    )
}

export default ProtectRoleSelection
