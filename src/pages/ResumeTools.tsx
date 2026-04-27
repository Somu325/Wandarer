import React, { useState } from 'react';
import { api } from '../api';

const ResumeTools: React.FC = () => {
  // Bullet Rewriter State
  const [bullet, setBullet] = useState('');
  const [jd, setJd] = useState('');
  const [rewrittenBullet, setRewrittenBullet] = useState<string | null>(null);
  const [rewriting, setRewriting] = useState(false);

  // Cover Letter State
  const [clJob, setClJob] = useState({ title: '', company: '', description: '' });
  const [generatedCL, setGeneratedCL] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleRewrite = async () => {
    if (!bullet.trim() || !jd.trim()) return;
    setRewriting(true);
    try {
      const response = await api.rewriteBullet(bullet, jd);
      setRewrittenBullet(response.rewrittenBullet || response);
    } catch (error) {
      console.error('Rewrite error:', error);
    } finally {
      setRewriting(false);
    }
  };

  const handleGenerateCL = async () => {
    if (!clJob.title || !clJob.company || !clJob.description) return;
    setGenerating(true);
    try {
      const response = await api.generateCoverLetter(clJob);
      setGeneratedCL(response.coverLetter || response);
    } catch (error) {
      console.error('CL error:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h1 className="text-3xl font-bold">Resume Tools</h1>
        <p className="text-text-muted mt-1">Optimize your application materials for specific job descriptions.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Bullet Rewriter */}
        <section className="space-y-6">
          <div className="card space-y-6 border-primary/10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-primary">✨</span> Bullet Rewriter
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Target Job Description</label>
                <textarea 
                  className="input min-h-32 text-xs" 
                  placeholder="Paste the job description here..."
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Your Current Bullet Point</label>
                <input 
                  className="input" 
                  placeholder="e.g. Developed features using React and Node.js"
                  value={bullet}
                  onChange={(e) => setBullet(e.target.value)}
                />
              </div>
              <button 
                className="btn btn-primary w-full h-11"
                onClick={handleRewrite}
                disabled={rewriting || !bullet || !jd}
              >
                {rewriting ? 'Rewriting...' : 'Rewrite Bullet'}
              </button>
            </div>
          </div>

          {rewrittenBullet && (
            <div className="card bg-primary-soft/30 border-primary/20 animate-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Suggested Optimization</h3>
                <button 
                  className="text-[10px] font-bold text-primary hover:underline"
                  onClick={() => navigator.clipboard.writeText(rewrittenBullet)}
                >
                  Copy Text
                </button>
              </div>
              <p className="text-sm text-text-primary leading-relaxed font-medium">"{rewrittenBullet}"</p>
            </div>
          )}
        </section>

        {/* Cover Letter Generator */}
        <section className="space-y-6">
          <div className="card space-y-6 border-primary/10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-primary">📄</span> Cover Letter Generator
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Job Title</label>
                  <input 
                    className="input" 
                    placeholder="e.g. Senior Frontend Engineer"
                    value={clJob.title}
                    onChange={(e) => setClJob({...clJob, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Company</label>
                  <input 
                    className="input" 
                    placeholder="e.g. Google"
                    value={clJob.company}
                    onChange={(e) => setClJob({...clJob, company: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Job Description</label>
                <textarea 
                  className="input min-h-32 text-xs" 
                  placeholder="Paste details to personalize the letter..."
                  value={clJob.description}
                  onChange={(e) => setClJob({...clJob, description: e.target.value})}
                ></textarea>
              </div>
              <button 
                className="btn btn-primary w-full h-11"
                onClick={handleGenerateCL}
                disabled={generating || !clJob.title || !clJob.company || !clJob.description}
              >
                {generating ? 'Generating...' : 'Generate Cover Letter'}
              </button>
            </div>
          </div>

          {generatedCL && (
            <div className="card bg-surface animate-in slide-in-from-top-4 duration-300 max-h-[500px] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-surface pb-4">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Generated Letter</h3>
                <button 
                  className="btn btn-ghost !py-1.5 !px-3 !text-[10px] font-bold uppercase"
                  onClick={() => navigator.clipboard.writeText(generatedCL)}
                >
                  Copy All
                </button>
              </div>
              <div className="text-sm text-text-body leading-relaxed whitespace-pre-wrap font-mono bg-surface-alt/50 p-6 rounded-lg border border-border">
                {generatedCL}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ResumeTools;
