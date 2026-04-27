import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { Job } from '../types';

const JobsFeed: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'strong_match' | 'partial_match' | 'weak_match' | 'unscored'>('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsData, bookmarksData] = await Promise.all([
        api.getJobs(),
        api.getBookmarks()
      ]);
      setJobs(jobsData.jobs);
      setBookmarkedIds(new Set(bookmarksData.map(b => b.jobRef).filter(Boolean) as string[]));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await api.refreshJobs();
      await fetchData();
    } catch (error) {
      console.error('Error refreshing jobs:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleBookmark = async (job: Job) => {
    try {
      if (bookmarkedIds.has(job._id)) {
        // Toggle off not supported in API yet, would need deleteBookmark with jobRef search
        return;
      }
      await api.addBookmark({
        jobRef: job._id,
        externalUrl: job.url,
        title: job.title,
        company: job.company,
        matchScore: job.matchScore ?? 0,
        status: 'saved'
      });
      setBookmarkedIds(prev => new Set([...prev, job._id]));
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    if (filter === 'unscored') return job.matchScore === null;
    return job.verdict === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Jobs Feed</h1>
          <p className="text-text-muted mt-1">Discover opportunities tailored to your profile.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            className="input !w-auto h-11"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Jobs</option>
            <option value="strong_match">Strong Matches</option>
            <option value="partial_match">Partial Matches</option>
            <option value="weak_match">Weak Matches</option>
            <option value="unscored">Not Scored</option>
          </select>
          <button 
            className="btn btn-primary space-x-2 h-11"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <span className="animate-spin inline-block text-lg">⏳</span>
            ) : (
              <span className="text-lg">🔄</span>
            )}
            <span className="font-bold">{refreshing ? 'Refreshing...' : 'Refresh Feed'}</span>
          </button>
        </div>
      </header>

      {refreshing && (
        <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold mb-2 text-text-primary">Fetching and scoring jobs...</h2>
          <p className="text-text-muted max-w-md">This takes about 10-30 seconds as we use Gemini 2.5 Flash to analyze each opportunity against your profile.</p>
        </div>
      )}

      {loading && !refreshing ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card h-48 animate-pulse bg-surface-alt"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 pb-20">
          {filteredJobs.map(job => (
            <div key={job._id} className="card group hover:shadow-lg transition-all duration-300 border-primary/5 hover:border-primary/20">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-16 h-16 rounded-xl bg-surface-alt border border-border flex items-center justify-center text-3xl overflow-hidden shrink-0 self-start md:self-center shadow-inner">
                  {job.companyLogo ? <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" /> : '🏢'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors leading-tight">{job.title}</h3>
                      <p className="text-text-muted font-bold text-sm mt-1">{job.company} · {job.location} · {job.isRemote ? 'Remote' : 'On-site'}</p>
                    </div>
                    <button 
                      className={`btn btn-ghost !p-2 rounded-full transition-all ${bookmarkedIds.has(job._id) ? 'text-weak bg-weak-soft/30' : 'hover:text-weak'}`}
                      onClick={() => handleBookmark(job)}
                    >
                      <span className="text-xl">{bookmarkedIds.has(job._id) ? '❤️' : '♡'}</span>
                    </button>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.tags.slice(0, 5).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-surface-alt text-text-muted text-[10px] font-bold rounded uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">AI Match Score</span>
                        <span className={`text-sm font-black ${
                          job.verdict === 'strong_match' ? 'text-strong' : 
                          job.verdict === 'partial_match' ? 'text-partial' : 'text-weak'
                        }`}>{job.matchScore ?? 0}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-alt rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full transition-all duration-700 ${
                            job.verdict === 'strong_match' ? 'bg-strong' : 
                            job.verdict === 'partial_match' ? 'bg-partial' : 'bg-weak'
                          }`}
                          style={{ width: `${job.matchScore ?? 0}%` }}
                        ></div>
                      </div>
                      {job.matchReason && (
                        <p className="mt-3 text-xs text-text-body font-medium italic border-l-2 border-primary/20 pl-3 leading-relaxed">"{job.matchReason}"</p>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-3">Gap Analysis</span>
                      <div className="flex flex-wrap gap-2">
                        {job.missingSkills.length > 0 ? job.missingSkills.map(skill => (
                          <span key={skill} className="text-[10px] font-bold text-weak bg-weak-soft/50 px-2.5 py-1 rounded-full border border-weak/10">{skill}</span>
                        )) : (
                          <span className="text-[10px] font-bold text-strong bg-strong-soft/50 px-2.5 py-1 rounded-full border border-strong/10">Perfect Skill Match</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end space-x-3">
                    <button 
                      className="btn btn-ghost hover:bg-primary-soft hover:text-primary border-transparent font-bold"
                      onClick={() => navigate('/resume', { state: { job } })}
                    >
                      Tailor Resume ✨
                    </button>
                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary px-6 font-bold shadow-sm">
                      Apply Direct ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredJobs.length === 0 && (
            <div className="card p-20 text-center space-y-6 border-dashed border-2">
              <span className="text-6xl block animate-bounce">🕵️‍♂️</span>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-text-primary">No matching jobs found.</h2>
                <p className="text-text-muted max-w-sm mx-auto">Try broadening your filters or refresh the feed to pull latest listings from Remotive & ArbeitNow.</p>
              </div>
              <button className="btn btn-primary px-8" onClick={handleRefresh}>Refresh All Jobs</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobsFeed;
