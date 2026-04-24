import { useEffect } from "react";
import { useAuth } from "../context/AuthContext"
import { useState } from "react";
import { Navigate } from "react-router";

function ProtectedShopDashboard({ children }) {
  const [shopOwner, setShopOwner] = useState(false)
  const { user, fetchProfile } = useAuth()

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

  if(!shopOwner) return <Navigate to="/" replace />;



  return (
    children
  )
}

export default ProtectedShopDashboard