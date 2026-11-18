import { callGroqJSON } from '../services/groqService.js';
import { CAREER_ROLES } from '../data/seedData.js';

export const analyzeCareerGap = async (params = {}) => {
  const targetCareerObj = typeof params.targetCareer === 'object' ? params.targetCareer : null;
  const careerRole = params.careerRole || targetCareerObj?.title || (typeof params.targetCareer === 'string' ? params.targetCareer : 'Full Stack Developer');
  
  // Find seed career requirements if not explicitly passed
  const seedRole = CAREER_ROLES.find(c => c.title.toLowerCase() === careerRole.toLowerCase() || c.id === careerRole);
  const careerRoleSkills = params.careerRoleSkills || targetCareerObj?.skills || seedRole?.skills || [
    { skill_name: 'JavaScript', required_proficiency: 'Advanced' },
    { skill_name: 'React', required_proficiency: 'Advanced' },
    { skill_name: 'Node.js', required_proficiency: 'Intermediate' },
    { skill_name: 'SQL', required_proficiency: 'Intermediate' }
  ];

  const analyzedSkills = params.analyzedSkills || params.userSkills || [];
  const userProfile = params.userProfile || {};

  const systemPrompt = `You are the Career Intelligence Agent for MentorSkill.
You compare a learner's skills against career requirements to identify gaps and calculate readiness.

Career readiness formula: 
- For each required skill: if learner has it at required proficiency = 1 point, lower proficiency = 0.5 points, missing = 0 points
- Score = (total points / total required skills) * 100

Return this exact JSON:
{
  "matchedSkills": [{"skillName": "string", "userProficiency": "string", "requiredProficiency": "string", "gap": "none|partial|none"}],
  "missingSkills": [{"skillName": "string", "requiredProficiency": "string", "priority": "critical|high|medium|low", "reason": "string"}],
  "weakSkills": [{"skillName": "string", "userProficiency": "string", "requiredProficiency": "string", "priority": "high|medium|low"}],
  "careerReadiness": number,
  "readinessLevel": "Beginner|Developing|Intermediate|Advanced|Ready",
  "prioritizedGaps": ["skill1", "skill2"],
  "explanation": "string",
  "estimatedTimeToReady": "string"
}`;

  const userMessage = `Career: ${careerRole}
Required Skills: ${JSON.stringify(careerRoleSkills)}
Learner Skills: ${JSON.stringify(analyzedSkills)}
Profile: ${JSON.stringify(userProfile)}`;

  try {
    const res = await callGroqJSON(systemPrompt, userMessage);
    if (typeof res.careerReadiness === 'number' && Array.isArray(res.missingSkills)) {
      return res;
    }
  } catch (err) {}

  // Deterministic calculation fallback adhering directly to the required career requirements
  const matched = [];
  const missing = [];
  const weak = [];
  let scorePoints = 0;

  careerRoleSkills.forEach(req => {
    const sName = req.skill_name || req.skillName || req.name;
    const reqProf = req.required_proficiency || req.proficiency || 'Intermediate';
    const found = analyzedSkills.find(s => (s.skill_name || s.skillName || s.name || '').toLowerCase() === sName.toLowerCase());

    if (found) {
      const userProf = found.proficiency_level || found.proficiencyLevel || 'Beginner';
      const profRanks = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
      const userRank = profRanks[userProf] || 1;
      const reqRank = profRanks[reqProf] || 2;

      if (userRank >= reqRank) {
        scorePoints += 1.0;
        matched.push({ skillName: sName, userProficiency: userProf, requiredProficiency: reqProf, gap: 'none' });
      } else {
        scorePoints += 0.5;
        weak.push({ skillName: sName, userProficiency: userProf, requiredProficiency: reqProf, priority: 'high' });
      }
    } else {
      missing.push({
        skillName: sName,
        requiredProficiency: reqProf,
        priority: req.priority || 'high',
        reason: `Fundamental requirement for ${careerRole} role.`
      });
    }
  });

  const totalReq = careerRoleSkills.length || 1;
  const careerReadiness = Math.round((scorePoints / totalReq) * 100);

  return {
    matchedSkills: matched,
    missingSkills: missing,
    weakSkills: weak,
    careerReadiness,
    readinessLevel: careerReadiness >= 80 ? 'Ready' : careerReadiness >= 60 ? 'Advanced' : careerReadiness >= 40 ? 'Intermediate' : 'Developing',
    prioritizedGaps: missing.map(m => m.skillName),
    explanation: `Learner possesses ${matched.length} verified competencies and has ${missing.length} missing skill areas for ${careerRole}.`,
    estimatedTimeToReady: careerReadiness >= 75 ? '3-6 weeks' : '8-14 weeks'
  };
};
