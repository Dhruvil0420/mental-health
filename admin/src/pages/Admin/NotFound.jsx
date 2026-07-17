import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h1 className="text-9xl font-black text-primary/15 tracking-widest select-none">404</h1>
        <h2 className="text-2xl font-bold text-slate-800">Admin Section Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          The requested admin dashboard path does not exist or has been relocated.
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="bg-primary text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow hover:bg-opacity-95 active:scale-95 cursor-pointer text-sm"
      >
        Go to Dashboard
      </button>
    </div>
  )
}

export default NotFound
