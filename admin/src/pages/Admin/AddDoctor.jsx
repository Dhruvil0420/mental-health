import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import {AdminContext} from '../../context/AdminContext'
import {toast} from 'react-hot-toast'
import axios from 'axios'

const AddDoctor = () => {

    const [docImg,setDocImg] = useState(false);
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [experience,setExperience] = useState('1 Year')
    const [fees,setFees] = useState('')
    const [about,setAbout] = useState('')
    const [speciality,setSpeciality] = useState('Psychiatrist')
    const [degree,setDegree] = useState('')
    const [address1,setAddress1] = useState('')
    const [address2,setAddress2] = useState('')
    const [errors,setErrors] = useState({})
    const {backendUrl,aToken} = useContext(AdminContext)

    const validateForm = () => {
        const tempErrors = {}
        if (!docImg) {
            tempErrors.docImg = 'Please select a doctor profile picture'
        }
        if (!name.trim()) {
            tempErrors.name = 'Doctor name is required'
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
        if (!fees || Number(fees) <= 0) {
            tempErrors.fees = 'Please enter a valid consult fee'
        }
        if (!degree.trim()) {
            tempErrors.degree = 'Education degree details are required'
        }
        if (!address1.trim()) {
            tempErrors.address1 = 'Address line 1 is required'
        }
        if (!about.trim()) {
            tempErrors.about = 'About write-up is required'
        }
        setErrors(tempErrors)
        return Object.keys(tempErrors).length === 0
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        if (!validateForm()) return

        try {
            const formData = new FormData()
            formData.append('image',docImg)
            formData.append('name',name)
            formData.append('email',email)
            formData.append('password',password)
            formData.append('experience',experience)
            formData.append('fees',Number(fees))
            formData.append('about',about)
            formData.append('speciality',speciality)
            formData.append('degree',degree)
            formData.append('address',JSON.stringify({line1:address1,line2:address2}))


            // console log form data
            formData.forEach((value,key)=>{
                console.log(`${key} : ${value}`);
            })

            const {data} =await axios.post(backendUrl + '/api/admin/add-doctor',formData,{headers:{Authorization:`Bearer ${aToken}`}})
            if(data.success){
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
                setErrors({})
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    return ( 
        <form onSubmit ={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium text-slate-800'>
                Add Doctor
            </p>
            <div className='bg-white px-8 py-8 border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-sm'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 h-16 bg-gray-100 rounded-full cursor-pointer object-cover border border-slate-200 shadow-sm' src={docImg? URL.createObjectURL(docImg)  : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e)=> {
                        setDocImg(e.target.files[0])
                        if (errors.docImg) setErrors(prev => ({ ...prev, docImg: '' }))
                    }} type="file" id='doc-img' hidden />
                    <div>
                        <p className="font-semibold text-slate-700">Upload Doctor Picture</p>
                        {errors.docImg && <p className="text-red-500 text-[11px] mt-0.5 font-medium">{errors.docImg}</p>}
                    </div>
                </div>

                <div className='flex flex-col lg:flex-row item-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className="font-medium text-slate-700">Doctor Name</p>
                            <input 
                              onChange={(e)=> {
                                  setName(e.target.value)
                                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
                              }} 
                              value={name} 
                              className={`border rounded-xl px-3 py-2 outline-none transition-colors ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-zinc-300 focus:border-primary'}`} 
                              type="text" 
                              placeholder='Name' 
                            />
                            {errors.name && <p className="text-red-500 text-[11px] font-medium">{errors.name}</p>}
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className="font-medium text-slate-700">Doctor Email</p>
                            <input 
                              onChange={(e)=> {
                                  setEmail(e.target.value)
                                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
                              }} 
                              value={email} 
                              className={`border rounded-xl px-3 py-2 outline-none transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-zinc-300 focus:border-primary'}`} 
                              type="text" 
                              placeholder='Email' 
                            />
                            {errors.email && <p className="text-red-500 text-[11px] font-medium">{errors.email}</p>}
                        </div>

                        <div>
                            <p className="font-medium text-slate-700">Doctor Password</p>
                            <input 
                              onChange={(e)=> {
                                  setPassword(e.target.value)
                                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                              }} 
                              value={password} 
                              className={`border rounded-xl px-3 py-2 w-full outline-none transition-colors ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-zinc-300 focus:border-primary'}`}  
                              type="password" 
                              placeholder='Password' 
                            />
                            {errors.password && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.password}</p>}
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className="font-medium text-slate-700">Experience</p>
                            <select onChange={(e)=>setExperience(e.target.value) } value={experience} className='border border-zinc-300 rounded-xl px-3 py-2 focus:border-primary outline-none bg-white' name="" id="">
                                <option value="1 Year">1 Year</option>
                                <option value="2 Years">2 Years</option>
                                <option value="3 Years">3 Years</option>
                                <option value="4 Years">4 Years</option>
                                <option value="5 Years">5 Years</option>
                                <option value="6 Years">6 Years</option>
                                <option value="7 Years">7 Years</option>
                                <option value="8 Years">8 Years</option>
                                <option value="9 Years">9 Years</option>
                                <option value="10+ Years">10+ Years</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className="font-medium text-slate-700">Fees</p>
                            <input 
                              onChange={(e)=> {
                                  setFees(e.target.value)
                                  if (errors.fees) setErrors(prev => ({ ...prev, fees: '' }))
                              }} 
                              value={fees} 
                              className={`border rounded-xl px-3 py-2 outline-none transition-colors ${errors.fees ? 'border-red-500 focus:border-red-500' : 'border-zinc-300 focus:border-primary'}`} 
                              type="number" 
                              placeholder='Fees' 
                            />
                            {errors.fees && <p className="text-red-500 text-[11px] font-medium">{errors.fees}</p>}
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p className="font-medium text-slate-700">Speciality</p>
                            <select onChange={(e)=>setSpeciality(e.target.value) } value={speciality} className='border border-zinc-300 rounded-xl px-3 py-2 focus:border-primary outline-none bg-white' name="" id="">
                                <option value="Psychiatrist">Psychiatrist</option>
                                <option value="Clinical Psychologist">Clinical Psychologist</option>
                                <option value="Counselling Psychologist">Counselling Psychologist</option>
                                <option value="Psychotherapist">Psychotherapist</option>
                                <option value="Child & Adolescent Psychiatrist">Child & Adolescent Psychiatrist</option>
                                <option value="Addiction Psychiatrist">Addiction Psychiatrist</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className="font-medium text-slate-700">Education</p>
                            <input 
                              onChange={(e)=> {
                                  setDegree(e.target.value)
                                  if (errors.degree) setErrors(prev => ({ ...prev, degree: '' }))
                              }} 
                              value={degree} 
                              className={`border rounded-xl px-3 py-2 outline-none transition-colors ${errors.degree ? 'border-red-500 focus:border-red-500' : 'border-zinc-300 focus:border-primary'}`} 
                              type="text" 
                              placeholder='Education' 
                            />
                            {errors.degree && <p className="text-red-500 text-[11px] font-medium">{errors.degree}</p>}
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className="font-medium text-slate-700">Address</p>
                            <input 
                              onChange={(e)=> {
                                  setAddress1(e.target.value)
                                  if (errors.address1) setErrors(prev => ({ ...prev, address1: '' }))
                              }} 
                              value={address1} 
                              className={`border rounded-xl px-3 py-2 outline-none transition-colors ${errors.address1 ? 'border-red-500 focus:border-red-500' : 'border-zinc-300 focus:border-primary'}`} 
                              type="text" 
                              placeholder='Address Line 1' 
                            />
                            {errors.address1 && <p className="text-red-500 text-[11px] font-medium">{errors.address1}</p>}
                            <input onChange={(e)=>setAddress2(e.target.value) } value={address2} className='border border-zinc-300 rounded-xl px-3 py-2 focus:border-primary outline-none mt-1' type="text" placeholder='Address Line 2' />
                        </div>
                    </div>
                </div>

                <div>
                    <p className='mt-4 mb-2 font-medium text-slate-700'>About Doctor</p>
                    <textarea 
                      onChange={(e)=> {
                          setAbout(e.target.value)
                          if (errors.about) setErrors(prev => ({ ...prev, about: '' }))
                      }} 
                      value={about} 
                      className={`w-full px-4 py-3 border rounded-2xl outline-none focus:border-primary resize-none ${errors.about ? 'border-red-500 focus:border-red-500' : 'border-zinc-300'}`} 
                      placeholder='Write about doctor qualifications...' 
                      rows={5} 
                    />
                    {errors.about && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.about}</p>}
                </div>
                <button type='submit' className='bg-primary px-10 py-3 mt-5 text-white font-semibold rounded-xl hover:bg-opacity-95 active:scale-95 transition-all shadow cursor-pointer'>Add Doctor</button>

            </div>
        </form>
    )
}

export default AddDoctor
