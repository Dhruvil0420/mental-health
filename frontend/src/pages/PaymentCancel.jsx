import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 rounded-2xl shadow-xl text-center transition-all duration-500 hover:shadow-2xl">
        
        {/* Animated Cancelled Badge */}
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center border-2 border-amber-200 mx-auto mb-6">
          <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-amber-600">Payment Cancelled</h2>
          <p className="mt-3 text-gray-600 font-medium">
            The payment transaction was cancelled. No charges were made.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            If you still wish to complete this booking, you can initiate the payment again from your appointments dashboard.
          </p>
        </div>

        <div className="w-full mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
          <button 
            onClick={() => navigate('/my-appointment')}
            className="w-full bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-opacity-90 transition-all shadow-md active:scale-95"
          >
            Return to Appointments
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full border border-gray-200 text-gray-500 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all active:scale-95"
          >
            Go to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentCancel;
