import { Plus, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ListCard from '../components/ListCard'

export default function MyLists() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [listName, setListName] = useState('')
  const [listDesc, setListDesc] = useState('')

  const featuredLists = [
    { id: '1', title: "School Counseling Group's Favorite Programs", author: 'School Counseling Group', authorRole: 'Admissions Consultants' },
    { id: '2', title: "Pre-college Summer Programs That Demonstrate Interest", author: 'Campberry', authorRole: 'Official Team Account' },
    { id: '3', title: "Engineering Courses Summer 2026", author: 'Sam Luby', authorRole: 'Independent Counselor' },
    { id: '4', title: "Eight Great Years’ Favorite Programs", author: 'Alyse Graham', authorRole: 'Founder, Eight Great Years' },
  ]

  const handleCreateList = () => {
    // Navigate to the newly created list page (mocked ID 123)
    navigate('/my-lists/123')
  }

  return (
    <div className="bg-[#f4f7f9] min-h-screen pb-20 animate-fade-in relative z-0">
      
      <div className="container max-w-5xl pt-10 px-6">
        <h1 className="text-3xl font-bold text-[#011936] mb-6">My Lists</h1>
        
        {/* Empty State Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm mb-12 flex flex-col items-center">
          <div className="text-[#892233] mb-4">
            <Sparkles size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#011936] mb-2">No lists yet</h2>
          <p className="text-slate-600 mb-6">Create or save a featured list to begin.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn outline sm text-[#892233] border-[#892233]/20 hover:bg-[#ddfff7] rounded-full font-bold px-6"
          >
            <Plus size={16} /> New List
          </button>
        </div>

        {/* Featured Lists Section */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-[#011936]">Featured Lists</h2>
            <Link to="/lists" className="text-sm font-medium underline text-slate-600 hover:text-[#011936]">
              See All Lists
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredLists.map(list => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        </div>

      </div>

      {/* New List Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={20} />
            </button>
            
            <div className="p-8">
              <h2 className="text-xl font-bold text-[#011936] mb-6">Create New List</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-bold text-[#011936] mb-2">List Name</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#892233] focus:ring-1 focus:ring-[#892233] transition-shadow text-sm font-medium"
                  placeholder="Enter a name"
                  value={listName}
                  onChange={e => setListName(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#011936] mb-2">List Description</label>
                <textarea 
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#892233] focus:ring-1 focus:ring-[#892233] transition-shadow text-sm resize-none h-24 font-medium"
                  placeholder="Enter a description"
                  value={listDesc}
                  onChange={e => setListDesc(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-full flex justify-end mb-4">
                  <button 
                    onClick={handleCreateList}
                    className="bg-[#892233] hover:bg-[#780000] text-white font-bold py-2 px-8 rounded-full transition-colors text-sm shadow-md"
                  >
                    Create
                  </button>
                </div>
                <div className="text-xs text-slate-500">
                  Add opportunities after creating the list.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
