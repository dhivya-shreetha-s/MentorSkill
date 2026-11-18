import { getSupabaseClientWithToken, withTimeout } from '../services/supabaseService.js';
import { memoryStore } from '../utils/memoryStore.js';

export const getDefaultRoadmap = (userId = 'demo-user-1', careerRole = 'Full Stack Developer') => {
  return {
    id: `rm-default-${userId}`,
    user_id: userId,
    career_role: careerRole,
    version: 1,
    status: 'active',
    total_milestones: 4,
    completed_milestones: 1,
    progress_percentage: 25,
    career_readiness_score: 45.0,
    ai_summary: `Structured engineering path designed for ${careerRole} mastery.`,
    stages: [
      {
        stageName: 'Stage 1: Core Fundamentals',
        milestones: [
          {
            id: 'ms-core-1',
            skillName: 'JavaScript & Web Fundamentals',
            title: 'Modern ES6+ & Asynchronous Architecture',
            description: 'Master async/await, closures, promises, and the browser event loop.',
            estimatedHours: 15,
            status: 'completed',
            priority: 'critical'
          }
        ]
      },
      {
        stageName: 'Stage 2: Frontend Architecture',
        milestones: [
          {
            id: 'ms-core-2',
            skillName: 'React & Component Architecture',
            title: 'Functional Components, Hooks & State Modeling',
            description: 'Build responsive UIs using custom hooks, Context API, and Virtual DOM diffing.',
            estimatedHours: 20,
            status: 'in_progress',
            priority: 'critical'
          }
        ]
      },
      {
        stageName: 'Stage 3: Backend & APIs',
        milestones: [
          {
            id: 'ms-core-3',
            skillName: 'Node.js & Express REST APIs',
            title: 'Server-Side Architecture, Routing & Middleware',
            description: 'Design robust microservices with authentication, validation, and error handling.',
            estimatedHours: 25,
            status: 'available',
            priority: 'high'
          }
        ]
      },
      {
        stageName: 'Stage 4: Database & Production',
        milestones: [
          {
            id: 'ms-core-4',
            skillName: 'PostgreSQL & Cloud Deployment',
            title: 'Relational Modeling, Indexing & Production CI/CD',
            description: 'Schema design, transaction management, and automated cloud deployments.',
            estimatedHours: 30,
            status: 'locked',
            priority: 'high'
          }
        ]
      }
    ],
    milestones: [
      {
        id: 'ms-core-1',
        skill_name: 'JavaScript & Web Fundamentals',
        title: 'Modern ES6+ & Asynchronous Architecture',
        description: 'Master async/await, closures, promises, and the browser event loop.',
        estimated_hours: 15,
        status: 'completed',
        priority: 'critical'
      },
      {
        id: 'ms-core-2',
        skill_name: 'React & Component Architecture',
        title: 'Functional Components, Hooks & State Modeling',
        description: 'Build responsive UIs using custom hooks, Context API, and Virtual DOM diffing.',
        estimated_hours: 20,
        status: 'in_progress',
        priority: 'critical'
      },
      {
        id: 'ms-core-3',
        skill_name: 'Node.js & Express REST APIs',
        title: 'Server-Side Architecture, Routing & Middleware',
        description: 'Design robust microservices with authentication, validation, and error handling.',
        estimated_hours: 25,
        status: 'available',
        priority: 'high'
      },
      {
        id: 'ms-core-4',
        skill_name: 'PostgreSQL & Cloud Deployment',
        title: 'Relational Modeling, Indexing & Production CI/CD',
        description: 'Schema design, transaction management, and automated cloud deployments.',
        estimated_hours: 30,
        status: 'locked',
        priority: 'high'
      }
    ]
  };
};

export const getRoadmap = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';

    const supabase = getSupabaseClientWithToken(req.token);
    if (supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('roadmaps').select('*, roadmap_milestones(*)')
            .eq('user_id', userId).eq('status', 'active')
            .order('created_at', { ascending: false }).limit(1),
          2000
        );

        if (!error && data?.length > 0) {
          const roadmap = data[0];
          roadmap.roadmap_milestones?.sort((a, b) => a.order_index - b.order_index);
          return res.json({ roadmap });
        }
      } catch (e) {}
    }

    const roadmap = memoryStore.roadmaps[userId] || getDefaultRoadmap(userId);
    res.json({ roadmap });
  } catch (err) {
    const userId = req.user?.id || 'demo-user-1';
    res.json({ roadmap: memoryStore.roadmaps[userId] || getDefaultRoadmap(userId) });
  }
};

export const updateMilestoneStatus = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const { milestoneId } = req.params;
    const { status } = req.body;

    const supabase = getSupabaseClientWithToken(req.token);
    if (supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase.from('roadmap_milestones').update({ status }).eq('id', milestoneId).select().single(),
          2000
        );
        if (!error && data) {
          return res.json({ milestone: data });
        }
      } catch (e) {}
    }

    // Update in memoryStore
    const roadmap = memoryStore.roadmaps[userId] || getDefaultRoadmap(userId);
    if (roadmap && roadmap.milestones) {
      const ms = roadmap.milestones.find(m => m.id === milestoneId);
      if (ms) {
        ms.status = status;
        const completed = roadmap.milestones.filter(m => m.status === 'completed').length;
        const total = roadmap.milestones.length;
        roadmap.completed_milestones = completed;
        roadmap.progress_percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return res.json({ milestone: ms, roadmap });
      }
    }

    res.json({ success: true, milestoneId, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRoadmapHistory = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const history = memoryStore.roadmapHistory[userId] || [];
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
