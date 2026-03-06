import React, { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { requestPasswordReset, resetPassword } from '../services/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const isResetMode = Boolean(token)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const heading = useMemo(
    () => (isResetMode ? 'Set a new password' : 'Forgot your password?'),
    [isResetMode]
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setStatus('submitting')

    try {
      if (isResetMode) {
        await resetPassword(token, password)
        setMessage('Password updated. You can sign in with your new password now.')
      } else {
        const response = await requestPasswordReset(email)
        setMessage(response.message || 'If an account exists for that email, a reset link has been issued.')
      }
      setStatus('success')
    } catch (err) {
      setError(err.message || 'Something went wrong')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#fffbeb] rounded-bl-full -mr-10 -mt-10 opacity-50 pointer-events-none"></div>

        <div>
          <h1 className="text-3xl font-black text-[#011936] mb-3 tracking-tight">{heading}</h1>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            {isResetMode
              ? 'Choose a new password for your Campberry account.'
              : 'Enter your email and we will issue a password reset link.'}
          </p>
        </div>

        {error && <div className="text-sm text-red-600 font-medium">{error}</div>}
        {message && <div className="text-sm text-emerald-700 font-medium">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isResetMode && (
            <div>
              <label className="form-label">Email address</label>
              <input
                className="form-input"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          )}

          {isResetMode && (
            <div>
              <label className="form-label">New password</label>
              <input
                className="form-input"
                placeholder="Enter your new password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="btn"
            style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '16px' }}
            disabled={status === 'submitting'}
          >
            {status === 'submitting'
              ? 'Submitting...'
              : isResetMode
                ? 'Update Password'
                : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-sm text-slate-500">
          <Link to="/auth" className="font-semibold text-[#011936]">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
