import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ShoppingBag, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'


function SignIn() {

  const { user, handleLogin } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: "",
    password: "",
  })


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await handleLogin(data.email, data.password)

      navigate("/")

    } catch(error) {
      console.log(error)
    }

  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-brand-primary rounded-xl group-hover:rotate-12 transition-transform">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">LokMart</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Simplify your local shopping experience</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-2xl outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <a href="#" className="text-xs font-bold text-brand-primary hover:text-brand-accent transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-2xl outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button type='submit' className="w-full py-4 bg-black hover:bg-brand-accent text-white font-bold rounded-2xl shadow-lg shadow-brand-primary/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group">
              Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account? {' '}
              <Link to="/auth/signup" className="text-brand-primary font-bold hover:text-brand-accent transition-colors">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-400 text-xs">
          By continuing, you agree to LokMart's <br className="sm:hidden" />
          <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}

export default SignIn
