
export default function Mission() {
  return (
    <div className="bg-white min-h-screen animate-fade-in relative z-0">
      {/* Hero */}
      <section className="bg-[#011936] text-white py-24 px-6 text-center shadow-xl">
        <div className="container max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight tracking-tight text-white">
            Our mission is to make the education sector radically more open and navigable for all.
          </h1>
          <p className="text-xl text-[#f8fafc] max-w-2xl mx-auto leading-relaxed opacity-90 font-medium">
            We believe that every student deserves access to high-quality extracurriculars, regardless of their background or zip code.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#f8fafc] border-b border-slate-100">
        <div className="container max-w-5xl text-center">
          <div className="text-[#892233] font-bold tracking-widest uppercase text-sm mb-4">Student-First Philosophy</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#011936] mb-12">Our Promises to Students & Families</h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-[#892233]/5 border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f8fafc] rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
              <div className="text-4xl mb-6 relative">🔒</div>
              <h3 className="text-xl font-bold text-[#011936] mb-4 relative">100% Data Privacy</h3>
              <ul className="space-y-3 text-sm text-[#011936] font-medium opacity-80 relative">
                <li className="flex items-start gap-2"><span className="text-[#892233] font-bold mt-0.5">✓</span> Your personal info belongs to you</li>
                <li className="flex items-start gap-2"><span className="text-[#892233] font-bold mt-0.5">✓</span> We never sell your data</li>
                <li className="flex items-start gap-2"><span className="text-[#892233] font-bold mt-0.5">✓</span> Full transparency on data usage</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-[#892233]/5 border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f8fafc] rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
              <div className="text-4xl mb-6 relative">⚖️</div>
              <h3 className="text-xl font-bold text-[#011936] mb-4 relative">Unbiased Algorithm</h3>
              <ul className="space-y-3 text-sm text-[#011936] font-medium opacity-80 relative">
                <li className="flex items-start gap-2"><span className="text-[#ff751f] font-bold mt-0.5">✓</span> Students come first, not profit</li>
                <li className="flex items-start gap-2"><span className="text-[#ff751f] font-bold mt-0.5">✓</span> No pay-to-rank for programs</li>
                <li className="flex items-start gap-2"><span className="text-[#ff751f] font-bold mt-0.5">✓</span> Transparent ranking methodology</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-[#892233]/5 border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#fade41]/20 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
              <div className="text-4xl mb-6 relative">🆓</div>
              <h3 className="text-xl font-bold text-[#011936] mb-4 relative">Free, Forever</h3>
              <ul className="space-y-3 text-sm text-[#011936] font-medium opacity-80 relative">
                <li className="flex items-start gap-2"><span className="text-[#fade41] font-bold mt-0.5">✓</span> No paywalls blocking access</li>
                <li className="flex items-start gap-2"><span className="text-[#fade41] font-bold mt-0.5">✓</span> No premium membership tiers</li>
                <li className="flex items-start gap-2"><span className="text-[#fade41] font-bold mt-0.5">✓</span> Equal access for everyone</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-b border-slate-100">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#892233] mb-4">Our Community</h2>
            <p className="text-[#011936] font-medium opacity-70 max-w-2xl mx-auto">Campberry is curated and maintained by a coalition of dedicated educators and ambitious students.</p>
          </div>

          <h3 className="text-2xl font-bold text-center text-[#011936] mb-8">The Educators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-slate-100 rounded-full mb-4 shadow-inner overflow-hidden border-2 border-white">
                  <img src={`https://i.pravatar.cc/150?img=${i+10}`} className="w-full h-full object-cover" />
                </div>
                <div className="font-bold text-[#011936]">Educator {i}</div>
                <div className="text-xs text-slate-500 mt-1">Counselor, XYZ High School</div>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-center text-[#011936] mb-8">The Students</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#892233] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out opacity-10"></div>
                <div className="w-16 h-16 bg-slate-100 rounded-lg mb-4 shadow-sm overflow-hidden border-2 border-white rotate-3 group-hover:rotate-0 transition-transform">
                   <img src={`https://i.pravatar.cc/150?img=${i+30}`} className="w-full h-full object-cover" />
                </div>
                <div className="font-bold text-[#011936]">Student {i}</div>
                <div className="text-xs text-[#892233] font-bold mt-1 uppercase tracking-wider">Ambassador</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-10 md:p-16 shadow-2xl shadow-blue-900/5 border border-slate-100 relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-[#011936] mb-6 relative z-10">
            Join the community to help build this shared and free resource.
          </h2>
          <p className="text-[#011936] mb-8 relative z-10 max-w-xl mx-auto font-medium opacity-70">
            Whether you are a student sharing a review of your summer program or an educator curating lists for your students, your voice matters.
          </p>
          <button className="bg-[#892233] hover:bg-[#780000] text-white font-bold px-10 py-4 rounded-xl shadow-lg shadow-[#892233]/20 hover:shadow-[#892233]/40 hover:-translate-y-1 transition-all relative z-10 text-lg">
            Get Involved Today
          </button>
        </div>
      </section>

    </div>
  )
}
