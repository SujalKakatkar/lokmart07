import React from 'react'
import { Link, useNavigate } from 'react-router'
import { ShoppingBag, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function SignUp() {
  const { user, handleSignup } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await handleSignup(data.name, data.email, data.password)

      console.log(user);

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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500">Join the local marketplace community</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-2xl outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

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
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-2xl outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button className="w-full py-4 bg-black hover:bg-brand-accent text-white font-bold rounded-2xl shadow-lg shadow-brand-primary/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group">
              Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account? {' '}
              <Link to="/auth/signin" className="text-brand-primary font-bold hover:text-brand-accent transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-400 text-xs px-4">
          By signing up, you agree to receive updates from local shops and accept our <a href="#" className="underline hover:text-slate-600">Privacy Terms</a>.
        </p>
      </div>
    </div>
  )
}

export default SignUp
