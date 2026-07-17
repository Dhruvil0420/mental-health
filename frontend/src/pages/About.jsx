import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

        <div className='text-center text-2xl pt-10 text-gray-500'>
          <p>
            ABOUT <span className='text-gray-700 font-medium'>US</span>
          </p>
        </div>
        <div className='my-10 flex flex-col md:flex-row gap-12'>
          <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
            <p>Welcome to Prescripto Mental Care, your trusted platform for booking mental health appointments quickly and securely.</p>
            <p>We connect people with qualified psychiatrists, psychologists, and therapists so support is easier to access whenever needed.</p>
            <b className='text-gray-800'>Our Vision</b>
            <p>Our vision is to create a seamless mental healthcare experience for every user through accessible specialist care.</p>
          </div>
        </div>

        <div className='text-xl my-4'>
          <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
        </div>
        <div className='flex flex-col md:flex-row mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>Efficiency:</b>
            <p>Quick and simple mental health appointment scheduling for busy routines.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>Convenience:</b>
            <p>Access to trusted psychiatrists, psychologists, and therapists in one place.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>Personalization:</b>
            <p>Personalized support and reminders to stay consistent with your mental wellness goals.</p>
          </div>
        </div>

    </div>
  )
}

export default About
