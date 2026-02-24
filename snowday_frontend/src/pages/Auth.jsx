import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const navigate = useNavigate()

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-68px)] flex items-center justify-center p-6 animate-fade-in relative z-0">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 relative">
        <button onClick={() => navigate(-1)} className="absolute -top-12 left-0 text-slate-500 hover:text-[#892233] flex items-center gap-1 font-bold transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Sign In */}
        <div className="bg-white p-10 rounded-2xl shadow-xl shadow-[#892233]/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#892233] transform origin-left transition-transform duration-500"></div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#011936] mb-2">Sign In</h2>
            <p className="text-sm text-slate-500 mb-8 font-medium">
              Not registered yet? <button className="text-[#892233] font-bold hover:underline">Sign Up</button>
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

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email address</label>
                <div className="input-wrapper">
                  <input type="email" placeholder="you@example.com" className="input-field" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-1.5 ml-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  <button className="text-[11px] font-bold text-[#892233] hover:underline">Forgot password?</button>
                </div>
                <div className="input-wrapper">
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
              </div>
            </div>

            <button className="w-full bg-[#892233] hover:bg-[#780000] text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-8 hover:-translate-y-0.5">
              SIGN IN
            </button>
          </div>
        </div>

        {/* Sign Up */}
        <div className="bg-[#ddfff7] p-10 rounded-2xl shadow-lg border border-[#892233]/10 flex flex-col justify-center text-center">
          <h2 className="text-2xl font-bold text-[#011936] mb-4">New to Campberry?</h2>
          <p className="text-[#011936] font-medium opacity-70 mb-8 leading-relaxed max-w-sm mx-auto">
            Create an account to save your favorite programs, build custom lists, and get personalized recommendations from our experts.
          </p>
          <div className="bg-white rounded-xl p-6 text-left shadow-sm mb-8 space-y-4 border border-[#892233]/5">
             <div className="flex gap-3 items-center">
               <div className="w-8 h-8 rounded-full bg-[#ddfff7] text-[#892233] flex items-center justify-center shrink-0 font-bold shadow-sm">✓</div>
               <div className="text-sm font-bold text-[#011936]">Track application deadlines</div>
             </div>
             <div className="flex gap-3 items-center">
               <div className="w-8 h-8 rounded-full bg-[#ddfff7] text-[#892233] flex items-center justify-center shrink-0 font-bold shadow-sm">✓</div>
               <div className="text-sm font-bold text-[#011936]">Share opportunities with parents</div>
             </div>
             <div className="flex gap-3 items-center">
               <div className="w-8 h-8 rounded-full bg-[#ddfff7] text-[#892233] flex items-center justify-center shrink-0 font-bold shadow-sm">✓</div>
               <div className="text-sm font-bold text-[#011936]">100% free forever</div>
             </div>
          </div>
          <button className="w-full bg-[#892233] text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:bg-[#780000] hover:-translate-y-0.5">
            CREATE ACCOUNT
          </button>
        </div>

      </div>
    </div>
  )
}
