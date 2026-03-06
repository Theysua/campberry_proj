import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import { getMyListById, updateList, deleteList, removeListItem, updateListItem } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit2, Check, X, ArrowUp, ArrowDown, ArrowLeft, Briefcase, Trophy } from 'lucide-react';

export default function MyListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  useScrollReveal();
  const { user } = useAuth();

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingList, setIsEditingList] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editCommentary, setEditCommentary] = useState('');

  const fetchList = () => {
    setLoading(true);
    getMyListById(id)
      .then((response) => {
        setList(response);
        setEditTitle(response.title);
        setEditDesc(response.description || '');
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchList();
  }, [id]);

  if (loading) {
    return <div className="page" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!list) {
    return <div className="page" style={{ padding: '40px', textAlign: 'center' }}>List not found.</div>;
  }

  const isOwner = user?.id === list.author_id;

  const handleUpdateList = async () => {
    try {
      await updateList(list.id, editTitle, editDesc, list.is_public);
      setIsEditingList(false);
      fetchList();
    } catch (error) {
      console.error(error);
      alert('Failed to update list. Check console.');
    }
  };

  const handleDeleteList = async () => {
    if (!window.confirm('Are you sure you want to delete this entire list?')) {
      return;
    }

    try {
      await deleteList(list.id);
      navigate('/my-lists');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm('Remove this program from the list?')) {
      return;
    }

    try {
      await removeListItem(list.id, itemId);
      fetchList();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMove = async (index, direction) => {
    if (direction === -1 && index === 0) {
      return;
    }

    if (direction === 1 && index === list.items.length - 1) {
      return;
    }

    const currentItem = list.items[index];
    const swapItem = list.items[index + direction];

    try {
      await updateListItem(list.id, currentItem.id, currentItem.author_commentary, currentItem.display_order + direction);
      await updateListItem(list.id, swapItem.id, swapItem.author_commentary, swapItem.display_order - direction);
      fetchList();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditCommentary = (item) => {
    setEditingItemId(item.id);
    setEditCommentary(item.author_commentary || '');
  };

  const handleSaveCommentary = async (item) => {
    try {
      await updateListItem(list.id, item.id, editCommentary, item.display_order);
      setEditingItemId(null);
      fetchList();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#f4f7f9] min-h-screen pb-20 animate-fade-in relative z-0" id="page-mylistdetail">
      <div className="container max-w-5xl pt-10 px-6 mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="w-full md:w-80 shrink-0 sticky top-32 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 z-10">
            <button className="text-slate-500 mb-6 hover:text-[#011936] font-bold text-sm transition-colors" onClick={() => navigate('/my-lists')}>
              <span className="inline-flex items-center gap-2"><ArrowLeft size={14} /> Back to My Lists</span>
            </button>

            {isEditingList && isOwner ? (
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-[#011936] mb-1">Title</label>
                  <input className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#892233]" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#011936] mb-1">Description</label>
                  <textarea className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#892233] h-24 resize-none" value={editDesc} onChange={(event) => setEditDesc(event.target.value)} />
                </div>
                <div className="flex justify-end gap-3 mt-2">
                  <button className="text-slate-400 hover:text-slate-600 p-2" onClick={() => setIsEditingList(false)}><X size={18} /></button>
                  <button className="text-white hover:bg-[#780000] bg-[#892233] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2" onClick={handleUpdateList}>Save <Check size={16} /></button>
                </div>
              </div>
            ) : (
              <div className="mb-6 relative group">
                <h1 className="text-2xl font-bold text-[#011936] mb-3 leading-snug pr-8">{list.title}</h1>
                <p className="text-sm text-slate-500 mb-4 pb-4 border-b border-slate-100">{list.description || 'No description'}</p>
                {isOwner && (
                  <button className="absolute top-0 right-0 p-1 text-slate-300 hover:text-[#892233] opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setIsEditingList(true)}>
                    <Edit2 size={16} />
                  </button>
                )}

                <div className="flex justify-between items-center py-2 text-sm font-bold text-[#011936]">
                  <span>Total Programs</span>
                  <span className="text-[#892233] bg-red-50 px-2 py-0.5 rounded-md">{list.items?.length || 0}</span>
                </div>

                {isOwner && (
                  <button onClick={handleDeleteList} className="w-full mt-6 py-2.5 rounded-lg text-sm font-bold text-red-500 border border-transparent hover:border-red-100 hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={16} /> Delete List
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 w-full">
            <h2 className="text-xl font-bold text-[#011936] mb-6">Programs in this list</h2>

            <div className="flex flex-col gap-4">
              {list.items && list.items.length > 0 ? list.items.map((item, index) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 relative group transition-shadow hover:shadow-md cursor-default">
                  {isOwner && (
                    <div className="absolute top-4 right-4 flex flex-col items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button disabled={index === 0} onClick={() => handleMove(index, -1)} className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed">
                        <ArrowUp size={14} />
                      </button>
                      <button disabled={index === list.items.length - 1} onClick={() => handleMove(index, 1)} className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed">
                        <ArrowDown size={14} />
                      </button>
                      <button onClick={() => handleRemoveItem(item.id)} className="p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-500 mt-2" title="Remove">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-4 items-center flex-1 cursor-pointer pr-8" onClick={() => navigate(`/program/${item.program_id}`)}>
                    <div className="text-2xl font-black text-[#f1f5f9] select-none w-8 text-right">#{index + 1}</div>
                    <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 text-2xl">
                      {item.program?.type === 'COMPETITION' ? <Trophy size={22} className="text-slate-500" /> : <Briefcase size={22} className="text-slate-500" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#011936] hover:text-[#892233] transition-colors line-clamp-2 pr-4">{item.program?.name}</h3>
                      <div className="text-sm font-medium text-slate-500 mt-0.5">{item.program?.provider?.name || 'Unknown Provider'}</div>
                    </div>
                  </div>

                  <div className="w-full md:w-5/12 bg-slate-50 rounded-xl p-4 border border-slate-100 relative mt-4 md:mt-0 md:min-h-[100px] flex flex-col justify-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Counselor&apos;s Note</div>

                    {editingItemId === item.id ? (
                      <div className="flex flex-col gap-2 relative z-20">
                        <textarea className="w-full text-sm p-2 border border-[#892233] focus:ring-1 focus:ring-[#892233] outline-none bg-white rounded-lg h-24 resize-none font-medium text-[#011936]" autoFocus placeholder="Add your reason why this program is a good fit..." value={editCommentary} onChange={(event) => setEditCommentary(event.target.value)} />
                        <div className="flex justify-end gap-2 mt-1">
                          <button onClick={() => setEditingItemId(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xs px-2 py-1">Cancel</button>
                          <button onClick={() => handleSaveCommentary(item)} className="text-white hover:bg-slate-800 bg-slate-900 rounded-md font-bold text-xs px-4 py-1.5 shadow-sm">Save Note</button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-[#011936] font-medium leading-relaxed group/comment relative pr-6">
                        {item.author_commentary ? `"${item.author_commentary}"` : <span className="text-slate-400 italic font-normal">No notes added.</span>}
                        {isOwner && (
                          <button onClick={() => startEditCommentary(item)} className="absolute top-0 right-0 -mr-2 text-slate-300 hover:text-[#892233] p-1 opacity-100 md:opacity-0 group-hover/comment:opacity-100 transition-opacity bg-white/50 rounded-md">
                            <Edit2 size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center text-center mt-2">
                  <div className="text-slate-400 mb-4 font-bold text-lg">No programs tracked in this list</div>
                  <button onClick={() => navigate('/search')} className="bg-[#011936] text-white hover:bg-slate-800 px-6 py-2.5 rounded-full font-bold text-sm shadow-sm transition-colors">Explore Programs</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
