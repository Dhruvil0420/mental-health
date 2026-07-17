import React from 'react'
import { assets } from '../assets/assets'

const Contect = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center text-3xl pt-10 text-gray-400 font-light tracking-wide">
        <p>
          CONTACT <span className="text-gray-800 font-semibold">US</span>
        </p>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Main Content Card */}
      <div className="my-16 flex flex-col md:flex-row items-center justify-center gap-12 max-w-4xl mx-auto bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-lg hover:shadow-xl transition-all duration-300">
        
        {/* Contact Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img 
            className="w-full max-w-[340px] rounded-2xl shadow-md object-cover transform hover:scale-102 transition-transform duration-300" 
            src={assets.contact_image} 
            alt="Office staff" 
          />
        </div>

        {/* Details Column */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start gap-8">
          
          {/* Office Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-gray-800 tracking-wide uppercase">Our Office</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Prescripto Medical HQ <br /> 
              101 Medical Center Parkway, Suite 500 <br /> 
              San Francisco, CA 94107, USA
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              <span className="font-medium text-gray-700">Tel:</span> +1 (415) 888-0199 <br /> 
              <span className="font-medium text-gray-700">Email:</span> contact@prescripto.com
            </p>
          </div>

          <div className="w-full h-[1px] bg-gray-100"></div>

          {/* Careers Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-gray-800 tracking-wide uppercase">Careers at Prescripto</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Learn more about our teams, open positions, and culture.
            </p>
            <button className="border-2 border-primary text-primary px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary hover:text-white hover:shadow-md transition-all duration-300 active:scale-95">
              Explore Jobs
            </button>
          </div>

        </div> 
      </div>
    </div>
  )
}

export default Contect
