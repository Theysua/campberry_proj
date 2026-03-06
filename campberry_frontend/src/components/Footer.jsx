import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'

export default function Footer() {
  return (
    <footer className="bg-[#011936] py-12 px-6 mt-auto">
      <div className="container flex flex-col md:flex-row justify-between gap-10">
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-9 w-auto bg-white px-3 py-1.5 rounded-lg shadow-sm">
              <img src={logo} alt="Campberry" className="h-full w-auto object-contain" style={{ minWidth: '120px' }} />
            </div>
          </Link>
          <div className="text-sm text-white/70 leading-relaxed font-medium">
            <strong className="text-white">About:</strong> <Link to="/mission" className="hover:text-[#ff751f]">Our Promises</Link>, <span>Our Community</span><br />
            <strong className="text-white">Legal:</strong> <Link to="/terms-of-service" className="hover:text-[#ff751f]">Terms of Service</Link>, <Link to="/privacy-policy" className="hover:text-[#ff751f]">Privacy Policy</Link>
          </div>
        </div>

        <div className="text-sm text-white/70 md:text-right leading-relaxed flex flex-col gap-2 font-medium">
          <div><strong className="text-white">Socials:</strong> <span>TikTok</span>, <span>Instagram</span>, <span>LinkedIn</span></div>
          <div><strong className="text-white">Contact:</strong> <span>Contact Us</span></div>
          <div className="text-white/40 mt-4 text-xs font-bold tracking-widest uppercase">Campberry 2026</div>
        </div>
      </div>
    </footer>
  )
}
