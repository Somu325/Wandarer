import React, { useEffect, useState } from 'react';
import { api } from '../api';
import type { Bookmark } from '../types';

const statusTabs: Array<Bookmark['status'] | 'All'> = ['All', 'saved', 'applied', 'interview', 'offer', 'rejected'];

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Bookmark['status'] | 'All'>('All');

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const data = await api.getBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const filteredBookmarks = bookmarks.filter(b => 
    activeTab === 'All' ? true : b.status === activeTab
  );

  const getStatusColor = (status: Bookmark['status']) => {
    switch (status) {
      case 'applied': return 'text-applied bg-applied/10';
      case 'interview': return 'text-interview bg-interview/10';
      case 'offer': return 'text-offer bg-offer/10';
      case 'rejected': return 'text-rejected bg-rejected/10';
      default: return 'text-saved bg-saved/10';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold">Bookmarks</h1>
        <p className="text-text-muted mt-1">Track your applications and saved opportunities.</p>
      </header>

      <div className="flex space-x-2 border-b border-border mb-8 overflow-x-auto no-scrollbar">
        {statusTabs.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-all capitalize whitespace-nowrap ${
              activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-muted hover:text-text-body'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card h-40 animate-pulse bg-surface-alt"></div>
          ))}
        </div>
      ) : filteredBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map(bookmark => (
            <div key={bookmark._id} className="card group hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-text-primary truncate group-hover:text-primary transition-colors">{bookmark.title}</h3>
                  <p className="text-sm text-text-muted truncate">{bookmark.company}</p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(bookmark.status)}`}>
                  {bookmark.status}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Match</span>
                  <span className={`text-xs font-bold ${
                    bookmark.matchScore >= 80 ? 'text-strong' : 
                    bookmark.matchScore >= 50 ? 'text-partial' : 'text-weak'
                  }`}>{bookmark.matchScore}%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <a 
                    href={bookmark.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-ghost !p-2 rounded-full"
                    title="View Job"
                  >
                    <span>🔗</span>
                  </a>
                  <button 
                    className="btn btn-ghost !p-2 rounded-full hover:text-weak"
                    onClick={async () => {
                      if (confirm('Delete this bookmark?')) {
                        await api.deleteBookmark(bookmark._id);
                        fetchBookmarks();
                      }
                    }}
                    title="Delete"
                  >
                    <span>🗑️</span>
                  </button>
                </div>
              </div>
              
              {bookmark.appliedAt && (
                <div className="mt-3 text-[10px] text-text-muted italic">
                  Applied on {new Date(bookmark.appliedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card border-dashed border-2 flex flex-col items-center justify-center p-20 text-center text-text-muted">
          <span className="text-5xl mb-4">🔖</span>
          <h3 className="text-lg font-bold text-text-primary">No bookmarks found</h3>
          <p className="max-w-xs mx-auto mt-2 text-sm">You haven't saved any jobs in the "{activeTab}" category yet.</p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
