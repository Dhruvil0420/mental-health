import React, {useState ,useContext} from 'react'
import { AppContext } from '../context/AppContext';
import {assets} from '../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
    const { userData,setUserData,token,backendUrl,loadUserProfileData } = useContext(AppContext);

    const [isEdit,setIsEdit] = useState(false)
    const [image,setImage] = useState(false);

    const updateUserProfileData = async () => {
      try {
        const formData = new FormData();

        formData.append('name',userData.name);
        formData.append('phone',userData.phone);
        formData.append('address',JSON.stringify(userData.address));
        formData.append('gender',userData.gender);
        formData.append('dob',userData.dob);
        
        image && formData.append('image',image); 


        const {data } = await axios.put(backendUrl + '/api/user/update-profile', formData, {
          headers: {
            token
          }
        });
        if(data.success){
          toast.success(data.message);
          await loadUserProfileData();
          setIsEdit(false);
          setImage(false);
        }
        else{
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error); 
        toast.error(error.message);
      }
    }

  return userData && (
    <div className='max-w-4xl mx-auto p-4 sm:p-6 lg:p-8'>
      {/* Profile Header */}
      <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6'>
        <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6'>
          {/* Profile Image */}
          <div className='flex-shrink-0'>
            {isEdit ? (
              <label htmlFor="image" className='cursor-pointer'>
                <div className='relative group'>
                  <img 
                    className='w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-primary/20 transition-all group-hover:border-primary/40' 
                    src={image ? URL.createObjectURL(image) : userData.image} 
                    alt="Profile" 
                  />
                  <div className='absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center'>
                    <img className='w-8 h-8' src={assets.upload_icon} alt="Upload" />
                  </div>
                </div>
                <input 
                  onChange={(e)=>setImage(e.target.files[0])} 
                  type="file" 
                  id="image" 
                  className='hidden' 
                  accept='image/*'
                />
              </label>
            ) : (
              <img 
                className='w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-primary/20' 
                src={userData.image} 
                alt="Profile" 
              />
            )}
          </div>

          {/* Profile Info */}
          <div className='flex-1 text-center sm:text-left'>
            {isEdit ? (
              <input 
                className='bg-gray-50 text-2xl sm:text-3xl font-semibold max-w-full sm:max-w-md px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition-all' 
                type="text" 
                value={userData.name} 
                onChange={e => setUserData(prev =>({...prev,name:e.target.value}))} 
                placeholder="Your name"
              />
            ) : (
              <h1 className='text-2xl sm:text-3xl font-semibold text-gray-800 mb-2'>{userData.name}</h1>
            )}
            <p className='text-gray-600 mb-4'>{userData.email}</p>
            <div className='flex flex-wrap gap-2 justify-center sm:justify-start'>
              <span className='px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium'>
                {userData.gender || 'Not specified'}
              </span>
              <span className='px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium'>
                Member since {new Date().getFullYear()}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className='flex-shrink-0'>
            {isEdit ? (
              <div className='flex gap-2'>
                <button 
                  className='px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium'
                  onClick={updateUserProfileData}
                >
                  Save
                </button>
                <button 
                  className='px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium'
                  onClick={() => {
                    setIsEdit(false);
                    setImage(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-medium'
                onClick={() => setIsEdit(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2'>
          <span className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
            <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
            </svg>
          </span>
          Contact Information
        </h2>
        
        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-gray-600 mb-1 block'>Email Address</label>
              {isEdit ? (
                <input 
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-all'
                  type="email" 
                  value={userData.email} 
                  disabled
                />
              ) : (
                <p className='text-gray-800 font-medium'>{userData.email}</p>
              )}
            </div>
            
            <div>
              <label className='text-sm font-medium text-gray-600 mb-1 block'>Phone Number</label>
              {isEdit ? (
                <input 
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-all'
                  type="tel" 
                  value={userData.phone} 
                  onChange={e => setUserData(prev =>({...prev,phone:e.target.value}))}
                  placeholder='Enter phone number'
                />
              ) : (
                <p className='text-gray-800 font-medium'>{userData.phone || 'Not provided'}</p>
              )}
            </div>
          </div>
          
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-gray-600 mb-1 block'>Address Line 1</label>
              {isEdit ? (
                <input 
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-all'
                  type="text" 
                  value={userData.address.line1} 
                  onChange={(e) => setUserData(prev => ({ ...prev, address: {...prev.address, line1: e.target.value}}))}
                  placeholder='Street address'
                />
              ) : (
                <p className='text-gray-800 font-medium'>{userData.address.line1 || 'Not provided'}</p>
              )}
            </div>
            
            <div>
              <label className='text-sm font-medium text-gray-600 mb-1 block'>Address Line 2</label>
              {isEdit ? (
                <input 
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-all'
                  type="text" 
                  value={userData.address.line2} 
                  onChange={(e) => setUserData(prev => ({ ...prev, address: {...prev.address, line2: e.target.value}}))}
                  placeholder='Apartment, suite, etc.'
                />
              ) : (
                <p className='text-gray-800 font-medium'>{userData.address.line2 || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information Section */}
      <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-8'>
        <h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2'>
          <span className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
            <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
          </span>
          Basic Information
        </h2>
        
        <div className='grid md:grid-cols-2 gap-6'>
          <div>
            <label className='text-sm font-medium text-gray-600 mb-1 block'>Gender</label>
            {isEdit ? (
              <select 
                className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-all'
                onChange={(e) => setUserData(prev => ({...prev, gender : e.target.value}))} 
                value={userData.gender}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className='text-gray-800 font-medium'>{userData.gender || 'Not specified'}</p>
            )}
          </div>
          
          <div>
            <label className='text-sm font-medium text-gray-600 mb-1 block'>Date of Birth</label>
            {isEdit ? (
              <input 
                className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-all'
                type="date" 
                onChange={(e) => setUserData(prev => ({...prev, dob : e.target.value}))} 
                value={userData.dob}
              />
            ) : (
              <p className='text-gray-800 font-medium'>{userData.dob || 'Not provided'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
