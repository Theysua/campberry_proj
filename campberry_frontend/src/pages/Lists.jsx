import ListCard from '../components/ListCard'

export default function Lists() {
  const allLists = [
    { id: '1', title: "School Counseling Group's Favorite Programs", author: 'School Counseling Group', authorRole: 'Admissions Consultants', width: 'w-full' },
    { id: '2', title: "Pre-college Summer Programs That Demonstrate Interest", author: 'Campberry', authorRole: 'Official Team Account', width: 'w-full' },
    { id: '3', title: "Engineering Courses Summer 2026", author: 'Sam Luby', authorRole: 'Independent Counselor', width: 'w-full' },
    { id: '4', title: "Eight Great Years’ Favorite Programs", author: 'Alyse Graham', authorRole: 'Founder, Eight Great Years', width: 'w-full' },
    { id: '5', title: "High-Impact Experiences That Hold Up in Elite Admissions Review", author: 'John Morganelli', authorRole: 'Ex-Director of Admissions: Cornell University', width: 'w-full' },
    { id: '6', title: "Top Free Programs for Low-Income Students", author: 'Pamela Musungu', authorRole: 'GritHub, Founder', width: 'w-full' },
  ]

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 animate-fade-in relative z-0">
      <div className="bg-[#892233] border-b border-[#780000] py-16 mb-8 text-white shadow-lg">
        <div className="container text-center">
           <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Curated Lists</h1>
           <p className="text-[#f8fafc] font-medium text-lg opacity-90 max-w-xl mx-auto">Discover hand-picked collections of top programs, curated by our team of experts.</p>
        </div>
      </div>
      
      <div className="container">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold text-[#011936]">Featured Lists</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allLists.map(list => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      </div>
    </div>
  )
}
