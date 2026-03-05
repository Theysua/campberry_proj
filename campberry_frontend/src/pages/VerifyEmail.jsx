import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        // Call the backend verification stub
        apiFetch('/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ verificationToken: token })
        })
            .then(() => setStatus('success'))
            .catch((err) => {
                console.error(err);
                setStatus('error');
            });
    }, [token]);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#fffbeb] rounded-bl-full -mr-10 -mt-10 opacity-50 pointer-events-none"></div>

                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 bg-[#892233] text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md rotate-3">
                        CB
                    </div>
                </div>

                {status === 'verifying' && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-black text-[#011936] mb-3">Verifying your email...</h2>
                        <p className="text-sm font-medium text-slate-500">Please wait while we confirm your email address.</p>
                        <div className="mt-8 flex justify-center">
                            <div className="w-8 h-8 border-4 border-[#892233] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-fade-in scale-in">
                        <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-3xl font-black text-[#011936] mb-3 tracking-tight">Email Verified!</h2>
                        <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">Thank you for confirming your email. You now have full access to save programs and create curated lists.</p>
                        <Link to="/home" className="block w-full text-center bg-[#892233] hover:bg-[#780000] text-white px-6 py-3.5 rounded-xl font-bold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                            Explore Programs
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-fade-in">
                        <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-100">
                            <span className="text-3xl">!</span>
                        </div>
                        <h2 className="text-2xl font-black text-[#011936] mb-3">Verification Failed</h2>
                        <p className="text-sm font-medium text-slate-500 mb-8">The verification link may be invalid, expired, or you are already verified.</p>
                        <Link to="/home" className="block w-full text-center border-2 border-[#011936] text-[#011936] hover:bg-slate-50 px-6 py-3.5 rounded-xl font-bold transition-colors">
                            Return to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
