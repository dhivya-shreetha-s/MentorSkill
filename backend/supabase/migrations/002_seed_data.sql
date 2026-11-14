-- ============================================================
-- 002_seed_data.sql  –  MentorSkill seed data
-- All inserts are wrapped in DO blocks to handle conflicts
-- ============================================================

-- ----------------------------------------------------------------
-- 1. CAREER ROLES
-- ----------------------------------------------------------------
DO $$
BEGIN
  INSERT INTO public.career_roles (title, description, level, avg_salary, demand, suggested_projects)
  VALUES
    (
      'Full Stack Developer',
      'Builds both client-side and server-side of web applications. Proficient in front-end frameworks and back-end services.',
      'Mid',
      '$90,000 – $140,000',
      'High',
      ARRAY['E-commerce platform','Social media clone','Real-time chat app','Portfolio website with CMS']
    ),
    (
      'Frontend Developer',
      'Specialises in creating responsive, accessible user interfaces using modern JavaScript frameworks.',
      'Mid',
      '$80,000 – $130,000',
      'High',
      ARRAY['Interactive dashboard','Design-system component library','Progressive Web App','Browser extension']
    ),
    (
      'Backend Developer',
      'Designs and maintains server-side logic, databases, APIs, and system integrations.',
      'Mid',
      '$90,000 – $145,000',
      'High',
      ARRAY['RESTful API service','Microservices architecture','Authentication system','Real-time notification service']
    ),
    (
      'Data Scientist',
      'Analyses large datasets, builds predictive models, and derives actionable business insights.',
      'Mid',
      '$100,000 – $160,000',
      'Very High',
      ARRAY['Predictive churn model','NLP sentiment analyser','Recommendation engine','Time-series forecasting']
    ),
    (
      'Data Analyst',
      'Collects, processes, and performs statistical analysis on data to help organisations make decisions.',
      'Entry',
      '$65,000 – $110,000',
      'High',
      ARRAY['Sales dashboard','Customer segmentation report','A/B test analysis','KPI tracking system']
    ),
    (
      'AI/ML Engineer',
      'Designs, builds, and deploys machine-learning models and AI pipelines at production scale.',
      'Senior',
      '$130,000 – $200,000',
      'Very High',
      ARRAY['Image classification API','LLM fine-tuning pipeline','MLOps platform','Autonomous agent framework']
    ),
    (
      'Python Developer',
      'Develops applications, automation scripts, and back-end services primarily using Python.',
      'Mid',
      '$85,000 – $135,000',
      'High',
      ARRAY['Web scraper','CLI tool','Task automation pipeline','REST API with FastAPI']
    ),
    (
      'Cloud Engineer',
      'Designs, implements, and manages cloud infrastructure on AWS, GCP, or Azure.',
      'Mid',
      '$110,000 – $170,000',
      'Very High',
      ARRAY['Serverless data pipeline','CI/CD infrastructure','Multi-region Kubernetes cluster','Cost-optimisation dashboard']
    )
  ON CONFLICT (title) DO NOTHING;
END $$;

-- ----------------------------------------------------------------
-- 2. CAREER ROLE SKILLS
-- ----------------------------------------------------------------
DO $$
DECLARE
  v_role_id UUID;
BEGIN

  -- Full Stack Developer
  SELECT id INTO v_role_id FROM public.career_roles WHERE title = 'Full Stack Developer';
  INSERT INTO public.career_role_skills (career_role_id, skill_name, required_proficiency, priority, is_prerequisite)
  VALUES
    (v_role_id, 'HTML/CSS',         'Advanced',      'required',    TRUE),
    (v_role_id, 'JavaScript',       'Advanced',      'required',    TRUE),
    (v_role_id, 'React',            'Intermediate',  'required',    FALSE),
    (v_role_id, 'Node.js',          'Intermediate',  'required',    FALSE),
    (v_role_id, 'SQL',              'Intermediate',  'required',    FALSE),
    (v_role_id, 'REST APIs',        'Intermediate',  'required',    FALSE),
    (v_role_id, 'Git',              'Intermediate',  'required',    TRUE),
    (v_role_id, 'TypeScript',       'Intermediate',  'recommended', FALSE),
    (v_role_id, 'Docker',           'Beginner',      'recommended', FALSE),
    (v_role_id, 'Testing',          'Intermediate',  'recommended', FALSE)
  ON CONFLICT DO NOTHING;

  -- Frontend Developer
  SELECT id INTO v_role_id FROM public.career_roles WHERE title = 'Frontend Developer';
  INSERT INTO public.career_role_skills (career_role_id, skill_name, required_proficiency, priority, is_prerequisite)
  VALUES
    (v_role_id, 'HTML/CSS',           'Expert',        'required',    TRUE),
    (v_role_id, 'JavaScript',         'Advanced',      'required',    TRUE),
    (v_role_id, 'React',              'Advanced',      'required',    FALSE),
    (v_role_id, 'TypeScript',         'Intermediate',  'required',    FALSE),
    (v_role_id, 'CSS Frameworks',     'Intermediate',  'required',    FALSE),
    (v_role_id, 'Responsive Design',  'Advanced',      'required',    FALSE),
    (v_role_id, 'Web Accessibility',  'Intermediate',  'recommended', FALSE),
    (v_role_id, 'Performance Opt.',   'Intermediate',  'recommended', FALSE),
    (v_role_id, 'Testing',            'Intermediate',  'recommended', FALSE),
    (v_role_id, 'Webpack/Vite',       'Beginner',      'optional',    FALSE)
  ON CONFLICT DO NOTHING;

  -- Backend Developer
  SELECT id INTO v_role_id FROM public.career_roles WHERE title = 'Backend Developer';
  INSERT INTO public.career_role_skills (career_role_id, skill_name, required_proficiency, priority, is_prerequisite)
  VALUES
    (v_role_id, 'Node.js',           'Advanced',      'required',    TRUE),
    (v_role_id, 'SQL',               'Advanced',      'required',    TRUE),
    (v_role_id, 'REST APIs',         'Advanced',      'required',    FALSE),
    (v_role_id, 'Authentication',    'Advanced',      'required',    FALSE),
    (v_role_id, 'Data Structures',   'Advanced',      'required',    FALSE),
    (v_role_id, 'Git',               'Intermediate',  'required',    TRUE),
    (v_role_id, 'Docker',            'Intermediate',  'required',    FALSE),
    (v_role_id, 'NoSQL',             'Intermediate',  'recommended', FALSE),
    (v_role_id, 'Message Queues',    'Intermediate',  'recommended', FALSE),
    (v_role_id, 'Testing',           'Intermediate',  'recommended', FALSE)
  ON CONFLICT DO NOTHING;

  -- Data Scientist
  SELECT id INTO v_role_id FROM public.career_roles WHERE title = 'Data Scientist';
  INSERT INTO public.career_role_skills (career_role_id, skill_name, required_proficiency, priority, is_prerequisite)
  VALUES
    (v_role_id, 'Python',            'Advanced',      'required',    TRUE),
    (v_role_id, 'SQL',               'Intermediate',  'required',    TRUE),
    (v_role_id, 'Machine Learning',  'Advanced',      'required',    FALSE),
    (v_role_id, 'Statistics',        'Advanced',      'required',    FALSE),
    (v_role_id, 'Data Visualisation','Intermediate',  'required',    FALSE),
    (v_role_id, 'Pandas/NumPy',      'Advanced',      'required',    FALSE),
    (v_role_id, 'Deep Learning',     'Intermediate',  'recommended', FALSE),
    (v_role_id, 'Feature Engineering','Intermediate', 'recommended', FALSE),
    (v_role_id, 'Scikit-learn',      'Advanced',      'required',    FALSE),
    (v_role_id, 'Communication',     'Intermediate',  'recommended', FALSE)
  ON CONFLICT DO NOTHING;

  -- Data Analyst
  SELECT id INTO v_role_id FROM public.career_roles WHERE title = 'Data Analyst';
  INSERT INTO public.career_role_skills (career_role_id, skill_name, required_proficiency, priority, is_prerequisite)
  VALUES
    (v_role_id, 'SQL',               'Advanced',      'required',    TRUE),
    (v_role_id, 'Excel/Sheets',      'Advanced',      'required',    TRUE),
    (v_role_id, 'Data Visualisation','Advanced',      'required',    FALSE),
    (v_role_id, 'Python',            'Intermediate',  'required',    FALSE),
    (v_role_id, 'Statistics',        'Intermediate',  'required',    FALSE),
    (v_role_id, 'Business Acumen',   'Intermediate',  'required',    FALSE),
    (v_role_id, 'Tableau/Power BI',  'Intermediate',  'required',    FALSE),
    (v_role_id, 'ETL',               'Beginner',      'recommended', FALSE),
    (v_role_id, 'Communication',     'Advanced',      'required',    FALSE),
    (v_role_id, 'Pandas/NumPy',      'Intermediate',  'recommended', FALSE)
  ON CONFLICT DO NOTHING;

  -- AI/ML Engineer
  SELECT id INTO v_role_id FROM public.career_roles WHERE title = 'AI/ML Engineer';
  INSERT INTO public.career_role_skills (career_role_id, skill_name, required_proficiency, priority, is_prerequisite)
  VALUES
    (v_role_id, 'Python',            'Expert',        'required',    TRUE),
    (v_role_id, 'Machine Learning',  'Expert',        'required',    FALSE),
    (v_role_id, 'Deep Learning',     'Advanced',      'required',    FALSE),
    (v_role_id, 'PyTorch/TensorFlow','Advanced',      'required',    FALSE),
    (v_role_id, 'MLOps',             'Intermediate',  'required',    FALSE),
    (v_role_id, 'Data Structures',   'Advanced',      'required',    FALSE),
    (v_role_id, 'Docker',            'Intermediate',  'required',    FALSE),
    (v_role_id, 'Cloud Platforms',   'Intermediate',  'required',    FALSE),
    (v_role_id, 'REST APIs',         'Intermediate',  'recommended', FALSE),
    (v_role_id, 'Statistics',        'Advanced',      'required',    FALSE)
  ON CONFLICT DO NOTHING;

  -- Python Developer
  SELECT id INTO v_role_id FROM public.career_roles WHERE title = 'Python Developer';
  INSERT INTO public.career_role_skills (career_role_id, skill_name, required_proficiency, priority, is_prerequisite)
  VALUES
    (v_role_id, 'Python',            'Expert',        'required',    TRUE),
    (v_role_id, 'REST APIs',         'Advanced',      'required',    FALSE),
    (v_role_id, 'SQL',               'Intermediate',  'required',    FALSE),
    (v_role_id, 'OOP',               'Advanced',      'required',    FALSE),
    (v_role_id, 'Git',               'Intermediate',  'required',    TRUE),
    (v_role_id, 'Testing',           'Intermediate',  'required',    FALSE),
    (v_role_id, 'Data Structures',   'Advanced',      'required',    FALSE),
    (v_role_id, 'Async Programming', 'Intermediate',  'recommended', FALSE),
    (v_role_id, 'Docker',            'Beginner',      'recommended', FALSE),
    (v_role_id, 'FastAPI/Django',    'Intermediate',  'required',    FALSE)
  ON CONFLICT DO NOTHING;

  -- Cloud Engineer
  SELECT id INTO v_role_id FROM public.career_roles WHERE title = 'Cloud Engineer';
  INSERT INTO public.career_role_skills (career_role_id, skill_name, required_proficiency, priority, is_prerequisite)
  VALUES
    (v_role_id, 'Cloud Platforms',   'Advanced',      'required',    TRUE),
    (v_role_id, 'Docker',            'Advanced',      'required',    FALSE),
    (v_role_id, 'Kubernetes',        'Intermediate',  'required',    FALSE),
    (v_role_id, 'Terraform/IaC',     'Intermediate',  'required',    FALSE),
    (v_role_id, 'CI/CD',             'Advanced',      'required',    FALSE),
    (v_role_id, 'Networking',        'Advanced',      'required',    FALSE),
    (v_role_id, 'Linux',             'Advanced',      'required',    TRUE),
    (v_role_id, 'Security',          'Intermediate',  'required',    FALSE),
    (v_role_id, 'Python',            'Intermediate',  'recommended', FALSE),
    (v_role_id, 'Monitoring',        'Intermediate',  'recommended', FALSE)
  ON CONFLICT DO NOTHING;

END $$;

-- ----------------------------------------------------------------
-- 3. ASSESSMENTS
-- ----------------------------------------------------------------
DO $$
BEGIN
  INSERT INTO public.assessments (title, topic, difficulty, time_limit_minutes, passing_score)
  VALUES
    ('Python Fundamentals',          'Python',           'Beginner',     20, 70),
    ('JavaScript Essentials',        'JavaScript',       'Beginner',     20, 70),
    ('HTML & CSS Mastery',           'HTML/CSS',         'Beginner',     15, 70),
    ('React Core Concepts',          'React',            'Intermediate', 25, 70),
    ('SQL Querying',                 'SQL',              'Intermediate', 20, 70),
    ('Node.js Backend Dev',          'Node.js',          'Intermediate', 25, 70),
    ('Data Structures & Algorithms', 'Data Structures',  'Advanced',     30, 70),
    ('Machine Learning Basics',      'Machine Learning', 'Advanced',     30, 70)
  ON CONFLICT DO NOTHING;
END $$;

-- ----------------------------------------------------------------
-- 4. ASSESSMENT QUESTIONS
-- ----------------------------------------------------------------

-- 4a. Python
DO $$
DECLARE v_id UUID;
BEGIN
  SELECT id INTO v_id FROM public.assessments WHERE topic = 'Python';
  INSERT INTO public.assessment_questions
    (assessment_id, topic, question_text, options, correct_answer, explanation, difficulty, points)
  VALUES
    (v_id,'Python','What is the output of print(type([]))?',
     '["<class ''list''>","<class ''tuple''>","<class ''dict''>","<class ''set''>"]',
     '<class ''list''>',
     'The [] literal creates a list object.',
     'Beginner',1),
    (v_id,'Python','Which keyword is used to define a function in Python?',
     '["def","fun","function","define"]',
     'def',
     'Python uses the def keyword to define functions.',
     'Beginner',1),
    (v_id,'Python','What does the len() function return for the string "hello"?',
     '["5","4","6","None"]',
     '5',
     'len() returns the number of characters; "hello" has 5.',
     'Beginner',1),
    (v_id,'Python','Which of the following creates a tuple?',
     '["(1,2,3)","[1,2,3]","{1,2,3}","<1,2,3>"]',
     '(1,2,3)',
     'Parentheses with comma-separated values create a tuple.',
     'Beginner',1),
    (v_id,'Python','What is the result of 10 // 3 in Python?',
     '["3","3.33","4","1"]',
     '3',
     '// is floor division, discarding the remainder.',
     'Intermediate',1),
    (v_id,'Python','Which method removes and returns the last element from a list?',
     '["pop()","remove()","del()","discard()"]',
     'pop()',
     'list.pop() removes and returns the last element by default.',
     'Intermediate',1),
    (v_id,'Python','What is a lambda function?',
     '["An anonymous function","A recursive function","A built-in function","A decorator"]',
     'An anonymous function',
     'Lambda creates small anonymous functions using a single expression.',
     'Intermediate',1),
    (v_id,'Python','What does *args allow in a function definition?',
     '["Variable positional arguments","Variable keyword arguments","A single argument","No arguments"]',
     'Variable positional arguments',
     '*args collects extra positional arguments into a tuple.',
     'Intermediate',1),
    (v_id,'Python','Which of the following is a generator expression?',
     '["(x*2 for x in range(5))","[x*2 for x in range(5)]","{x*2 for x in range(5)}","None of these"]',
     '(x*2 for x in range(5))',
     'Generator expressions use () and are lazy.',
     'Advanced',1),
    (v_id,'Python','What is the Global Interpreter Lock (GIL)?',
     '["A mutex that protects Python objects","A memory allocator","A garbage collector","A type system"]',
     'A mutex that protects Python objects',
     'The GIL prevents multiple native threads from executing Python bytecodes simultaneously.',
     'Advanced',1)
  ON CONFLICT DO NOTHING;
END $$;

-- 4b. JavaScript
DO $$
DECLARE v_id UUID;
BEGIN
  SELECT id INTO v_id FROM public.assessments WHERE topic = 'JavaScript';
  INSERT INTO public.assessment_questions
    (assessment_id, topic, question_text, options, correct_answer, explanation, difficulty, points)
  VALUES
    (v_id,'JavaScript','Which keyword declares a block-scoped variable?',
     '["let","var","global","block"]',
     'let',
     'let and const are block-scoped; var is function-scoped.',
     'Beginner',1),
    (v_id,'JavaScript','What does === check?',
     '["Value and type","Only value","Only type","Reference equality"]',
     'Value and type',
     'Strict equality (===) checks both value and type without coercion.',
     'Beginner',1),
    (v_id,'JavaScript','Which method adds an element to the END of an array?',
     '["push()","pop()","shift()","unshift()"]',
     'push()',
     'Array.push() appends one or more elements and returns the new length.',
     'Beginner',1),
    (v_id,'JavaScript','What is the output of typeof null?',
     '["object","null","undefined","string"]',
     'object',
     'typeof null === "object" is a known JavaScript quirk.',
     'Beginner',1),
    (v_id,'JavaScript','What is a closure?',
     '["A function that retains access to its outer scope","A function without arguments","An arrow function","An IIFE"]',
     'A function that retains access to its outer scope',
     'Closures allow inner functions to access variables from their enclosing scope.',
     'Intermediate',1),
    (v_id,'JavaScript','What does Promise.all() do?',
     '["Runs promises in parallel, resolves when all resolve","Runs promises sequentially","Returns the first resolved promise","Ignores rejections"]',
     'Runs promises in parallel, resolves when all resolve',
     'Promise.all rejects immediately if any promise rejects.',
     'Intermediate',1),
    (v_id,'JavaScript','Which array method returns a NEW array with transformed elements?',
     '["map()","forEach()","filter()","reduce()"]',
     'map()',
     'map() creates a new array with the results of calling a function on every element.',
     'Intermediate',1),
    (v_id,'JavaScript','What is event delegation?',
     '["Attaching one listener to a parent to handle child events","Removing event listeners","Preventing default events","Using async events"]',
     'Attaching one listener to a parent to handle child events',
     'Event delegation leverages event bubbling for efficiency.',
     'Intermediate',1),
    (v_id,'JavaScript','What is the prototype chain?',
     '["Mechanism for property lookup through object prototypes","An array of functions","A CSS selector chain","A promise chain"]',
     'Mechanism for property lookup through object prototypes',
     'JS objects have a [[Prototype]] link; lookups traverse the chain.',
     'Advanced',1),
    (v_id,'JavaScript','What does the async keyword do to a function?',
     '["Makes it return a Promise","Makes it synchronous","Prevents it from blocking","Both A and C"]',
     'Both A and C',
     'async functions always return a Promise and enable await inside.',
     'Advanced',1)
  ON CONFLICT DO NOTHING;
END $$;

-- 4c. HTML/CSS
DO $$
DECLARE v_id UUID;
BEGIN
  SELECT id INTO v_id FROM public.assessments WHERE topic = 'HTML/CSS';
  INSERT INTO public.assessment_questions
    (assessment_id, topic, question_text, options, correct_answer, explanation, difficulty, points)
  VALUES
    (v_id,'HTML/CSS','Which HTML tag defines the root of an HTML document?',
     '["<html>","<head>","<body>","<root>"]',
     '<html>',
     'The <html> element is the top-level element of an HTML page.',
     'Beginner',1),
    (v_id,'HTML/CSS','What does CSS stand for?',
     '["Cascading Style Sheets","Computer Style System","Creative Style System","Cascading Simple Sheets"]',
     'Cascading Style Sheets',
     'CSS controls presentation and layout of HTML elements.',
     'Beginner',1),
    (v_id,'HTML/CSS','Which CSS property changes text colour?',
     '["color","font-color","text-color","foreground"]',
     'color',
     'The color property sets the foreground colour of text.',
     'Beginner',1),
    (v_id,'HTML/CSS','What is the box model?',
     '["Content, padding, border, margin","Content and margin only","Border and padding only","None of these"]',
     'Content, padding, border, margin',
     'Every CSS element is modelled as a box with these four areas.',
     'Beginner',1),
    (v_id,'HTML/CSS','Which display value makes elements sit side by side?',
     '["inline-block","block","none","table"]',
     'inline-block',
     'inline-block allows width/height while remaining in the flow.',
     'Intermediate',1),
    (v_id,'HTML/CSS','What does flexbox justify-content: space-between do?',
     '["Even space between items, none on edges","Even space including edges","Centers all items","Stretches items"]',
     'Even space between items, none on edges',
     'space-between distributes remaining space between flex items.',
     'Intermediate',1),
    (v_id,'HTML/CSS','Which CSS unit is relative to the viewport width?',
     '["vw","em","rem","%"]',
     'vw',
     '1vw equals 1% of the viewport width.',
     'Intermediate',1),
    (v_id,'HTML/CSS','What is the z-index property used for?',
     '["Stacking order of elements","Zoom level","Transparency","Rotation"]',
     'Stacking order of elements',
     'z-index controls the stacking order along the z-axis for positioned elements.',
     'Intermediate',1),
    (v_id,'HTML/CSS','What does @media query do?',
     '["Applies styles based on device characteristics","Imports CSS files","Defines animations","None of these"]',
     'Applies styles based on device characteristics',
     'Media queries enable responsive design.',
     'Advanced',1),
    (v_id,'HTML/CSS','What is the difference between em and rem?',
     '["em is relative to parent; rem is relative to root","Both relative to root","Both relative to parent","em is absolute"]',
     'em is relative to parent; rem is relative to root',
     'rem avoids compounding effects that occur with nested em units.',
     'Advanced',1)
  ON CONFLICT DO NOTHING;
END $$;

-- 4d. React
DO $$
DECLARE v_id UUID;
BEGIN
  SELECT id INTO v_id FROM public.assessments WHERE topic = 'React';
  INSERT INTO public.assessment_questions
    (assessment_id, topic, question_text, options, correct_answer, explanation, difficulty, points)
  VALUES
    (v_id,'React','What hook manages local component state?',
     '["useState","useEffect","useRef","useContext"]',
     'useState',
     'useState returns a state variable and a setter function.',
     'Beginner',1),
    (v_id,'React','What is JSX?',
     '["JavaScript XML syntax extension","A JavaScript framework","A CSS preprocessor","A build tool"]',
     'JavaScript XML syntax extension',
     'JSX lets you write HTML-like syntax within JavaScript.',
     'Beginner',1),
    (v_id,'React','How do you pass data from parent to child?',
     '["Props","State","Context","Refs"]',
     'Props',
     'Props are read-only data passed from parent to child components.',
     'Beginner',1),
    (v_id,'React','What does useEffect do?',
     '["Performs side effects after rendering","Updates state","Creates context","Memoizes values"]',
     'Performs side effects after rendering',
     'useEffect runs after paint and can optionally clean up.',
     'Intermediate',1),
    (v_id,'React','What is the purpose of the key prop in lists?',
     '["Helps React identify changed elements","Styles list items","Sorts items","None of these"]',
     'Helps React identify changed elements',
     'Unique keys allow React to efficiently reconcile list changes.',
     'Intermediate',1),
    (v_id,'React','What does useCallback do?',
     '["Memoizes a function reference","Fetches data","Updates DOM directly","Creates a ref"]',
     'Memoizes a function reference',
     'useCallback prevents unnecessary re-creation of functions on re-renders.',
     'Intermediate',1),
    (v_id,'React','What is the Context API used for?',
     '["Sharing state without prop drilling","Routing","Animation","Server calls"]',
     'Sharing state without prop drilling',
     'Context provides a way to pass data through the tree without manual prop passing.',
     'Intermediate',1),
    (v_id,'React','What is React.memo?',
     '["HOC that memoizes a component","A hook","A router","A state manager"]',
     'HOC that memoizes a component',
     'React.memo skips re-rendering if props have not changed.',
     'Advanced',1),
    (v_id,'React','What is the difference between controlled and uncontrolled components?',
     '["Controlled use React state; uncontrolled use the DOM","Both use React state","Both use DOM","Uncontrolled are slower"]',
     'Controlled use React state; uncontrolled use the DOM',
     'Controlled components bind form values to React state; uncontrolled use refs.',
     'Advanced',1),
    (v_id,'React','What does React.lazy do?',
     '["Enables code-splitting for dynamic imports","Renders lazily after delay","Suspends rendering forever","None of these"]',
     'Enables code-splitting for dynamic imports',
     'React.lazy + Suspense enable on-demand component loading.',
     'Advanced',1)
  ON CONFLICT DO NOTHING;
END $$;

-- 4e. SQL
DO $$
DECLARE v_id UUID;
BEGIN
  SELECT id INTO v_id FROM public.assessments WHERE topic = 'SQL';
  INSERT INTO public.assessment_questions
    (assessment_id, topic, question_text, options, correct_answer, explanation, difficulty, points)
  VALUES
    (v_id,'SQL','Which SQL clause filters rows?',
     '["WHERE","GROUP BY","ORDER BY","HAVING"]',
     'WHERE',
     'WHERE filters individual rows before aggregation.',
     'Beginner',1),
    (v_id,'SQL','Which statement retrieves data?',
     '["SELECT","INSERT","UPDATE","DELETE"]',
     'SELECT',
     'SELECT is the DML statement for querying data.',
     'Beginner',1),
    (v_id,'SQL','What does PRIMARY KEY enforce?',
     '["Uniqueness and NOT NULL","Only uniqueness","Only NOT NULL","Foreign reference"]',
     'Uniqueness and NOT NULL',
     'A PRIMARY KEY must be unique and cannot contain NULLs.',
     'Beginner',1),
    (v_id,'SQL','What is the difference between INNER JOIN and LEFT JOIN?',
     '["INNER returns matching rows; LEFT returns all left rows","Both return all rows","LEFT returns matching rows only","INNER returns all rows"]',
     'INNER returns matching rows; LEFT returns all left rows',
     'LEFT JOIN includes non-matching rows from the left table as NULLs.',
     'Intermediate',1),
    (v_id,'SQL','Which clause filters aggregated groups?',
     '["HAVING","WHERE","GROUP BY","ORDER BY"]',
     'HAVING',
     'HAVING applies conditions after GROUP BY aggregation.',
     'Intermediate',1),
    (v_id,'SQL','What does COUNT(*) return?',
     '["Total number of rows","Sum of values","Average","Max value"]',
     'Total number of rows',
     'COUNT(*) counts all rows including those with NULLs.',
     'Beginner',1),
    (v_id,'SQL','What is a subquery?',
     '["A query nested inside another query","A stored procedure","An index","A view"]',
     'A query nested inside another query',
     'Subqueries can appear in SELECT, FROM, or WHERE clauses.',
     'Intermediate',1),
    (v_id,'SQL','What does the DISTINCT keyword do?',
     '["Removes duplicate rows","Sorts results","Filters NULLs","Joins tables"]',
     'Removes duplicate rows',
     'SELECT DISTINCT eliminates duplicate values from the result set.',
     'Beginner',1),
    (v_id,'SQL','What is a window function?',
     '["Performs calculation over a set of rows related to current row","A subquery","A type of join","An index type"]',
     'Performs calculation over a set of rows related to current row',
     'Window functions like ROW_NUMBER, RANK, LAG use OVER() clause.',
     'Advanced',1),
    (v_id,'SQL','What does an index do?',
     '["Speeds up data retrieval","Enforces constraints","Joins tables","Encrypts data"]',
     'Speeds up data retrieval',
     'Indexes create lookup structures that reduce full table scans.',
     'Advanced',1)
  ON CONFLICT DO NOTHING;
END $$;

-- 4f. Node.js
DO $$
DECLARE v_id UUID;
BEGIN
  SELECT id INTO v_id FROM public.assessments WHERE topic = 'Node.js';
  INSERT INTO public.assessment_questions
    (assessment_id, topic, question_text, options, correct_answer, explanation, difficulty, points)
  VALUES
    (v_id,'Node.js','Node.js is built on which JavaScript engine?',
     '["V8","SpiderMonkey","JavaScriptCore","Chakra"]',
     'V8',
     'Node.js uses Google''s V8 engine to execute JavaScript server-side.',
     'Beginner',1),
    (v_id,'Node.js','Which module provides file system access?',
     '["fs","http","path","os"]',
     'fs',
     'The built-in fs module provides I/O operations on files.',
     'Beginner',1),
    (v_id,'Node.js','What is the event loop?',
     '["Mechanism to handle async callbacks","A for loop","A recursive function","A thread pool"]',
     'Mechanism to handle async callbacks',
     'The event loop processes the callback queue after the call stack is empty.',
     'Intermediate',1),
    (v_id,'Node.js','Which function creates an HTTP server?',
     '["http.createServer()","http.listen()","server.start()","express()"]',
     'http.createServer()',
     'http.createServer() creates a new HTTP server instance.',
     'Beginner',1),
    (v_id,'Node.js','What does middleware do in Express?',
     '["Processes request/response in a pipeline","Stores data","Renders HTML","Manages DB connections"]',
     'Processes request/response in a pipeline',
     'Middleware functions have access to req, res, and next.',
     'Intermediate',1),
    (v_id,'Node.js','What is npm?',
     '["Node Package Manager","Node Process Manager","Network Protocol Manager","None"]',
     'Node Package Manager',
     'npm is the default package manager and registry for Node.js.',
     'Beginner',1),
    (v_id,'Node.js','What does process.env contain?',
     '["Environment variables","Command-line arguments","Loaded modules","File descriptors"]',
     'Environment variables',
     'process.env provides access to the OS environment variables.',
     'Intermediate',1),
    (v_id,'Node.js','What is the purpose of package.json?',
     '["Project metadata and dependencies","Source code","Test results","Build output"]',
     'Project metadata and dependencies',
     'package.json defines the project, scripts, and dependency versions.',
     'Beginner',1),
    (v_id,'Node.js','What is clustering in Node.js?',
     '["Spawning multiple processes to use all CPU cores","Grouping HTTP requests","A caching strategy","Database sharding"]',
     'Spawning multiple processes to use all CPU cores',
     'The cluster module forks workers sharing the same server port.',
     'Advanced',1),
    (v_id,'Node.js','What are streams in Node.js?',
     '["Objects for reading/writing data continuously","Database connections","Event emitters","None"]',
     'Objects for reading/writing data continuously',
     'Streams handle large data efficiently without loading everything into memory.',
     'Advanced',1)
  ON CONFLICT DO NOTHING;
END $$;

-- 4g. Data Structures
DO $$
DECLARE v_id UUID;
BEGIN
  SELECT id INTO v_id FROM public.assessments WHERE topic = 'Data Structures';
  INSERT INTO public.assessment_questions
    (assessment_id, topic, question_text, options, correct_answer, explanation, difficulty, points)
  VALUES
    (v_id,'Data Structures','What is the time complexity of binary search?',
     '["O(log n)","O(n)","O(n²)","O(1)"]',
     'O(log n)',
     'Binary search halves the search space each step.',
     'Intermediate',1),
    (v_id,'Data Structures','Which data structure follows LIFO?',
     '["Stack","Queue","Deque","Heap"]',
     'Stack',
     'Stack: Last-In, First-Out — push/pop from the same end.',
     'Beginner',1),
    (v_id,'Data Structures','Which data structure follows FIFO?',
     '["Queue","Stack","Tree","Graph"]',
     'Queue',
     'Queue: First-In, First-Out — enqueue at rear, dequeue at front.',
     'Beginner',1),
    (v_id,'Data Structures','What is the worst-case time complexity of quicksort?',
     '["O(n²)","O(n log n)","O(n)","O(log n)"]',
     'O(n²)',
     'Quicksort degrades to O(n²) on already-sorted data with bad pivot choice.',
     'Intermediate',1),
    (v_id,'Data Structures','What is a hash table?',
     '["Key-value store with O(1) average access","A sorted array","A linked list","A tree"]',
     'Key-value store with O(1) average access',
     'Hash tables use a hash function to index into an array of buckets.',
     'Intermediate',1),
    (v_id,'Data Structures','What is a balanced binary search tree?',
     '["BST where left/right subtree heights differ by at most 1","A complete tree","A heap","A trie"]',
     'BST where left/right subtree heights differ by at most 1',
     'AVL and Red-Black trees maintain balance for O(log n) operations.',
     'Advanced',1),
    (v_id,'Data Structures','What algorithm finds the shortest path in an unweighted graph?',
     '["BFS","DFS","Dijkstra","Bellman-Ford"]',
     'BFS',
     'BFS explores level by level, guaranteeing shortest path in unweighted graphs.',
     'Intermediate',1),
    (v_id,'Data Structures','What is dynamic programming?',
     '["Solving problems by breaking into overlapping subproblems","Sorting","Graph traversal","Memory allocation"]',
     'Solving problems by breaking into overlapping subproblems',
     'DP stores solutions to subproblems to avoid redundant computation.',
     'Advanced',1),
    (v_id,'Data Structures','What is the space complexity of mergesort?',
     '["O(n)","O(1)","O(log n)","O(n²)"]',
     'O(n)',
     'Mergesort requires auxiliary space proportional to input size.',
     'Advanced',1),
    (v_id,'Data Structures','What is a trie?',
     '["Prefix tree for string storage","A type of heap","A graph","A hash table"]',
     'Prefix tree for string storage',
     'Tries enable O(m) string lookups where m is the string length.',
     'Advanced',1)
  ON CONFLICT DO NOTHING;
END $$;

-- 4h. Machine Learning
DO $$
DECLARE v_id UUID;
BEGIN
  SELECT id INTO v_id FROM public.assessments WHERE topic = 'Machine Learning';
  INSERT INTO public.assessment_questions
    (assessment_id, topic, question_text, options, correct_answer, explanation, difficulty, points)
  VALUES
    (v_id,'Machine Learning','What is supervised learning?',
     '["Learning from labelled data","Learning without labels","Learning by reward","Clustering"]',
     'Learning from labelled data',
     'In supervised learning the model learns a mapping from inputs to labelled outputs.',
     'Beginner',1),
    (v_id,'Machine Learning','What is overfitting?',
     '["Model performs well on training but poorly on unseen data","Model performs poorly on training","Model is too simple","None"]',
     'Model performs well on training but poorly on unseen data',
     'Overfitting occurs when a model memorises training noise.',
     'Intermediate',1),
    (v_id,'Machine Learning','Which technique reduces overfitting by penalising large weights?',
     '["Regularisation","Normalisation","Augmentation","Dropout"]',
     'Regularisation',
     'L1/L2 regularisation add a penalty term to the loss function.',
     'Intermediate',1),
    (v_id,'Machine Learning','What is cross-validation?',
     '["Evaluating model by splitting data into multiple train/test folds","A type of optimiser","A loss function","Feature selection"]',
     'Evaluating model by splitting data into multiple train/test folds',
     'k-fold CV provides a more reliable estimate of generalisation performance.',
     'Intermediate',1),
    (v_id,'Machine Learning','What does a confusion matrix show?',
     '["TP, FP, TN, FN counts","Accuracy only","Loss curve","Feature importance"]',
     'TP, FP, TN, FN counts',
     'A confusion matrix breaks down predictions by actual vs predicted classes.',
     'Intermediate',1),
    (v_id,'Machine Learning','What is gradient descent?',
     '["Optimisation algorithm that minimises loss by updating parameters","A regularisation method","A tree algorithm","A metric"]',
     'Optimisation algorithm that minimises loss by updating parameters',
     'Gradient descent iteratively moves parameters in the direction of steepest descent.',
     'Intermediate',1),
    (v_id,'Machine Learning','What is a neural network?',
     '["Layers of interconnected nodes inspired by the brain","A decision tree ensemble","A linear model","A clustering algorithm"]',
     'Layers of interconnected nodes inspired by the brain',
     'Neural networks learn hierarchical representations through backpropagation.',
     'Beginner',1),
    (v_id,'Machine Learning','What is the purpose of a train/test split?',
     '["Evaluate model on unseen data","Speed up training","Reduce feature count","Balance classes"]',
     'Evaluate model on unseen data',
     'Keeping a held-out test set measures real-world generalisation.',
     'Beginner',1),
    (v_id,'Machine Learning','What is the ROC-AUC score?',
     '["Area under receiver operating characteristic curve","Accuracy","Precision","Recall"]',
     'Area under receiver operating characteristic curve',
     'AUC measures classifier ranking ability across all thresholds.',
     'Advanced',1),
    (v_id,'Machine Learning','What is transfer learning?',
     '["Using a pre-trained model as starting point for a new task","Copying data","Transferring weights between databases","None"]',
     'Using a pre-trained model as starting point for a new task',
     'Transfer learning leverages representations learned on large datasets.',
     'Advanced',1)
  ON CONFLICT DO NOTHING;
END $$;

-- ----------------------------------------------------------------
-- 5. LEARNING RESOURCES
-- ----------------------------------------------------------------
DO $$
BEGIN
  INSERT INTO public.learning_resources
    (skill_name, title, type, url, provider, difficulty, duration_hours, is_free, rating, description)
  VALUES
    -- Python
    ('Python','Python for Everybody','course','https://www.coursera.org/specializations/python','Coursera','Beginner',30,FALSE,4.8,'Beginner-friendly Python specialisation covering fundamentals to data access.'),
    ('Python','Official Python Tutorial','documentation','https://docs.python.org/3/tutorial/','Python.org','Beginner',10,TRUE,4.7,'The official comprehensive Python tutorial.'),
    ('Python','Automate the Boring Stuff','tutorial','https://automatetheboringstuff.com','Al Sweigart','Beginner',20,TRUE,4.8,'Practical Python automation projects for beginners.'),
    ('Python','Real Python','tutorial','https://realpython.com','Real Python','Intermediate',NULL,FALSE,4.7,'In-depth Python tutorials and articles.'),
    -- JavaScript
    ('JavaScript','The Odin Project – JavaScript','course','https://www.theodinproject.com/paths/full-stack-javascript','The Odin Project','Beginner',80,TRUE,4.9,'Full-stack JavaScript curriculum with projects.'),
    ('JavaScript','JavaScript.info','documentation','https://javascript.info','javascript.info','Beginner',25,TRUE,4.9,'Modern JavaScript tutorial covering all fundamentals.'),
    ('JavaScript','You Don''t Know JS','tutorial','https://github.com/getify/You-Dont-Know-JS','Kyle Simpson','Advanced',40,TRUE,4.8,'Deep dive into JavaScript mechanics.'),
    -- HTML/CSS
    ('HTML/CSS','freeCodeCamp – Responsive Web Design','course','https://www.freecodecamp.org/learn/responsive-web-design/','freeCodeCamp','Beginner',300,TRUE,4.7,'Covers HTML, CSS, and responsive design with certification.'),
    ('HTML/CSS','CSS Tricks','tutorial','https://css-tricks.com','CSS-Tricks','Intermediate',NULL,TRUE,4.6,'Tips, tricks, and techniques on using CSS.'),
    ('HTML/CSS','MDN HTML Reference','documentation','https://developer.mozilla.org/en-US/docs/Web/HTML','MDN','Beginner',NULL,TRUE,4.9,'Authoritative HTML reference from Mozilla.'),
    -- React
    ('React','React Official Docs','documentation','https://react.dev','Meta','Intermediate',20,TRUE,4.9,'Official React documentation with interactive examples.'),
    ('React','Scrimba – Learn React','course','https://scrimba.com/learn/learnreact','Scrimba','Intermediate',16,FALSE,4.7,'Interactive React course with hands-on coding.'),
    ('React','Epic React','course','https://epicreact.dev','Kent C. Dodds','Advanced',30,FALSE,4.9,'Advanced React patterns and performance.'),
    -- SQL
    ('SQL','SQLZoo','tutorial','https://sqlzoo.net','SQLZoo','Beginner',10,TRUE,4.5,'Interactive SQL exercises for all levels.'),
    ('SQL','Mode Analytics SQL Tutorial','tutorial','https://mode.com/sql-tutorial/','Mode','Intermediate',8,TRUE,4.6,'Practical SQL for data analysis.'),
    ('SQL','PostgreSQL Documentation','documentation','https://www.postgresql.org/docs/','PostgreSQL','Advanced',NULL,TRUE,4.8,'Comprehensive PostgreSQL reference.'),
    -- Node.js
    ('Node.js','Node.js Official Docs','documentation','https://nodejs.org/en/docs','Node.js','Beginner',NULL,TRUE,4.7,'Official Node.js guides and API reference.'),
    ('Node.js','The Complete Node.js Developer Course','course','https://www.udemy.com/course/the-complete-nodejs-developer-course-2/','Udemy','Intermediate',35,FALSE,4.7,'Comprehensive Node.js and Express course.'),
    -- Data Structures
    ('Data Structures','LeetCode','exercise','https://leetcode.com','LeetCode','Intermediate',NULL,FALSE,4.7,'Practice coding problems covering all DS&A topics.'),
    ('Data Structures','Visualgo','tutorial','https://visualgo.net','NUS','Beginner',NULL,TRUE,4.6,'Visualise data structures and algorithms.'),
    ('Data Structures','Introduction to Algorithms (CLRS)','documentation','https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/','MIT Press','Advanced',NULL,FALSE,4.8,'The definitive algorithms textbook.'),
    -- Machine Learning
    ('Machine Learning','fast.ai Practical Deep Learning','course','https://course.fast.ai','fast.ai','Intermediate',30,TRUE,4.9,'Top-down practical deep learning for coders.'),
    ('Machine Learning','Coursera ML Specialisation','course','https://www.coursera.org/specializations/machine-learning-introduction','Coursera','Intermediate',90,FALSE,4.9,'Andrew Ng''s classic machine learning course.'),
    ('Machine Learning','Scikit-learn User Guide','documentation','https://scikit-learn.org/stable/user_guide.html','Scikit-learn','Intermediate',NULL,TRUE,4.8,'Comprehensive guide to scikit-learn algorithms.'),
    -- Cloud
    ('Cloud Platforms','AWS Certified Cloud Practitioner','course','https://aws.amazon.com/certification/certified-cloud-practitioner/','AWS','Beginner',20,FALSE,4.7,'Foundational AWS certification course.'),
    ('Cloud Platforms','Google Cloud Skills Boost','course','https://cloudskillsboost.google','Google','Beginner',NULL,FALSE,4.6,'Hands-on Google Cloud labs and courses.'),
    -- Docker
    ('Docker','Play with Docker','exercise','https://labs.play-with-docker.com','Docker','Beginner',5,TRUE,4.5,'Browser-based Docker playground.'),
    ('Docker','Docker Official Docs','documentation','https://docs.docker.com','Docker','Beginner',NULL,TRUE,4.7,'Official Docker getting-started guides.')
  ON CONFLICT DO NOTHING;
END $$;
