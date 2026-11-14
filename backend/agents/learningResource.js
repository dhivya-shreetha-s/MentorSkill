import { callGroqJSON } from '../services/groqService.js';

// Known real resource URLs - never fabricate these
const KNOWN_RESOURCES = {
  'JavaScript': [
    { title: 'JavaScript - MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', provider: 'MDN', type: 'documentation' },
    { title: 'JavaScript Algorithms and Data Structures', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', provider: 'freeCodeCamp', type: 'course' },
    { title: 'The Modern JavaScript Tutorial', url: 'https://javascript.info', provider: 'javascript.info', type: 'tutorial' }
  ],
  'React': [
    { title: 'React Official Documentation', url: 'https://react.dev', provider: 'React', type: 'documentation' },
    { title: 'React Tutorial for Beginners', url: 'https://react.dev/learn', provider: 'React', type: 'tutorial' },
    { title: 'Front End Development Libraries', url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/', provider: 'freeCodeCamp', type: 'course' }
  ],
  'Node.js': [
    { title: 'Node.js Official Docs', url: 'https://nodejs.org/en/docs', provider: 'Node.js', type: 'documentation' },
    { title: 'Node.js and Express.js', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', provider: 'freeCodeCamp', type: 'course' }
  ],
  'Python': [
    { title: 'Python Official Documentation', url: 'https://docs.python.org/3/', provider: 'Python', type: 'documentation' },
    { title: 'Python for Everybody', url: 'https://www.coursera.org/specializations/python', provider: 'Coursera', type: 'course' },
    { title: 'Python Tutorial - W3Schools', url: 'https://www.w3schools.com/python/', provider: 'W3Schools', type: 'tutorial' }
  ],
  'SQL': [
    { title: 'SQL Tutorial - W3Schools', url: 'https://www.w3schools.com/sql/', provider: 'W3Schools', type: 'tutorial' },
    { title: 'Relational Database Certification', url: 'https://www.freecodecamp.org/learn/relational-database/', provider: 'freeCodeCamp', type: 'course' }
  ],
  'HTML': [
    { title: 'HTML - MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', provider: 'MDN', type: 'documentation' },
    { title: 'Responsive Web Design', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', provider: 'freeCodeCamp', type: 'course' }
  ],
  'CSS': [
    { title: 'CSS - MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS', provider: 'MDN', type: 'documentation' },
    { title: 'CSS Tutorial - W3Schools', url: 'https://www.w3schools.com/css/', provider: 'W3Schools', type: 'tutorial' }
  ],
  'Git': [
    { title: 'Git Official Documentation', url: 'https://git-scm.com/doc', provider: 'Git', type: 'documentation' },
    { title: 'GitHub Learning Lab', url: 'https://github.com/skills', provider: 'GitHub', type: 'tutorial' }
  ],
  'Machine Learning': [
    { title: 'Machine Learning - Coursera (Andrew Ng)', url: 'https://www.coursera.org/specializations/machine-learning-introduction', provider: 'Coursera', type: 'course' },
    { title: 'Scikit-learn Documentation', url: 'https://scikit-learn.org/stable/', provider: 'scikit-learn', type: 'documentation' }
  ]
};

export const recommendResources = async ({ missingSkills, userProfile }) => {
  const resources = [];

  for (const skill of missingSkills) {
    const skillName = skill.skillName || skill;
    // Find exact or partial match in known resources
    const matchKey = Object.keys(KNOWN_RESOURCES).find(k =>
      skillName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(skillName.toLowerCase())
    );

    if (matchKey && KNOWN_RESOURCES[matchKey]) {
      KNOWN_RESOURCES[matchKey].forEach(r => {
        resources.push({
          skillName,
          ...r,
          difficulty: skill.requiredProficiency || 'Beginner',
          whyRelevant: `Essential for ${userProfile.target_career || 'your career goal'}`
        });
      });
    }
  }

  return { resources, totalResources: resources.length };
};
