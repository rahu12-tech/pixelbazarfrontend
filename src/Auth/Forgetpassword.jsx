import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {
    const [step, setStep] = useState(1); 
    const [inputData, setInputData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');

    const handleInput = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/forgot-password', { email: inputData.email });
            setMessage(res.data.msg);
            setStep(2);
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Something went wrong');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/verify-otp', {
                email: inputData.email,
                otp: inputData.otp
            });
            setMessage(res.data.msg);
            setStep(3);
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Something went wrong');
        }
    };

    let navigate=useNavigate()
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (inputData.newPassword !== inputData.confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/reset-password', {
                email: inputData.email,
                otp: inputData.otp,
                newPassword: inputData.newPassword
            });
            setMessage(res.data.msg);
            setTimeout(() => {
                navigate('/signup')
            }, 1500);
            setInputData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Something went wrong');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
            {message && <p className="mb-4 text-red-500">{message}</p>}

            <form onSubmit={
                step === 1 ? handleSendOtp :
                step === 2 ? handleVerifyOtp :
                handleResetPassword
            }>
                {step >= 1 && (
                    <div className="mb-4">
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={inputData.email}
                            onChange={handleInput}
                            required
                            className="w-full p-2 border rounded"
                            disabled={step !== 1} // email can’t be changed after step 1
                        />
                    </div>
                )}

                {step >= 2 && (
                    <div className="mb-4">
                        <label className="block mb-1">OTP</label>
                        <input
                            type="text"
                            name="otp"
                            value={inputData.otp}
                            onChange={handleInput}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                )}

                {step === 3 && (
                    <>
                        <div className="mb-4">
                            <label className="block mb-1">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={inputData.newPassword}
                                onChange={handleInput}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={inputData.confirmPassword}
                                onChange={handleInput}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </>
                )}

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    {step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
}

export default ForgetPassword;
