import React, { useEffect, useState } from 'react';
import { api } from '../api';
import type { Job, Bookmark } from '../types';

const Dashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, bookmarksData] = await Promise.all([
          api.getJobs(),
          api.getBookmarks()
        ]);
        setJobs(jobsData.jobs);
        setBookmarks(bookmarksData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    totalJobs: jobs.length,
    strongMatches: jobs.filter(j => j.verdict === 'strong_match').length,
    bookmarks: bookmarks.length,
    applied: bookmarks.filter(b => b.status === 'applied').length
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card h-32 animate-pulse bg-surface-alt"></div>
          ))}
        </div>
        <div className="card h-96 animate-pulse bg-surface-alt"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold">Good evening, Somasekhar!</h1>
        <p className="text-text-muted mt-2">Here's what's happening with your job search today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Jobs', value: stats.totalJobs, color: 'text-primary' },
          { label: 'Strong Matches', value: stats.strongMatches, color: 'text-strong' },
          { label: 'Bookmarks', value: stats.bookmarks, color: 'text-interview' },
          { label: 'Applied', value: stats.applied, color: 'text-applied' }
        ].map((stat, i) => (
          <div key={i} className="card flex flex-col justify-between">
            <span className="text-sm font-medium text-text-muted uppercase tracking-wider">{stat.label}</span>
            <span className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Top Matches</h2>
            <button className="text-sm text-primary font-medium hover:underline">View all jobs</button>
          </div>
          <div className="card p-0 overflow-hidden">
            <div className="divide-y divide-border">
              {jobs.slice(0, 5).map(job => (
                <div key={job._id} className="p-4 hover:bg-surface-alt transition-colors flex items-center group">
                  <div className="w-10 h-10 rounded-md bg-surface-alt border border-border flex items-center justify-center text-xl overflow-hidden shrink-0">
                    {job.companyLogo ? <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" /> : '🏢'}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary truncate">{job.title}</h3>
                    <p className="text-xs text-text-muted truncate">{job.company} · {job.location}</p>
                  </div>
                  <div className="ml-4 flex items-center space-x-3 shrink-0">
                    {job.verdict === 'strong_match' && (
                      <span className="badge bg-strong-soft text-strong border border-strong/20">Strong</span>
                    )}
                    <button className="btn btn-ghost !p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>➡️</span>
                    </button>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && (
                <div className="p-12 text-center text-text-muted">
                  <p>No jobs found. Start by refreshing your feed.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Bookmarks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Bookmarks</h2>
            <button className="text-sm text-primary font-medium hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {bookmarks.slice(0, 3).map(bookmark => (
              <div key={bookmark._id} className="card p-4 hover:translate-y-[-1px] transition-transform">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary truncate max-w-[150px]">{bookmark.title}</h3>
                    <p className="text-xs text-text-muted truncate max-w-[150px]">{bookmark.company}</p>
                  </div>
                  <span className={`badge ${
                    bookmark.status === 'applied' ? 'bg-applied/10 text-applied' : 
                    bookmark.status === 'saved' ? 'bg-saved/10 text-saved' : 'bg-surface-alt text-text-muted'
                  }`}>
                    {bookmark.status}
                  </span>
                </div>
                {bookmark.appliedAt && (
                  <p className="text-[10px] text-text-muted mt-2">Applied on {new Date(bookmark.appliedAt).toLocaleDateString()}</p>
                )}
              </div>
            ))}
            {bookmarks.length === 0 && (
              <div className="card p-8 text-center text-text-muted italic text-sm">
                No bookmarks yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
