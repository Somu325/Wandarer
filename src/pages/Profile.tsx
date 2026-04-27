import React, { useEffect, useState } from 'react';
import { api } from '../api';
import type { Profile as ProfileType } from '../types';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Experience': false,
    'Projects': false,
    'Education': false,
    'Certifications': false
  });

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateSection = async (section: string, data: any) => {
    setSaving(section);
    try {
      const updated = await api.updateProfileSection(section, data);
      setProfile(updated);
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
      alert(`Failed to update ${section}`);
    } finally {
      setSaving(null);
    }
  };

  const toggleSection = (name: string) => {
    setExpandedSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  if (loading) return <div className="card h-96 animate-pulse bg-surface-alt"></div>;

  if (!profile) return (
    <div className="card p-20 text-center space-y-6">
      <span className="text-6xl block">👋</span>
      <h2 className="text-3xl font-bold">Welcome to Wanderer!</h2>
      <p className="text-text-muted max-w-md mx-auto">Set up your profile to start receiving AI-powered job matches and career insights.</p>
      <button className="btn btn-primary btn-lg">Create My Profile</button>
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-text-muted mt-1">This information is used by Gemini to personalize your experience.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-strong font-medium bg-strong-soft px-3 py-1.5 rounded-full border border-strong/20">
          <span>✅</span>
          <span>AI Context Synced</span>
        </div>
      </header>

      {/* Personal Info */}
      <section className="card space-y-6 relative overflow-hidden group">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold border-2 border-primary/20">
              {profile.personalInfo.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.personalInfo.name}</h2>
              <p className="text-text-muted font-medium">{profile.personalInfo.title}</p>
            </div>
          </div>
          <button className="btn btn-ghost !px-3 !py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-primary-soft hover:text-primary border-transparent">Edit Profile</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
          {[
            { label: 'Email', value: profile.personalInfo.email, icon: '📧' },
            { label: 'Phone', value: profile.personalInfo.phone, icon: '📱' },
            { label: 'Location', value: `${profile.personalInfo.location.city}, ${profile.personalInfo.location.country}`, icon: '📍' },
            { label: 'LinkedIn', value: profile.personalInfo.linkedin, icon: '🔗', isLink: true },
            { label: 'GitHub', value: profile.personalInfo.github, icon: '💻', isLink: true }
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-3 text-text-body">
              <span className="text-lg w-6">{item.icon}</span>
              <span className={`truncate ${item.isLink ? 'text-primary hover:underline cursor-pointer' : ''}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* AI Settings */}
      <section className="card space-y-6 border-l-4 border-l-primary shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-xl font-bold">AI Matching Settings</h2>
          </div>
          <button 
            className={`btn btn-primary !px-4 !py-1.5 ${saving === 'aiSettings' ? 'opacity-70' : ''}`}
            onClick={() => {
              const form = document.getElementById('ai-settings-form') as HTMLFormElement;
              const formData = new FormData(form);
              const data = {
                seniority: formData.get('seniority'),
                yearsExp: Number(formData.get('yearsExp')),
                workType: formData.get('workType'),
                remote: formData.get('remote'),
                salaryMin: Number(formData.get('salaryMin')),
                salaryMax: Number(formData.get('salaryMax')),
                targetRoles: profile.targetRoles // keep as is for now
              };
              handleUpdateSection('aiSettings', data);
            }}
            disabled={saving === 'aiSettings'}
          >
            {saving === 'aiSettings' ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
        
        <form id="ai-settings-form" className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Seniority</label>
            <select name="seniority" className="input" defaultValue={profile.seniority}>
              <option value="junior">Junior</option>
              <option value="mid">Mid-level</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Years of Experience</label>
            <input name="yearsExp" type="number" className="input" defaultValue={profile.yearsExp} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Work Type</label>
            <select name="workType" className="input" defaultValue={profile.workType}>
              <option value="fulltime">Full-Time</option>
              <option value="freelance">Freelance</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Work Mode</label>
            <select name="remote" className="input" defaultValue={profile.remote}>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Min Salary (INR pa)</label>
            <input name="salaryMin" type="number" className="input" defaultValue={profile.salaryMin} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Max Salary (INR pa)</label>
            <input name="salaryMax" type="number" className="input" defaultValue={profile.salaryMax} />
          </div>
        </form>

        <div className="space-y-3 pt-4 border-t border-border">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Target Roles</label>
          <div className="flex flex-wrap gap-2">
            {profile.targetRoles.map(role => (
              <span key={role} className="badge bg-primary-soft text-primary border border-primary/20 flex items-center space-x-2 lowercase font-bold">
                <span>{role}</span>
                <button className="hover:text-primary-dark ml-1 text-xs">✕</button>
              </span>
            ))}
            <button className="text-[10px] font-bold text-primary hover:bg-primary-soft px-3 py-1 rounded-full border border-primary/20 transition-all">+ Add Role</button>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Professional Summary</h2>
          <button 
            className="text-xs font-bold text-primary uppercase tracking-widest hover:underline"
            onClick={() => {
              const text = prompt('Update Summary:', profile.summary);
              if (text !== null) handleUpdateSection('summary', text);
            }}
          >
            {saving === 'summary' ? 'Saving...' : 'Edit ✏️'}
          </button>
        </div>
        <p className="text-sm text-text-body leading-relaxed whitespace-pre-wrap">{profile.summary}</p>
      </section>

      {/* Skills */}
      <section className="card space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Skills & Technologies</h2>
          <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Edit ✏️</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {[
            { label: 'Frontend', skills: profile.skills.frontend },
            { label: 'Backend', skills: profile.skills.backend },
            { label: 'Databases', skills: profile.skills.databases },
            { label: 'DevOps & Tools', skills: profile.skills.toolsAndDevops }
          ].map(section => (
            <div key={section.label} className="space-y-3">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{section.label}</h3>
              <div className="flex flex-wrap gap-2">
                {section.skills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-surface-alt border border-border text-text-body text-[11px] font-bold rounded shadow-sm hover:border-primary/30 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collapsible Sections */}
      <div className="space-y-4">
        {Object.keys(expandedSections).map(name => (
          <div key={name} className="card p-0 overflow-hidden">
            <button 
              onClick={() => toggleSection(name)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-surface-alt transition-colors"
            >
              <div className="flex items-center space-x-4">
                <span className="text-xl">{name === 'Experience' ? '💼' : name === 'Projects' ? '🚀' : name === 'Education' ? '🎓' : '🏆'}</span>
                <h2 className="text-lg font-bold">{name}</h2>
              </div>
              <span className={`transition-transform duration-300 font-mono text-text-muted ${expandedSections[name] ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {expandedSections[name] && (
              <div className="px-6 pb-6 pt-2 border-t border-border animate-in slide-in-from-top-2 duration-200">
                {name === 'Experience' && profile.experience.map((exp, i) => (
                  <div key={i} className="mb-6 last:mb-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-text-primary">{exp.role}</h3>
                      <span className="text-[10px] font-bold text-text-muted uppercase">{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <p className="text-sm font-medium text-primary mb-3">{exp.company} · {exp.employmentType}</p>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((r, ri) => (
                        <li key={ri} className="text-xs text-text-body flex gap-3">
                          <span className="text-primary">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {name === 'Projects' && profile.projects.map((proj, i) => (
                  <div key={i} className="mb-6 last:mb-0">
                    <h3 className="font-bold text-text-primary mb-1">{proj.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {proj.techStack.map(t => <span key={t} className="text-[10px] font-bold text-primary">{t}</span>)}
                    </div>
                    <ul className="space-y-1">
                      {proj.highlights.map((h, hi) => (
                        <li key={hi} className="text-xs text-text-body flex gap-3">
                          <span className="text-primary-soft text-primary">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {(name === 'Education' || name === 'Certifications') && (
                  <p className="text-sm text-text-muted italic text-center py-4">Click edit to manage your {name.toLowerCase()}.</p>
                )}
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                  <button className="btn btn-ghost !py-1.5 !px-3 !text-[10px] font-bold uppercase">Edit {name}</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
