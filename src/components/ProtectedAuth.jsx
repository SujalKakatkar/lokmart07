import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router'

function ProtectedAuth({ children }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  if(user) {
    return <Navigate to="/" replace />;
  }

  return (
    children
  )
}

export default ProtectedAuth