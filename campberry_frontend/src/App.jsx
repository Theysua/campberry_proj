import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import { ListProvider } from './context/ListContext'

import Auth from './pages/Auth'
import Home from './pages/Home'
import LegalPage from './pages/LegalPage'
import ListDetail from './pages/ListDetail'
import Lists from './pages/Lists'
import Mission from './pages/Mission'
import MyListDetail from './pages/MyListDetail'
import MyLists from './pages/MyLists'
import ProgramDetail from './pages/ProgramDetail'
import SavedPrograms from './pages/SavedPrograms'
import Search from './pages/Search'
import VerifyEmail from './pages/VerifyEmail'
import Compare from './pages/Compare'
import CompareBar from './components/CompareBar'

// ScrollToTop strictly for scrolling to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <ListProvider>
        <HashRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/program/:id" element={<ProgramDetail />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/lists" element={<Lists />} />
                <Route path="/lists/:id" element={<ListDetail />} />
                <Route path="/my-lists" element={<MyLists />} />
                <Route path="/my-lists/:id" element={<MyListDetail />} />
                <Route path="/account/lists" element={<MyLists />} />
                <Route path="/account/lists/:id" element={<MyListDetail />} />
                <Route path="/saved-programs" element={<SavedPrograms />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="/terms-of-service" element={<LegalPage type="terms" />} />
                <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <CompareBar />
          </div>
        </HashRouter>
      </ListProvider>
    </AuthProvider>
  )
}

export default App
