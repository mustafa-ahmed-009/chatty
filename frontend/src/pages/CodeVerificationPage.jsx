import React, { useState } from 'react';
import { FaLock, FaEnvelope, FaCheck } from 'react-icons/fa';
import { useLocation} from 'react-router-dom';
import toast from 'react-hot-toast';

const CodeVerificationPage = () => {
  const [codeArray, setCodeArray] = useState(new Array(6).fill(""));
  const location = useLocation();
  const email = location.state?.email;
  
  const handleChange = (e, index) => {
    const value = e.target.value.slice(-1); 
    console.log(value);
    
    const updatedCode = [...codeArray];
    updatedCode[index] = value;
    setCodeArray(updatedCode);
  };

  
  const handleVerification = async () => {
    try {
      toast.success("Your account has been successfully verified"); 
      navigate("/");
    } catch (error) {
      toast.error(error)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        {/* Header */}
        <div className="bg-primary p-6 text-center">
          <div className="flex justify-center">
            <FaLock className="h-12 w-12 text-white mb-3" />
          </div>
          <h1 className="text-2xl font-bold text-white">Verify Your Account</h1>
          <p className="text-indigo-100 mt-2">
            We've sent a verification code to your email
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center mb-6 bg-blue-50 rounded-lg p-4">
            <FaEnvelope className="text-indigo-500 mr-3" />
            <span className="text-gray-700">{email}</span>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <div className="flex space-x-3">
                {codeArray.map((value, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(e, idx)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength={1}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter the 6-digit code you received
              </p>
            </div>
            <p className='text-red-600'>!!! Please check your spam folder if you cannot find it in the main mail box</p>

            <button
              onClick={handleVerification}
              className="w-full flex items-center justify-center py-3 px-4 bg-primary hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
            >
              <FaCheck className="mr-2" /> {true ? "Verify Account" : "loading ...."}
            </button>
            {false && <h3 className='text-center text-red-500'>{state.error}</h3>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeVerificationPage;