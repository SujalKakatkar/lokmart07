import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router';
import { useState } from 'react';

function ProtectAdmin({ children }) {
    const [admin, setAdmin] = useState(null)
    const { user, loading } = useAuth()
    const navigate = useNavigate()

    if(!user) {
        return <Navigate to="/auth/signin" replace />;
    }

    useEffect(() => {

        const getRole = async () => {
            if(!user) return
            const data = await fetchProfile(user.id);
            if(data) {
                const role = data.role
                if(role !== "admin") navigate("/")
            }
        }
        getRole()

    }, [user])

    return (
        children
    )
}

export default ProtectAdmin
