import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h1 className="text-9xl font-black text-primary/10 tracking-widest select-none">404</h1>
        <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="bg-primary text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow hover:bg-opacity-95 active:scale-95 cursor-pointer text-sm"
      >
        Back to Home Page
      </button>
    </div>
  )
}

export default NotFound
