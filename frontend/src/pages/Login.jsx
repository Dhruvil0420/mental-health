import React, { useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const {backendUrl,token,setToken} = useContext(AppContext)
  const navigate = useNavigate();
  const [state,setState] = useState('Sign Up')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [name,setName] = useState('')
  const [errors,setErrors] = useState({})

  const validateForm = () => {
    const tempErrors = {}
    if (state === 'Sign Up' && !name.trim()) {
      tempErrors.name = 'Full name is required'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      tempErrors.email = 'Email is required'
    } else if (!emailRegex.test(email)) {
      tempErrors.email = 'Please enter a valid email address'
    }
    if (!password) {
      tempErrors.password = 'Password is required'
    } else if (password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters'
    }
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const onSubmitHandler = async (event) => {
      event.preventDefault()
      if (!validateForm()) return

      try {
        if(state === 'Sign Up') {
          const {data} = await axios.post(backendUrl + '/api/user/register', {
            name,
            email,
            password
          });
        
        if(data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success(data.message || 'Account created successfully!');
        }else{
          toast.error(data.message);
        }
        }
        else{
          const {data} = await axios.post(backendUrl + '/api/user/login', { 
            email,
            password
          });
        
        if(data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success(data.message || 'Welcome back!');
        }else{
          toast.error(data.message);
        }

        }
      } catch (error) {
        toast.error(error.message); 
      }
  }

  const toggleState = (newState) => {
    setState(newState)
    setErrors({})
    setEmail('')
    setPassword('')
    setName('')
  }

  useEffect(() => {
    if(token) {
      navigate('/')
    } 
  }, [token])

  return (
    <form  onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-slate-200 rounded-2xl text-sm shadow-lg bg-white'>
        <p className='text-2xl font-semibold text-slate-800'>
          {state === 'Sign Up' ? "Create Account":"Login"}
        </p>
        <p className="text-slate-500">Please {state === 'Sign Up' ? "sign up":"log in"} to book appointment</p>
        {
          state === "Sign Up" && <div className='w-full'>
          <p className="font-medium text-slate-700">Full Name</p>
          <input 
            className={`border rounded-xl w-full p-2.5 mt-1 outline-none transition-colors ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-zinc-300 focus:border-primary'}`} 
            type="text" 
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
            }} 
            value={name}
          />
          {errors.name && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.name}</p>}
        </div>
        }
        
        <div className='w-full'>
          <p className="font-medium text-slate-700">Email</p>
          <input
            className={`border rounded-xl w-full p-2.5 mt-1 outline-none transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-zinc-300 focus:border-primary'}`}
            type="text"
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
            }}
            value={email}
          />
          {errors.email && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.email}</p>}
        </div>
        <div className='w-full'>
          <p className="font-medium text-slate-700">Password</p>
          <input
            className={`border rounded-xl w-full p-2.5 mt-1 outline-none transition-colors ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-zinc-300 focus:border-primary'}`}
            type="password"
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
            }}
            value={password}
          />
          {errors.password && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.password}</p>}
        </div>
        <button type="submit" className='bg-primary text-white w-full py-2.5 rounded-xl text-base font-semibold transition-all hover:bg-opacity-95 active:scale-95 mt-2 cursor-pointer'>{state === 'Sign Up' ? "Create Account":"Login"}</button>
        {
          state === "Sign Up"
          ? <p className="text-slate-500">Already have an account? <span onClick={() => toggleState('Login')} className='text-primary underline cursor-pointer font-medium'>Login here</span> </p>
          : <p className="text-slate-500">Create a new Account? <span onClick={() => toggleState('Sign Up')} className='text-primary underline cursor-pointer font-medium'>click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login
