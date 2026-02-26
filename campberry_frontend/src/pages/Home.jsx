import { ArrowRight, BookOpen, Briefcase, Building2, FlaskConical, Globe, Microscope, Search, Sun } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Badge from '../components/Badge'
import ListCard from '../components/ListCard'

export default function Home() {
  const navigate = useNavigate()
  const [heroQuery, setHeroQuery] = useState('')

  const topSearches = [
    { icon: <Sun size={24} strokeWidth={1.5} />, label: 'Summer' },
    { icon: <Microscope size={24} strokeWidth={1.5} />, label: 'STEM' },
    { icon: <Briefcase size={24} strokeWidth={1.5} />, label: 'Business' },
    { icon: <BookOpen size={24} strokeWidth={1.5} />, label: 'Humanities' },
    { icon: <FlaskConical size={24} strokeWidth={1.5} />, label: 'Research' },
    { icon: <Globe size={24} strokeWidth={1.5} />, label: 'Hong Kong' },
    { icon: <Building2 size={24} strokeWidth={1.5} />, label: 'Leadership' },
  ]

  const featuredLists = [
    { id: '1', title: "School Counseling Group's Favorite Programs", author: 'School Counseling Group', authorRole: 'Admissions Consultants' },
    { id: '2', title: "Pre-college Summer Programs That Demonstrate Interest", author: 'Campberry', authorRole: 'Official Team Account' },
    { id: '3', title: "Engineering Courses Summer 2026", author: 'Sam Luby', authorRole: 'Independent Counselor' },
    { id: '4', title: "Eight Great Years’ Favorite Programs", author: 'Alyse Graham', authorRole: 'Founder, Eight Great Years' },
    { id: '5', title: "High-Impact Experiences That Hold Up in Elite Admissions Review", author: 'John Morganelli', authorRole: 'Ex-Director of Admissions: Cornell University' },
    { id: '6', title: "Top Free Programs for Low-Income Students", author: 'Pamela Musungu', authorRole: 'GritHub, Founder' },
  ]

  return (
    <div className="animate-fade-in">
      {/* S1: Hero */}
      <section className="bg-[#f8fafc] pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="container flex flex-col items-center text-center max-w-3xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#011936] mb-4 tracking-tight leading-tight">
            Find Your Dream Program
          </h1>
          <p className="text-lg text-[#011936] mb-10 max-w-xl font-medium opacity-80">
            Discover extracurriculars that matter
          </p>

          <div className="flex w-full max-w-2xl bg-white shadow-lg rounded-full overflow-hidden shadow-[#892233]/5 transition-transform hover:-translate-y-1 mb-16 border border-[#892233]/10">
            <div className="flex-1 bg-transparent flex items-center px-6">
              <Search className="text-[#892233] mr-2 shrink-0" size={20} />
              <input
                type="text"
                value={heroQuery}
                onChange={e => setHeroQuery(e.target.value)}
                placeholder="Search by interest, name..."
                className="w-full py-5 outline-none text-[#011936] text-base font-medium"
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/search${heroQuery ? '?q=' + encodeURIComponent(heroQuery) : ''}`)}
              />
            </div>
            <button
              onClick={() => navigate(`/search${heroQuery ? '?q=' + encodeURIComponent(heroQuery) : ''}`)}
              className="bg-[#892233] hover:bg-[#780000] text-white px-8 py-5 font-bold transition-colors flex items-center gap-2 m-1 rounded-full"
            >
              Search
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[80px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[#f8fafc]"></path>
          </svg>
        </div>
      </section>

      <div className="container py-16 flex flex-col gap-16">

        {/* S2: Top Searches */}
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#011936]">
            <span className="text-2xl text-[#ff751f]">✨</span> Top Searches
          </h2>
          <div className="scroll-x pt-4 px-2">
            {topSearches.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(`/search?tags=${encodeURIComponent(item.label)}`)}
                className="flex flex-col items-center justify-center gap-3 w-32 h-32 shrink-0 bg-white border border-slate-100 rounded-2xl hover:border-[#ff751f] hover:shadow-md hover:text-[#ff751f] transition-all group shadow-sm"
              >
                <div className="text-[#892233] group-hover:scale-110 transition-transform">{item.icon}</div>
                <span className="text-sm font-bold text-[#011936] group-hover:text-[#ff751f]">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* S3: Featured Lists */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-[#011936]">
              <span className="text-yellow-400 text-2xl">⭐</span> Featured Lists
            </h2>
            <Link to="/lists" className="text-sm text-[#892233] font-semibold hover:text-[#780000] flex items-center gap-1 group">
              See All Lists <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scroll-x">
            {featuredLists.map(list => <ListCard key={list.id} list={list} />)}
            <Link to="/lists" className="card flex items-center justify-center w-[280px] shrink-0 text-[#892233] font-semibold hover:bg-[#f8fafc] transition-colors gap-2 group border-dashed border-2">
              Explore More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* S4: Ratings */}
        <section>
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-bold text-[#011936] flex items-center gap-3 mb-3">
              Campberry Ratings <Badge type="NEW" />
            </h2>
            <p className="text-slate-600 text-lg">Find the best opportunities — ranked for quality and cost by our expert community.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-8 border-t-4 border-t-[#892233] bg-white group hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-bold mb-2 flex flex-wrap items-center gap-2">Experts' Choice <Badge type="NEW" /></h3>
              <p className="text-[#011936] mb-6 text-sm opacity-70">Top-tier programs selected by education consultants.</p>
              <div className="flex gap-3 mb-6">
                <Badge type="MOST" />
                <Badge type="HIGHLY" />
              </div>
              <Link to="/search" className="text-sm font-semibold text-[#892233] hover:text-[#780000] flex items-center gap-1 group-hover:translate-x-1 transition-transform">Explore Experts' Choice &rarr;</Link>
            </div>

            <div className="card p-8 border-t-4 border-t-[#ff751f] bg-white group hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">Impact on Admissions <Badge type="NEW" /></h3>
              <p className="text-[#011936] mb-6 text-sm opacity-70">Proven effectiveness in elite college review.</p>
              <div className="flex gap-3 mb-6">
                <Badge type="IMPACT_MOST" />
                <Badge type="IMPACT_HIGHLY" />
              </div>
              <Link to="/search" className="text-sm font-semibold text-[#ff751f] hover:text-[#892233] flex items-center gap-1 group-hover:translate-x-1 transition-transform">See High-Impact Programs &rarr;</Link>
            </div>
          </div>
        </section>

        {/* S5: Trust */}
        <section className="py-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-[#892233] font-bold tracking-widest uppercase text-sm mb-2">Trust matters</div>
            <h2 className="text-3xl font-bold text-[#011936]">These are our promises to you:</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center p-8 bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors border-none shadow-sm">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-bold text-[#011936] mb-2">100% Data Privacy</h3>
              <p className="text-sm text-[#011936] opacity-70">Your personal information belongs to you, always.</p>
            </div>
            <div className="card text-center p-8 bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors border-none shadow-sm">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="font-bold text-[#011936] mb-2">Unbiased algorithms</h3>
              <p className="text-sm text-slate-600">Students come first, not marketing budgets.</p>
            </div>
            <div className="card text-center p-8 bg-[#fade41]/20 hover:bg-[#fade41]/30 transition-colors border-none shadow-sm">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="font-bold text-[#011936] mb-2">Reviews and Rankings</h3>
              <p className="text-sm text-[#011936] opacity-70">Reviews and rankings by experts and parents.</p>
            </div>
          </div>
        </section>

        {/* S6: Stats */}
        <div className="text-center max-w-3xl mx-auto mt-4 mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-[#011936]">The most comprehensive database of learning opportunities for high schoolers.</h2>
        </div>
        <section className="grid md:grid-cols-2 gap-6">
          <div className="!bg-[#011936] rounded-2xl p-8 overflow-hidden relative shadow-lg text-white">
            <div className="absolute -right-10 -bottom-10 opacity-10 text-[180px] leading-none">🔍</div>
            <h3 className="text-2xl font-bold mb-6 relative z-10 !text-white">Search over 1000 opportunities</h3>
            <ul className="space-y-4 text-white/90 relative z-10 font-bold">
              <li className="flex items-center gap-3"><span className="text-[#ff751f] text-lg">✓</span> New: 200+ competitions</li>
              <li className="flex items-center gap-3"><span className="text-[#ff751f] text-lg">✓</span> 700+ school year programs</li>
              <li className="flex items-center gap-3"><span className="text-[#ff751f] text-lg">✓</span> 1,200+ top summer programs</li>
            </ul>
          </div>
          <div className="!bg-[#892233] rounded-2xl p-8 overflow-hidden relative shadow-lg text-white">
            <div className="absolute -right-4 -bottom-4 opacity-10 text-[150px] leading-none">⏱</div>
            <h3 className="text-2xl font-bold mb-6 relative z-10 !text-[#fade41]">Save Time and Don't Miss Out</h3>
            <ul className="space-y-4 text-white/90 relative z-10 font-bold">
              <li className="flex items-center gap-3"><span className="text-[#fade41] text-lg">✓</span> Search powered by AI</li>
              <li className="flex items-center gap-3"><span className="text-[#fade41] text-lg">✓</span> Filter by location, date, cost, and more</li>
              <li className="flex items-center gap-3"><span className="text-[#fade41] text-lg">✓</span> Expert-curated lists and ratings</li>
            </ul>
          </div>
        </section>

        {/* S7+S8: Community + CTA */}
        <section className="text-center pb-8 border-t border-slate-200 pt-16 mt-8">
          <div className="bg-[#011936] rounded-[32px] p-10 md:p-16 text-white text-center shadow-xl shadow-[#011936]/20 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#892233] rounded-full blur-[100px] opacity-20 -mr-48 -mt-48"></div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 max-w-2xl mx-auto relative z-10 !text-white">
              Campberry is built by teens and educators, for teens and educators.
            </h2>
            <p className="text-white mb-10 max-w-2xl mx-auto relative z-10 font-bold text-lg opacity-90">
              The education sector should be open and easily navigable. By aggregating the collective insights of students, parents, and education experts, everyone can access a better education.
            </p>
            <Link to="/mission" className="btn bg-[#fade41] text-[#011936] hover:bg-white hover:-translate-y-1 font-bold px-8 py-3 rounded-full relative z-10">
              Meet the Community
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <button className="flex items-center justify-center gap-3 p-4 bg-white border-2 border-slate-100 rounded-xl hover:border-[#ff751f] hover:text-[#ff751f] font-bold transition-colors group shadow-sm">
              <span className="text-xl group-hover:scale-110 transition-transform">📝</span> Create a List
            </button>
            <button className="flex items-center justify-center gap-3 p-4 bg-white border-2 border-slate-100 rounded-xl hover:border-[#892233] hover:text-[#892233] font-bold transition-colors group shadow-sm">
              <span className="text-xl group-hover:scale-110 transition-transform">⭐</span> Leave a Review
            </button>
            <button className="flex items-center justify-center gap-3 p-4 bg-white border-2 border-slate-100 rounded-xl hover:border-[#780000] hover:text-[#780000] font-bold transition-colors group shadow-sm">
              <span className="text-xl group-hover:scale-110 transition-transform">🚩</span> Flag Incorrect Info
            </button>
          </div>
        </section>

      </div>
    </div>
  )
}
