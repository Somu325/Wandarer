import React, { useEffect, useState } from 'react';
import { api } from '../api';

interface GigIdea {
  title: string;
  platform: string;
  platformCategory: string;
  primarySkill: string;
  estimatedDemand: 'high' | 'medium' | 'low';
  estimatedEarningsPerProject: { min: number; max: number };
  whyThisUser: string;
  searchUrl: string;
}

interface RateEstimate {
  blendedRate: {
    hourlyUSD: { min: number; max: number };
    hourlyINR: { min: number; max: number };
    monthlyINR: { min: number; max: number };
    rationale: string;
  };
  bySkill: Array<{
    skill: string;
    hourlyUSD: { min: number; max: number };
    demandTrend: 'rising' | 'stable' | 'falling';
    marketNote: string;
    monetisationTip: string;
  }>;
  positioningAdvice: string;
}

const Freelance: React.FC = () => {
  const [gigs, setGigs] = useState<GigIdea[]>([]);
  const [rates, setRates] = useState<RateEstimate | null>(null);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [loadingRates, setLoadingRates] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoadingRates(true);
    try {
      const data = await api.getFreelanceRates();
      setRates(data);
    } catch (err) {
      console.error('Error fetching rates:', err);
    } finally {
      setLoadingRates(false);
    }
  };

  const handleGenerateIdeas = async () => {
    setLoadingIdeas(true);
    setError(null);
    try {
      const data = await api.getFreelanceIdeas();
      setGigs(data.gigs);
    } catch (err: any) {
      setError(err.message || 'Failed to generate ideas');
    } finally {
      setLoadingIdeas(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold">Freelance Navigator</h1>
        <p className="text-text-muted mt-1">AI-generated gig ideas and market rate analysis based on your skills.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Market Rates Column */}
        <section className="xl:col-span-1 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📈</span> Market Rates (2025)
          </h2>
          
          {loadingRates ? (
            <div className="card space-y-4 animate-pulse">
              <div className="h-20 bg-surface-alt rounded"></div>
              <div className="h-40 bg-surface-alt rounded"></div>
            </div>
          ) : rates ? (
            <div className="space-y-6">
              <div className="card bg-primary-soft/30 border-primary/20">
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Blended Rate Estimate</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase">International</p>
                    <p className="text-xl font-bold text-text-primary">${rates.blendedRate.hourlyUSD.min}-${rates.blendedRate.hourlyUSD.max}<span className="text-xs font-normal text-text-muted ml-1">/hr</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase">Domestic (INR)</p>
                    <p className="text-xl font-bold text-text-primary">₹{rates.blendedRate.hourlyINR.min}-{rates.blendedRate.hourlyINR.max}<span className="text-xs font-normal text-text-muted ml-1">/hr</span></p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-text-body italic">"{rates.blendedRate.rationale}"</p>
              </div>

              <div className="card space-y-4">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Rate by Skill</h3>
                <div className="divide-y divide-border">
                  {rates.bySkill.map((s, i) => (
                    <div key={i} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold text-text-primary">{s.skill}</span>
                        <span className="text-sm font-bold text-strong">${s.hourlyUSD.min}-${s.hourlyUSD.max}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          s.demandTrend === 'rising' ? 'bg-strong-soft text-strong' : 
                          s.demandTrend === 'falling' ? 'bg-weak-soft text-weak' : 'bg-surface-alt text-text-muted'
                        }`}>
                          {s.demandTrend}
                        </span>
                        <p className="text-[10px] text-text-muted truncate">{s.marketNote}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card bg-surface-alt/50 border-dashed">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">AI Positioning Advice</h3>
                <p className="text-xs leading-relaxed text-text-body">{rates.positioningAdvice}</p>
              </div>
            </div>
          ) : (
            <div className="card text-center p-8 text-text-muted">
              Failed to load rates.
            </div>
          )}
        </section>

        {/* Gig Ideas Column */}
        <section className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🚀</span> Tailored Gig Ideas
            </h2>
            <button 
              className={`btn btn-primary space-x-2 ${loadingIdeas ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={handleGenerateIdeas}
              disabled={loadingIdeas}
            >
              {loadingIdeas ? <span className="animate-spin">⏳</span> : <span>✨</span>}
              <span>{loadingIdeas ? 'Analyzing Skills...' : gigs.length > 0 ? 'Regenerate Ideas' : 'Generate Ideas'}</span>
            </button>
          </div>

          {error && (
            <div className="bg-weak-soft border border-weak/20 text-weak p-4 rounded-lg text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {loadingIdeas ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="card h-48 animate-pulse bg-surface-alt"></div>
              ))}
            </div>
          ) : gigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gigs.map((gig, i) => (
                <div key={i} className="card group hover:border-primary/50 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="badge bg-surface-alt text-text-muted">{gig.platform}</span>
                      <span className={`badge ${
                        gig.estimatedDemand === 'high' ? 'bg-strong-soft text-strong' : 
                        gig.estimatedDemand === 'medium' ? 'bg-partial-soft text-partial' : 'bg-weak-soft text-weak'
                      }`}>
                        {gig.estimatedDemand} Demand
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors mb-2">{gig.title}</h3>
                    <p className="text-xs text-text-body line-clamp-2 mb-4">"{gig.whyThisUser}"</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="text-[10px] font-bold text-primary bg-primary-soft px-2 py-0.5 rounded">{gig.primarySkill}</span>
                      <span className="text-[10px] font-bold text-text-muted bg-surface-alt px-2 py-0.5 rounded">{gig.platformCategory}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <div className="text-sm font-bold text-text-primary">
                      ${gig.estimatedEarningsPerProject.min}-${gig.estimatedEarningsPerProject.max}
                      <span className="text-[10px] font-normal text-text-muted ml-1">/project</span>
                    </div>
                    <a 
                      href={gig.searchUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary text-xs font-bold hover:underline flex items-center gap-1"
                    >
                      View Gigs ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card border-dashed border-2 p-20 text-center space-y-4">
              <div className="w-16 h-16 bg-surface-alt rounded-full flex items-center justify-center mx-auto text-2xl">💡</div>
              <h3 className="text-lg font-bold">Ready to start freelancing?</h3>
              <p className="text-text-muted max-w-sm mx-auto">Click the generate button to have Gemini analyze your profile and suggest high-demand gigs on platforms like Upwork and Toptal.</p>
              {!loadingIdeas && (
                <button 
                  className="btn btn-primary"
                  onClick={handleGenerateIdeas}
                >
                  Analyze My Skills
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Freelance;
