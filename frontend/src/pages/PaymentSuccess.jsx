import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const appointmentId = searchParams.get('appointmentId');
  const navigate = useNavigate();
  
  const { backendUrl, token } = useContext(AppContext);
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'failed'
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  const verifyPayment = async () => {
    try {
      if (!sessionId || !appointmentId) {
        setStatus('failed');
        setErrorMessage('Invalid session or appointment references.');
        return;
      }

      const { data } = await axios.post(
        backendUrl + '/api/payment/verify',
        { session_id: sessionId, appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        setStatus('success');
        toast.success(data.message || 'Payment verified successfully!');
      } else {
        setStatus('failed');
        setErrorMessage(data.message || 'Verification failed. Please contact support.');
        toast.error(data.message || 'Payment verification failed.');
      }
    } catch (error) {
      console.error('Error during payment verification:', error);
      setStatus('failed');
      setErrorMessage(error.response?.data?.message || error.message || 'A network error occurred.');
      toast.error('Error verifying payment.');
    }
  };

  useEffect(() => {
    if (token) {
      verifyPayment();
    }
  }, [token, sessionId, appointmentId]);

  // Handle countdown and redirect for success status
  useEffect(() => {
    if (status === 'success') {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/my-appointment');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 rounded-2xl shadow-xl text-center transition-all duration-500 hover:shadow-2xl">
        
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Verifying Payment</h2>
              <p className="mt-2 text-gray-500 text-sm">Please wait while we verify your transaction with Stripe...</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-6 py-4 animate-fadeIn">
            {/* Beautiful Checkmark Badge */}
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-200">
              <svg className="w-10 h-10 text-green-500 animate-scaleIn" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <div>
              <h2 className="text-3xl font-extrabold text-green-600">Payment Successful!</h2>
              <p className="mt-2 text-gray-600 font-medium">Your appointment has been successfully booked and paid.</p>
              <p className="mt-1 text-xs text-gray-400">Transaction ID: {sessionId ? `${sessionId.substring(0, 18)}...` : ''}</p>
            </div>

            <div className="w-full pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Redirecting to your appointments in <span className="font-semibold text-primary">{countdown}s</span>
              </p>
              
              <button 
                onClick={() => navigate('/my-appointment')}
                className="w-full mt-4 bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-opacity-90 transition-all shadow-md active:scale-95"
              >
                Go to My Appointments
              </button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col items-center gap-6 py-4 animate-fadeIn">
            {/* Warning / Error Badge */}
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-200">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-red-600">Payment Verification Failed</h2>
              <p className="mt-2 text-sm text-gray-500 font-normal">
                {errorMessage || 'Something went wrong while confirming your payment.'}
              </p>
            </div>

            <div className="w-full pt-4 border-t border-gray-100 flex flex-col gap-2">
              <button 
                onClick={verifyPayment}
                className="w-full bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-opacity-90 transition-all shadow-md"
              >
                Retry Verification
              </button>
              
              <button 
                onClick={() => navigate('/my-appointment')}
                className="w-full border border-gray-300 text-gray-600 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Back to Appointments
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccess;
