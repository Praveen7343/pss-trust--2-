import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, User } from 'lucide-react';

const PSS_LOGO = "https://v0-ngo-app-for-studies.vercel.app/images/pss-logo.png";

interface ChairmanLoginProps {
  onBack: () => void;
  onLogin: () => void;
}

export default function ChairmanLogin({ onBack, onLogin }: ChairmanLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'srinivas' && password === 'srinivas123') {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={PSS_LOGO} alt="PSS Logo" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">PSS</h1>
            <p className="text-xs font-medium text-slate-500">Social Welfare</p>
          </div>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 lg:p-10"
        >
          <div className="text-center mb-10">
            <img src={PSS_LOGO} alt="PSS Logo" className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-slate-50 shadow-sm" referrerPolicy="no-referrer" />
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Chairman Login</h2>
            <p className="text-slate-500">Admin Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Enter username"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center"
            >
              Log In
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <div className="text-center mb-6">
              <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">Demo Credentials</span>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <p className="text-blue-900 font-bold mb-3">Try these credentials:</p>
              <div className="space-y-1">
                <p className="text-blue-800 text-sm">Username: <span className="font-bold">srinivas</span></p>
                <p className="text-blue-800 text-sm">Password: <span className="font-bold">srinivas123</span></p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="text-slate-900 font-bold text-sm hover:underline">Student Login</button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
