import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router'
import { useEffect } from 'react';
import { useState } from 'react';

function ProtectRoleSelection({ children }) {
    const [shopOwner, setShopOwner] = useState(false)
    const { user, loading } = useAuth()
    
    if(!user) {
        return <Navigate to="/auth/signin" replace />;
    }

    useEffect(() => {

        const getRole = async () => {
            if(!user) return
            const data = await fetchProfile(user.id);
            if(data) {
                if(data.role === "shopowner") setShopOwner(true)
            }
        }
        getRole()

    }, [user])


    if(shopOwner) return <Navigate to="/auth/signin" replace />;

    if(loading) return <div>loding...</div>

    return (
        children
    )
}

export default ProtectRoleSelection
