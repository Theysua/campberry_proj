import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { login, register, setAuthToken } from '../services/api'

export default function Auth() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const [isSignUP, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async () => {
    setError('')
    setLoading(true)
    try {
      if (isSignUP) {
        if (!name) { throw new Error('Name is required') }
        const data = await register(name, email, password)
        setAuthToken(data.token)
      } else {
        const data = await login(email, password)
        setAuthToken(data.token)
      }
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-68px)] flex items-center justify-center p-6 animate-fade-in relative z-0">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 relative">
        <button onClick={() => navigate(-1)} className="absolute -top-12 left-0 text-slate-500 hover:text-[#892233] flex items-center gap-1 font-bold transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Auth Form */}
        <div className="bg-white p-10 rounded-2xl shadow-xl shadow-[#892233]/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#892233] transform origin-left transition-transform duration-500"></div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#011936] mb-2">{isSignUP ? 'Create Account' : 'Sign In'}</h2>
            <p className="text-sm text-slate-500 mb-8 font-medium">
              {isSignUP ? 'Already have an account? ' : 'Not registered yet? '}
              <button onClick={() => setIsSignUp(!isSignUP)} className="text-[#892233] font-bold hover:underline">
                {isSignUP ? 'Sign In' : 'Sign Up'}
              </button>
            </p>

            <button className="w-full border-2 border-slate-200 bg-white text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 mb-6">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] bg-slate-200 flex-1"></div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">or</span>
              <div className="h-[1px] bg-slate-200 flex-1"></div>
            </div>

            {error && <div className="text-red-500 text-sm font-bold mb-4">{error}</div>}

            <div className="space-y-4 text-left">
              {isSignUP && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                  <div className="input-wrapper">
                    <input type="text" placeholder="Jane Doe" className="input-field" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email address</label>
                <div className="input-wrapper">
                  <input type="email" placeholder="you@example.com" className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-1.5 ml-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  {!isSignUP && <button className="text-[11px] font-bold text-[#892233] hover:underline">Forgot password?</button>}
                </div>
                <div className="input-wrapper">
                  <input type="password" placeholder="••••••••" className="input-field" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </div>
            </div>

            <button disabled={loading} onClick={handleAuth} className="w-full bg-[#892233] hover:bg-[#780000] disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-8 hover:-translate-y-0.5">
              {loading ? 'PLEASE WAIT...' : (isSignUP ? 'SIGN UP' : 'SIGN IN')}
            </button>
          </div>
        </div>

        {/* Benefits Panel */}
        <div className="bg-[#f8fafc] p-10 rounded-2xl shadow-lg border border-[#892233]/10 flex flex-col justify-center text-center">
          <h2 className="text-2xl font-bold text-[#011936] mb-4">Why Campberry?</h2>
          <p className="text-[#011936] font-medium opacity-70 mb-8 leading-relaxed max-w-sm mx-auto">
            Join thousands of students and counselors to discover the best summer opportunities.
          </p>
          <div className="bg-white rounded-xl p-6 text-left shadow-sm mb-8 space-y-4 border border-[#892233]/5">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-[#f8fafc] text-[#892233] flex items-center justify-center shrink-0 font-bold shadow-sm">✓</div>
              <div className="text-sm font-bold text-[#011936]">Save your favorite programs</div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-[#f8fafc] text-[#892233] flex items-center justify-center shrink-0 font-bold shadow-sm">✓</div>
              <div className="text-sm font-bold text-[#011936]">Build and share precise lists</div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-[#f8fafc] text-[#892233] flex items-center justify-center shrink-0 font-bold shadow-sm">✓</div>
              <div className="text-sm font-bold text-[#011936]">Reviews and rankings by experts and parents.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
