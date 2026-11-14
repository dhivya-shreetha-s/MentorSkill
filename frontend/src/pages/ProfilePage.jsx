import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen
} from 'lucide-react';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

const proficiencyOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const careerOptions = [
  'Full Stack Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'DevOps & Cloud Engineer',
  'AI / ML Engineer',
  'Data Scientist',
  'Mobile App Developer',
  'Cybersecurity Analyst'
];

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    full_name: '',
    education: '',
    college: '',
    current_year: '',
    field_of_study: '',
    target_career: 'Full Stack Developer',
    preferred_learning_style: 'Project-based / Hands-on',
    hours_per_week: 10
  });
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState('Intermediate');
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pRes, sRes] = await Promise.all([
          api.get('/api/profile'),
          api.get('/api/skills')
        ]);
        if (pRes.data?.profile) setProfile((prev) => ({ ...prev, ...pRes.data.profile }));
        if (sRes.data?.skills) setSkills(sRes.data.skills);
      } catch (err) {
        console.warn('Error loading profile', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setFeedbackMsg(null);
    try {
      await api.post('/api/profile', profile);
      setFeedbackMsg({ type: 'success', text: 'Profile saved successfully!' });
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      const res = await api.post('/api/skills', {
        skill_name: newSkillName.trim(),
        proficiency_level: newSkillProficiency,
        source: 'self_reported'
      });
      if (res.data?.skill) {
        setSkills([...skills, res.data.skill]);
      } else {
        setSkills([...skills, { skill_name: newSkillName.trim(), proficiency_level: newSkillProficiency }]);
      }
      setNewSkillName('');
    } catch (err) {
      console.error('Error adding skill', err);
    }
  };

  const handleDeleteSkill = async (skillId, skillName) => {
    try {
      if (skillId) {
        await api.delete(`/api/skills/${skillId}`);
      }
      setSkills(skills.filter((s) => (s.id ? s.id !== skillId : s.skill_name !== skillName)));
    } catch (err) {
      console.error('Error deleting skill', err);
    }
  };

  if (loading) return <LoadingSpinner text="Loading profile details..." />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Learner Profile & Competencies</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your academic background, target role goals, and self-reported skills portfolio.
        </p>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Profile Form */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 border-white/10">
          <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Personal & Academic Information</h2>
              <p className="text-xs text-slate-400">Used by agents to gauge experience depth</p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="input-field"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Target Career Role
                </label>
                <select
                  value={profile.target_career || 'Full Stack Developer'}
                  onChange={(e) => setProfile({ ...profile, target_career: e.target.value })}
                  className="input-field bg-navy-900"
                >
                  {careerOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Degree / Education
                </label>
                <input
                  type="text"
                  value={profile.education || ''}
                  onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                  className="input-field"
                  placeholder="e.g. B.Tech in CSE"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Current Year
                </label>
                <select
                  value={profile.current_year || '3rd Year'}
                  onChange={(e) => setProfile({ ...profile, current_year: e.target.value })}
                  className="input-field bg-navy-900"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Final Year">Final Year</option>
                  <option value="Recent Graduate">Recent Graduate</option>
                  <option value="Working Professional">Working Professional</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  College / Institution
                </label>
                <input
                  type="text"
                  value={profile.college || ''}
                  onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                  className="input-field"
                  placeholder="Institution name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={profile.field_of_study || ''}
                  onChange={(e) => setProfile({ ...profile, field_of_study: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Preferred Learning Style
                </label>
                <select
                  value={profile.preferred_learning_style || 'Project-based / Hands-on'}
                  onChange={(e) => setProfile({ ...profile, preferred_learning_style: e.target.value })}
                  className="input-field bg-navy-900"
                >
                  <option value="Project-based / Hands-on">Project-based / Hands-on</option>
                  <option value="Video Lectures & Tutorials">Video Lectures & Tutorials</option>
                  <option value="Deep Documentation & Reading">Deep Documentation & Reading</option>
                  <option value="Interactive Coding Challenges">Interactive Coding Challenges</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Study Commitment: {profile.hours_per_week || 10} Hours/Week
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={profile.hours_per_week || 10}
                  onChange={(e) => setProfile({ ...profile, hours_per_week: parseInt(e.target.value, 10) })}
                  className="w-full accent-violet-500 cursor-pointer mt-2"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="btn-primary flex items-center gap-2 text-sm shadow-md shadow-violet-600/30"
              >
                <Save className="w-4 h-4" />
                <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Skill Management */}
        <div className="glass-card p-6 sm:p-8 border-white/10 flex flex-col">
          <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Your Skill Inventory</h2>
              <p className="text-xs text-slate-400">{skills.length} skills recorded</p>
            </div>
          </div>

          {/* Add skill inline */}
          <form onSubmit={handleAddSkill} className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Skill (e.g. GraphQL, Tailwind)"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="input-field text-sm"
            />
            <div className="flex gap-2">
              <select
                value={newSkillProficiency}
                onChange={(e) => setNewSkillProficiency(e.target.value)}
                className="input-field bg-navy-900 text-sm flex-1"
              >
                {proficiencyOptions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <button
                type="submit"
                className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </form>

          {/* Skills list */}
          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[380px] pr-1">
            {skills.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">No skills added yet.</p>
            ) : (
              skills.map((s, idx) => (
                <div
                  key={s.id || idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all"
                >
                  <div>
                    <span className="font-semibold text-sm text-white">{s.skill_name}</span>
                    <span className="block text-[10px] text-slate-400">
                      {s.verified ? 'Verified via Assessment' : 'Self-Reported'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      {s.proficiency_level}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(s.id, s.skill_name)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
