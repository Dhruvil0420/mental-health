import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
    <div className='bg-gray-50 mt-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* Main Footer Content */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 py-8'>
                
                {/* Brand Section */}
                <div className='md:col-span-1'>
                    <div className='mb-4'>
                        <img className='w-32 h-auto' src={assets.logo1} alt="Prescripto Mental Health" />
                    </div>
                    <p className='text-gray-600 text-sm leading-relaxed mb-4'>
                        Your trusted platform for mental health support. Safe, confidential connections with licensed professionals.
                    </p>
                    
                    {/* Social Media Icons */}
                    <div className='flex gap-2'>
                        <div className='w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/80 transition-all cursor-pointer'>
                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
                            </svg>
                        </div>
                        <div className='w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/80 transition-all cursor-pointer'>
                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'/>
                            </svg>
                        </div>
                        <div className='w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/80 transition-all cursor-pointer'>
                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z'/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Services & Support Combined */}
                <div className='md:col-span-2 grid grid-cols-2 gap-6'>
                    {/* Services Section */}
                    <div>
                        <h3 className='text-base font-semibold text-gray-800 mb-3'>Services</h3>
                        <ul className='space-y-2 text-sm'>
                            <li className='text-gray-600 hover:text-primary cursor-pointer transition-all'>Find Therapists</li>
                            <li className='text-gray-600 hover:text-primary cursor-pointer transition-all'>Book Sessions</li>
                            <li className='text-gray-600 hover:text-primary cursor-pointer transition-all'>Mental Health Resources</li>
                            <li className='text-gray-600 hover:text-primary cursor-pointer transition-all'>Emergency Support</li>
                        </ul>
                    </div>

                    {/* Support Section */}
                    <div>
                        <h3 className='text-base font-semibold text-gray-800 mb-3'>Get Support</h3>
                        <div className='space-y-2 text-sm'>
                            <div className='bg-red-50 border border-red-100 rounded p-2'>
                                <div className='flex items-center gap-2 mb-1'>
                                    <svg className='w-3 h-3 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                    <span className='font-medium text-red-800 text-xs'>24/7 Crisis Helpline</span>
                                </div>
                                <p className='text-red-600 text-xs'>988 - Suicide & Crisis Lifeline</p>
                            </div>
                            
                            <div className='flex items-center gap-2 text-gray-600'>
                                <svg className='w-3 h-3 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                </svg>
                                <span className='text-xs'>support@prescripto.com</span>
                            </div>
                            <div className='flex items-center gap-2 text-gray-600'>
                                <svg className='w-3 h-3 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                                </svg>
                                <span className='text-xs'>1-800-PRESCRIPTO</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className='border-t border-gray-200 py-4'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-600'>
                    <div className='flex flex-col md:flex-row items-center gap-4'>
                        <span>&copy; 2024 Prescripto Mental Health. All rights reserved.</span>
                        <div className='flex gap-3'>
                            <span className='hover:text-primary cursor-pointer transition-all'>Privacy Policy</span>
                            <span className='hover:text-primary cursor-pointer transition-all'>Terms of Service</span>
                            <span className='hover:text-primary cursor-pointer transition-all'>HIPAA Compliance</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-1'>
                        <svg className='w-3 h-3 text-green-500' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z'/>
                        </svg>
                        <span>Secure & HIPAA Compliant</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Footer
