import React from 'react'
import { ShoppingBag, Menu, User, ShoppingCart, Search } from 'lucide-react'
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'
import { useEffect } from 'react'
import { useState } from 'react'

function Navbar() {
  const [role, setRole] = useState(null)

  const { user, handleLogout, fetchProfile } = useAuth()


  useEffect(() => {

    const getRole = async () => {
      if(!user) return
      const data = await fetchProfile(user.id);
      if(data) {
        setRole(data.role)
      }
    }
    getRole()

  }, [user])

  return (
    <nav className="sticky top-0 z-50 glass border-b bg-white border-slate-100 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">LokMart</span>
        </Link>


        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="p-2.5 text-slate-500 hover:text-brand-primary transition-colors bg-slate-50 rounded-xl md:hidden">
            <Search className="w-5 h-5" />
          </button>

          {/* base on the user please change the navitems */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/requestshop" className="px-6 py-2.5 text-slate-600 hover:text-brand-primary font-bold transition-colors">
                start sales
              </Link>

              {role === "admin" && <Link to="/admin" className="px-6 py-2.5 text-slate-600 hover:text-brand-primary font-bold transition-colors">
                admin
              </Link>}

              {role === "customer" && <Link to="/shopes" className="px-6 py-2.5 text-slate-600 hover:text-brand-primary font-bold transition-colors">
                shopes
              </Link>}

              {role === "customer" && <Link to="/orders" className="px-6 py-2.5 text-slate-600 hover:text-brand-primary font-bold transition-colors">
                orders
              </Link>}

              {role === "customer" && <Link to="/cartitem" className="px-6 py-2.5 text-slate-600 hover:text-brand-primary font-bold transition-colors">
                cart
              </Link>}

              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-brand-primary  rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-accent hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <LogOut />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/auth/signin" className="px-6 py-2.5 text-slate-600 hover:text-brand-primary font-bold transition-colors">
                Login
              </Link>
              <Link
                to="/auth/signup"
                className="px-6 py-2.5 bg-brand-primary  rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-accent hover:-translate-y-0.5 transition-all active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}

          <button className="md:hidden p-2.5 text-slate-600 bg-slate-50 rounded-xl">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
