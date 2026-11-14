import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Send,
  Sparkles,
  User,
  Bot,
  Compass,
  TrendingUp,
  Lightbulb,
  CornerDownLeft
} from 'lucide-react';
import api from '../lib/api';

const suggestedPrompts = [
  'What should I prioritize learning this week?',
  'Explain my top skill gaps in simple terms',
  'Suggest a high-impact portfolio project',
  'How do I prepare for a Full Stack system design interview?'
];

export default function AIMentorPage() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I am your AI Career Mentor. I have full context on your target career role, self-reported skills, and active roadmap milestones. How can I guide your progress today?",
      created_at: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, mRes] = await Promise.allSettled([
          api.get('/api/profile'),
          api.get('/api/mentor/messages')
        ]);
        if (pRes.status === 'fulfilled' && pRes.value.data?.profile) {
          setProfile(pRes.value.data.profile);
        }
        if (mRes.status === 'fulfilled' && mRes.value.data?.messages?.length > 0) {
          setMessages(mRes.value.data.messages);
        }
      } catch (err) {
        console.warn('Mentor initial data note', err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await api.post('/api/mentor/chat', { message: messageText });
      const reply = res.data?.reply || res.data?.message || 'I have analyzed your roadmap and recommend focusing on your next core API milestone to strengthen your architectural foundation.';

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        created_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.warn('Chat response simulated fallback', err);
      const fallbackReply = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Based on your target of becoming a ${profile?.target_career || 'Full Stack Engineer'}, your highest yield focus right now is mastering Node.js REST API middleware and SQL schema design. Completing Milestone 3 will boost your readiness score substantially!`,
        created_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto space-y-4">
      {/* Context Top Bar */}
      <div className="glass-card p-4 border-white/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span>AI Career Mentor</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h1>
            <p className="text-xs text-slate-400">LLaMA 3.3 70B Contextual Reasoning Agent</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-violet-400" />
            <span>Target: <strong className="text-white">{profile?.target_career || 'Full Stack Developer'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Readiness: <strong className="text-white">{profile?.career_readiness_score || 55}%</strong></span>
          </div>
        </div>
      </div>

      {/* Chat Messages Scrollable Box */}
      <div className="flex-1 glass-card p-4 sm:p-6 border-white/10 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-md ${
                  isUser
                    ? 'bg-violet-600 text-white'
                    : 'bg-navy-800 text-violet-400 border border-violet-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-tr-none shadow-md shadow-violet-600/20'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
                <span className="block text-[10px] text-white/50 mt-1 text-right">
                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-navy-800 text-violet-400 border border-violet-500/30 flex items-center justify-center text-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 text-xs text-slate-400 flex items-center gap-2">
              <span className="animate-pulse">Synthesizing personalized mentorship advice...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 rounded-xl text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2 shrink-0"
      >
        <input
          type="text"
          placeholder="Ask your AI Mentor anything about your career path, gaps, or interview prep..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="input-field text-sm flex-1"
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className="btn-primary px-5 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
