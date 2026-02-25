import { Bookmark, ListChecks, LogOut, Search, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { clearAuthToken, getAuthToken, getMe } from '../services/api'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  
  const isActive = (path) => location.pathname.startsWith(path)

  useEffect(() => {
    const fetchUser = async () => {
      if (getAuthToken()) {
        try {
          const userData = await getMe()
          setUser(userData)
        } catch (err) {
          console.error("Failed to fetch user:", err)
          clearAuthToken()
        }
      } else {
        setUser(null)
      }
    }
    fetchUser()
  }, [location.pathname])

  const handleLogout = () => {
    clearAuthToken()
    setUser(null)
    navigate('/auth')
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white sticky top-0 z-50 shadow-sm border-b border-slate-100">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="h-8 w-auto">
            <img src={logo} alt="Campberry" className="h-full w-auto object-contain" style={{ minWidth: '140px' }} />
          </div>
          <span className="badge mt-auto mb-1" style={{ backgroundColor: '#ff751f', color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '4px' }}>beta</span>
        </Link>
      </div>
      
      <div className="hidden md:flex gap-8">
        <Link to="/search" className={`flex items-center gap-2 text-sm font-bold transition-colors ${isActive('/search') ? 'text-[#892233]' : 'text-[#011936]/70 hover:text-[#892233]'}`}>
          <Search size={16} /> Find
        </Link>
        <Link to="/lists" className={`flex items-center gap-2 text-sm font-bold transition-colors ${isActive('/lists') ? 'text-[#892233]' : 'text-[#011936]/70 hover:text-[#892233]'}`}>
          <ListChecks size={16} /> Lists
        </Link>
        <Link to="/my-lists" className={`flex items-center gap-2 text-sm font-bold transition-colors ${isActive('/my-lists') ? 'text-[#892233]' : 'text-[#011936]/70 hover:text-[#892233]'}`}>
          <Bookmark size={16} /> My Lists
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-600 flex items-center gap-2">
              <User size={16} className="text-[#892233]" /> {user.name}
            </span>
            <button onClick={handleLogout} className="text-sm font-bold text-slate-500 hover:text-[#892233] transition-colors flex items-center gap-1">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        ) : (
          <Link to="/auth" className="btn sm outline !border-[#892233] !text-[#892233] hover:!bg-[#892233] hover:!text-white font-bold transition-all">Sign In</Link>
        )}
      </div>
    </nav>
  )
}
