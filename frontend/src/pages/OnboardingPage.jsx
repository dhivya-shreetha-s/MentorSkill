import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Target,
  Clock,
  BookOpen
} from 'lucide-react';
import api from '../lib/api';

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

const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const suggestedSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'SQL',
  'Docker', 'AWS', 'Git', 'HTML/CSS', 'Tailwind CSS', 'MongoDB'
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Step 1: Personal Info
  const [formData, setFormData] = useState({
    fullName: '',
    education: 'Bachelor of Technology',
    college: '',
    currentYear: '3rd Year',
    fieldOfStudy: 'Computer Science & Engineering',
    // Step 3: Career Goals
    targetCareer: 'Full Stack Developer',
    preferredLearningStyle: 'Project-based / Hands-on',
    hoursPerWeek: 15
  });

  // Step 2: Skills
  const [skills, setSkills] = useState([
    { skill_name: 'JavaScript', proficiency_level: 'Intermediate' },
    { skill_name: 'React', proficiency_level: 'Beginner' },
    { skill_name: 'HTML/CSS', proficiency_level: 'Intermediate' }
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newProficiency, setNewProficiency] = useState('Intermediate');

  const addSkill = (name, prof = 'Intermediate') => {
    const trimmed = (name || newSkillName).trim();
    if (!trimmed) return;
    if (skills.some((s) => s.skill_name.toLowerCase() === trimmed.toLowerCase())) {
      return;
    }
    setSkills([...skills, { skill_name: trimmed, proficiency_level: prof || newProficiency }]);
    setNewSkillName('');
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, idx) => idx !== index));
  };

  const handleFinish = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Update Profile
      await api.post('/api/profile', {
        full_name: formData.fullName,
        education: formData.education,
        college: formData.college,
        current_year: formData.currentYear,
        field_of_study: formData.fieldOfStudy,
        target_career: formData.targetCareer,
        preferred_learning_style: formData.preferredLearningStyle,
        hours_per_week: parseInt(formData.hoursPerWeek, 10) || 10,
        onboarding_completed: true
      });

      // 2. Save Skills
      for (const s of skills) {
        try {
          await api.post('/api/skills', {
            skill_name: s.skill_name,
            proficiency_level: s.proficiency_level,
            source: 'self_reported'
          });
        } catch (sErr) {
          console.warn('Skill save notice', sErr);
        }
      }

      // 3. Trigger initial gap analysis if available
      try {
        await api.post('/api/analysis/run', {
          targetCareer: formData.targetCareer
        });
      } catch (analysisErr) {
        console.warn('Initial analysis run notice', analysisErr);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding failed', err);
      setError(err.response?.data?.error || err.message || 'Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress header */}
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
            Step {step} of 3
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            {step === 1 && 'Tell Us About Your Background'}
            {step === 2 && 'What Are Your Current Skills?'}
            {step === 3 && 'Define Your Target Career & Schedule'}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            This will allow our 6 AI agents to formulate your personalized readiness score.
          </p>

          <div className="flex gap-2 mt-6 max-w-xs mx-auto">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  num <= step ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8 shadow-2xl border-white/10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Academic & Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Education Degree</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech / B.E. / BCA"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Year / Status</label>
                  <select
                    value={formData.currentYear}
                    onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">College or Institution</label>
                <input
                  type="text"
                  placeholder="e.g. Stanford University / Tech Institute"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Field of Study / Major</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science, Information Technology, AI"
                  value={formData.fieldOfStudy}
                  onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Add Custom Skill Form */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Add a skill (e.g. TypeScript, Docker)"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="input-field flex-1"
                />
                <select
                  value={newProficiency}
                  onChange={(e) => setNewProficiency(e.target.value)}
                  className="input-field bg-navy-900 sm:w-44"
                >
                  {proficiencyLevels.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => addSkill()}
                  className="btn-primary flex items-center justify-center gap-1.5 px-4"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Quick suggestions */}
              <div>
                <p className="text-xs text-slate-400 mb-2">Quick additions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s, 'Beginner')}
                      className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 hover:border-violet-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills list */}
              <div className="space-y-2 pt-2 border-t border-white/10 max-h-60 overflow-y-auto pr-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Your Added Skills ({skills.length})
                </p>
                {skills.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10"
                  >
                    <span className="font-medium text-sm text-white">{item.skill_name}</span>
                    <div className="flex items-center gap-3">
                      <select
                        value={item.proficiency_level}
                        onChange={(e) => {
                          const updated = [...skills];
                          updated[idx].proficiency_level = e.target.value;
                          setSkills(updated);
                        }}
                        className="text-xs bg-navy-900 text-violet-300 border border-white/20 rounded-lg px-2 py-1"
                      >
                        {proficiencyLevels.map((lvl) => (
                          <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeSkill(idx)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Career Goals */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Target Career Role
                </label>
                <select
                  value={formData.targetCareer}
                  onChange={(e) => setFormData({ ...formData, targetCareer: e.target.value })}
                  className="input-field bg-navy-900 font-medium"
                >
                  {careerOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Preferred Learning Style
                </label>
                <select
                  value={formData.preferredLearningStyle}
                  onChange={(e) => setFormData({ ...formData, preferredLearningStyle: e.target.value })}
                  className="input-field bg-navy-900"
                >
                  <option value="Project-based / Hands-on">Project-based / Hands-on</option>
                  <option value="Video Lectures & Tutorials">Video Lectures & Tutorials</option>
                  <option value="Deep Documentation & Reading">Deep Documentation & Reading</option>
                  <option value="Interactive Coding Challenges">Interactive Coding Challenges</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Available Learning Hours / Week
                  </label>
                  <span className="text-sm font-bold text-violet-400">{formData.hoursPerWeek} hrs</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={formData.hoursPerWeek}
                  onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                  className="w-full accent-violet-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>5h (Casual)</span>
                  <span>20h (Focused)</span>
                  <span>40h (Bootcamp)</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleFinish}
                className="btn-primary flex items-center gap-2 text-sm shadow-lg shadow-violet-600/30"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Generate My Roadmap</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
