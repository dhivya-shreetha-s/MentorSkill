export const CAREER_ROLES = [
  {
    id: "cr-1",
    title: "Full Stack Developer",
    description: "Build end-to-end web applications combining robust backend services with modern responsive frontend interfaces.",
    level: "Mid-Senior",
    avg_salary: "$95,000 - $145,000",
    demand: "Very High",
    suggested_projects: [
      "Full-Stack E-Commerce Platform with Stripe Checkout",
      "Real-time Collaborative Task Management SaaS",
      "AI-Powered Career & Portfolio Generator"
    ],
    skills: [
      { skill_name: "JavaScript", required_proficiency: "Advanced", priority: "required", is_prerequisite: true },
      { skill_name: "React", required_proficiency: "Advanced", priority: "required", is_prerequisite: false },
      { skill_name: "Node.js", required_proficiency: "Intermediate", priority: "required", is_prerequisite: false },
      { skill_name: "SQL", required_proficiency: "Intermediate", priority: "required", is_prerequisite: false },
      { skill_name: "HTML", required_proficiency: "Advanced", priority: "required", is_prerequisite: true },
      { skill_name: "CSS", required_proficiency: "Advanced", priority: "required", is_prerequisite: true },
      { skill_name: "Git", required_proficiency: "Intermediate", priority: "required", is_prerequisite: true },
      { skill_name: "REST APIs", required_proficiency: "Advanced", priority: "required", is_prerequisite: false }
    ]
  },
  {
    id: "cr-2",
    title: "Frontend Developer",
    description: "Design and implement intuitive, responsive, and performant user interfaces for web and mobile platforms.",
    level: "Entry-Mid",
    avg_salary: "$80,000 - $125,000",
    demand: "High",
    suggested_projects: [
      "Interactive Dashboard with Charts and Real-time WebSockets",
      "Accessible Design System & UI Component Library",
      "Progressive Web App (PWA) with Offline Caching"
    ],
    skills: [
      { skill_name: "HTML", required_proficiency: "Expert", priority: "required", is_prerequisite: true },
      { skill_name: "CSS", required_proficiency: "Expert", priority: "required", is_prerequisite: true },
      { skill_name: "JavaScript", required_proficiency: "Advanced", priority: "required", is_prerequisite: true },
      { skill_name: "React", required_proficiency: "Advanced", priority: "required", is_prerequisite: false },
      { skill_name: "TypeScript", required_proficiency: "Intermediate", priority: "recommended", is_prerequisite: false },
      { skill_name: "Tailwind CSS", required_proficiency: "Advanced", priority: "recommended", is_prerequisite: false },
      { skill_name: "Git", required_proficiency: "Intermediate", priority: "required", is_prerequisite: true },
      { skill_name: "REST APIs", required_proficiency: "Intermediate", priority: "required", is_prerequisite: false }
    ]
  },
  {
    id: "cr-3",
    title: "Backend Developer",
    description: "Architect scalable server-side systems, APIs, database schemas, and data pipelines.",
    level: "Mid-Senior",
    avg_salary: "$90,000 - $140,000",
    demand: "High",
    suggested_projects: [
      "High-throughput Distributed Message Queue API",
      "Secure Multi-tenant Authentication & Authorization Microservice",
      "Financial Transaction Engine with ACID guarantees"
    ],
    skills: [
      { skill_name: "Node.js", required_proficiency: "Advanced", priority: "required", is_prerequisite: false },
      { skill_name: "Python", required_proficiency: "Intermediate", priority: "recommended", is_prerequisite: false },
      { skill_name: "SQL", required_proficiency: "Advanced", priority: "required", is_prerequisite: true },
      { skill_name: "REST APIs", required_proficiency: "Advanced", priority: "required", is_prerequisite: false },
      { skill_name: "Data Structures", required_proficiency: "Intermediate", priority: "required", is_prerequisite: true },
      { skill_name: "Git", required_proficiency: "Intermediate", priority: "required", is_prerequisite: true },
      { skill_name: "Docker", required_proficiency: "Intermediate", priority: "recommended", is_prerequisite: false },
      { skill_name: "Redis", required_proficiency: "Intermediate", priority: "recommended", is_prerequisite: false }
    ]
  },
  {
    id: "cr-4",
    title: "Data Scientist",
    description: "Extract actionable insights, build predictive statistical models, and conduct scientific data exploration.",
    level: "Mid-Senior",
    avg_salary: "$100,000 - $155,000",
    demand: "High",
    suggested_projects: [
      "Customer Churn Prediction & Survival Analysis",
      "Natural Language Processing Topic Modeling on Support Tickets",
      "End-to-End MLOps Pipeline with Model Monitoring"
    ],
    skills: [
      { skill_name: "Python", required_proficiency: "Expert", priority: "required", is_prerequisite: true },
      { skill_name: "SQL", required_proficiency: "Advanced", priority: "required", is_prerequisite: true },
      { skill_name: "Machine Learning", required_proficiency: "Advanced", priority: "required", is_prerequisite: false },
      { skill_name: "Data Structures", required_proficiency: "Intermediate", priority: "required", is_prerequisite: true },
      { skill_name: "Pandas", required_proficiency: "Advanced", priority: "required", is_prerequisite: false },
      { skill_name: "NumPy", required_proficiency: "Advanced", priority: "required", is_prerequisite: false },
      { skill_name: "Statistics", required_proficiency: "Advanced", priority: "required", is_prerequisite: true },
      { skill_name: "Git", required_proficiency: "Intermediate", priority: "required", is_prerequisite: false }
    ]
  },
  {
    id: "cr-5",
    title: "Data Analyst",
    description: "Transform complex raw data into compelling business intelligence reports, dashboards, and growth metrics.",
    level: "Entry-Mid",
    avg_salary: "$70,000 - $105,000",
    demand: "High",
    suggested_projects: [
      "Executive Revenue & Retention BI Dashboard",
      "Product Funnel & User Cohort Analytics Report",
      "Automated SQL Reporting Pipeline for Sales Operations"
    ],
    skills: [
      { skill_name: "SQL", required_proficiency: "Advanced", priority: "required", is_prerequisite: true },
      { skill_name: "Python", required_proficiency: "Intermediate", priority: "recommended", is_prerequisite: false },
      { skill_name: "Data Visualization", required_proficiency: "Advanced", priority: "required", is_prerequisite: false },
      { skill_name: "Excel", required_proficiency: "Advanced", priority: "required", is_prerequisite: true },
      { skill_name: "Tableau", required_proficiency: "Intermediate", priority: "recommended", is_prerequisite: false },
      { skill_name: "Statistics", required_proficiency: "Intermediate", priority: "required", is_prerequisite: true },
      { skill_name: "Git", required_proficiency: "Beginner", priority: "optional", is_prerequisite: false }
    ]
  },
  {
    id: "cr-6",
    title: "AI/ML Engineer",
    description: "Design, train, optimize, and deploy production machine learning and generative AI applications at scale.",
    level: "Senior",
    avg_salary: "$115,000 - $175,000",
    demand: "Extremely High",
    suggested_projects: [
      "Multi-Agent RAG System with Vector Search & Guardrails",
      "Fine-tuned Domain-Specific LLM on Custom Dataset",
      "Real-time Computer Vision Edge Deployment"
    ],
    skills: [
      { skill_name: "Python", required_proficiency: "Expert", priority: "required", is_prerequisite: true },
      { skill_name: "Machine Learning", required_proficiency: "Expert", priority: "required", is_prerequisite: true },
      { skill_name: "Deep Learning", required_proficiency: "Advanced", priority: "required", is_prerequisite: false },
      { skill_name: "Data Structures", required_proficiency: "Advanced", priority: "required", is_prerequisite: true },
      { skill_name: "PyTorch", required_proficiency: "Advanced", priority: "required", is_prerequisite: false },
      { skill_name: "REST APIs", required_proficiency: "Intermediate", priority: "required", is_prerequisite: false },
      { skill_name: "Docker", required_proficiency: "Intermediate", priority: "recommended", is_prerequisite: false },
      { skill_name: "Git", required_proficiency: "Intermediate", priority: "required", is_prerequisite: true }
    ]
  },
  {
    id: "cr-7",
    title: "Python Developer",
    description: "Develop versatile backend systems, automation scripts, data scrapers, and API integrations with Python.",
    level: "Entry-Mid",
    avg_salary: "$85,000 - $130,000",
    demand: "High",
    suggested_projects: [
      "Asynchronous Web Scraping & Aggregation Engine",
      "FastAPI Microservices Suite with Automated OpenAPI Specs",
      "Automated DevOps Workflow & Cloud Infrastructure CLI"
    ],
    skills: [
      { skill_name: "Python", required_proficiency: "Expert", priority: "required", is_prerequisite: true },
      { skill_name: "SQL", required_proficiency: "Intermediate", priority: "required", is_prerequisite: false },
      { skill_name: "REST APIs", required_proficiency: "Advanced", priority: "required", is_prerequisite: false },
      { skill_name: "Data Structures", required_proficiency: "Intermediate", priority: "required", is_prerequisite: true },
      { skill_name: "FastAPI", required_proficiency: "Intermediate", priority: "recommended", is_prerequisite: false },
      { skill_name: "Git", required_proficiency: "Intermediate", priority: "required", is_prerequisite: true },
      { skill_name: "Docker", required_proficiency: "Intermediate", priority: "recommended", is_prerequisite: false }
    ]
  },
  {
    id: "cr-8",
    title: "Cloud Engineer",
    description: "Design resilient cloud architectures, automate infrastructure deployment, and manage CI/CD pipelines.",
    level: "Mid-Senior",
    avg_salary: "$105,000 - $160,000",
    demand: "Very High",
    suggested_projects: [
      "Terraform Infrastructure as Code for Multi-Region AWS VPC",
      "Kubernetes GitOps Deployment with ArgoCD",
      "Zero-Trust Cloud Security & Compliance Monitoring Automation"
    ],
    skills: [
      { skill_name: "Cloud Architecture", required_proficiency: "Advanced", priority: "required", is_prerequisite: true },
      { skill_name: "Docker", required_proficiency: "Advanced", priority: "required", is_prerequisite: true },
      { skill_name: "Kubernetes", required_proficiency: "Intermediate", priority: "required", is_prerequisite: false },
      { skill_name: "CI/CD", required_proficiency: "Advanced", priority: "required", is_prerequisite: false },
      { skill_name: "Linux", required_proficiency: "Advanced", priority: "required", is_prerequisite: true },
      { skill_name: "Python", required_proficiency: "Intermediate", priority: "recommended", is_prerequisite: false },
      { skill_name: "Git", required_proficiency: "Intermediate", priority: "required", is_prerequisite: true }
    ]
  }
];

export const ASSESSMENTS = [
  {
    id: "as-js",
    title: "JavaScript Core Proficiency Assessment",
    topic: "JavaScript",
    difficulty: "Intermediate",
    time_limit_minutes: 15,
    passing_score: 70,
    questions: [
      {
        id: "q-js-1",
        topic: "JavaScript",
        question_text: "What is the difference between '==' and '===' in JavaScript?",
        options: {
          A: "There is no difference in modern V8 engines",
          B: "== performs type coercion before comparison, whereas === requires identical types and values",
          C: "=== converts both values to strings before comparing",
          D: "== is deprecated in ES6"
        },
        correct_answer: "B",
        explanation: "The strict equality operator (===) checks both value and type without coercion, whereas loose equality (==) coerces operands.",
        difficulty: "Beginner",
        points: 1
      },
      {
        id: "q-js-2",
        topic: "JavaScript",
        question_text: "Which of the following creates a closure in JavaScript?",
        options: {
          A: "A function defined inside another function that accesses the outer function's variables",
          B: "Any object with private properties",
          C: "A JSON file loaded via fetch",
          D: "A while loop that iterates until null"
        },
        correct_answer: "A",
        explanation: "A closure is the combination of a function bundled together with references to its lexical environment.",
        difficulty: "Intermediate",
        points: 1
      },
      {
        id: "q-js-3",
        topic: "JavaScript",
        question_text: "What is the output of: console.log(typeof NaN)?",
        options: {
          A: "'undefined'",
          B: "'null'",
          C: "'number'",
          D: "'nan'"
        },
        correct_answer: "C",
        explanation: "In IEEE 754 floating-point standard used by JavaScript, NaN represents Not-a-Number but its primitive type is 'number'.",
        difficulty: "Beginner",
        points: 1
      },
      {
        id: "q-js-4",
        topic: "JavaScript",
        question_text: "How does the JavaScript Event Loop handle microtasks vs macrotasks?",
        options: {
          A: "Macrotasks always execute before microtasks in every tick",
          B: "All microtasks in the microtask queue are drained immediately following the current task and before the next macrotask",
          C: "Microtasks only run during garbage collection",
          D: "Promises are macrotasks, setTimeout is a microtask"
        },
        correct_answer: "B",
        explanation: "The event loop processes the call stack, then executes all pending microtasks (e.g., Promise callbacks) before picking the next macrotask (e.g., setTimeout).",
        difficulty: "Advanced",
        points: 1
      },
      {
        id: "q-js-5",
        topic: "JavaScript",
        question_text: "Which array method returns a new array with all elements that pass the test implemented by the provided function?",
        options: {
          A: "forEach()",
          B: "map()",
          C: "filter()",
          D: "reduce()"
        },
        correct_answer: "C",
        explanation: "Array.prototype.filter() creates a shallow copy of a portion of a given array, filtered down to just the elements from the given array that pass the test.",
        difficulty: "Beginner",
        points: 1
      },
      {
        id: "q-js-6",
        topic: "JavaScript",
        question_text: "What will Promise.all() do if one of the promises in the array rejects?",
        options: {
          A: "Wait for the remaining promises to resolve before rejecting",
          B: "Immediately reject with the reason of the first promise that rejected",
          C: "Ignore the rejected promise and return the resolved ones",
          D: "Retry the rejected promise 3 times"
        },
        correct_answer: "B",
        explanation: "Promise.all() adopts a fast-fail behavior: it immediately rejects upon the first promise rejection.",
        difficulty: "Intermediate",
        points: 1
      },
      {
        id: "q-js-7",
        topic: "JavaScript",
        question_text: "What is the primary purpose of JavaScript Symbols?",
        options: {
          A: "To serve as unique, immutable object property keys that avoid name collisions",
          B: "To replace CSS icons with native primitives",
          C: "To provide mathematical cryptographic signatures",
          D: "To create double-precision floating numbers"
        },
        correct_answer: "A",
        explanation: "Symbols are unique primitive values often used to add hidden or collision-free properties to objects.",
        difficulty: "Advanced",
        points: 1
      },
      {
        id: "q-js-8",
        topic: "JavaScript",
        question_text: "What does the 'bind' method return when called on a function?",
        options: {
          A: "The immediate return value of executing the function",
          B: "A new function with its 'this' keyword permanently bound to the provided value",
          C: "A Promise resolving to the function's output",
          D: "An iterator object"
        },
        correct_answer: "B",
        explanation: "Function.prototype.bind() creates a new function that, when called, has its this keyword set to the provided value.",
        difficulty: "Intermediate",
        points: 1
      }
    ]
  },
  {
    id: "as-py",
    title: "Python Core Proficiency Assessment",
    topic: "Python",
    difficulty: "Intermediate",
    time_limit_minutes: 15,
    passing_score: 70,
    questions: [
      {
        id: "q-py-1",
        topic: "Python",
        question_text: "Which of the following data types in Python is mutable?",
        options: {
          A: "tuple",
          B: "str",
          C: "list",
          D: "frozenset"
        },
        correct_answer: "C",
        explanation: "Lists and dictionaries in Python are mutable, meaning their contents can be changed in place. Tuples, strings, and frozensets are immutable.",
        difficulty: "Beginner",
        points: 1
      },
      {
        id: "q-py-2",
        topic: "Python",
        question_text: "What does the Python 'yield' keyword do inside a function definition?",
        options: {
          A: "Terminates the function and raises StopIteration",
          B: "Turns the function into a generator, yielding values lazily upon iteration",
          C: "Forces memory garbage collection",
          D: "Creates a thread lock"
        },
        correct_answer: "B",
        explanation: "The yield keyword produces a generator object that pauses execution and yields values one at a time on demand.",
        difficulty: "Intermediate",
        points: 1
      },
      {
        id: "q-py-3",
        topic: "Python",
        question_text: "What is the GIL (Global Interpreter Lock) in CPython?",
        options: {
          A: "A compiler flag to enable JIT optimization",
          B: "A mutex that prevents multiple native OS threads from executing Python bytecodes simultaneously in CPython",
          C: "A security protocol protecting against SQL injection",
          D: "A package manager lock file"
        },
        correct_answer: "B",
        explanation: "The GIL allows only one thread to hold the Python interpreter lock at any given moment in CPython, protecting memory management.",
        difficulty: "Advanced",
        points: 1
      },
      {
        id: "q-py-4",
        topic: "Python",
        question_text: "What is the time complexity of looking up a key in a Python dict on average?",
        options: {
          A: "O(n)",
          B: "O(log n)",
          C: "O(1)",
          D: "O(n log n)"
        },
        correct_answer: "C",
        explanation: "Python dictionaries use hash tables, providing average O(1) time complexity for key lookups, insertions, and deletions.",
        difficulty: "Beginner",
        points: 1
      },
      {
        id: "q-py-5",
        topic: "Python",
        question_text: "How do decorators function in Python?",
        options: {
          A: "They are higher-order functions that take a function as an argument, extend its behavior, and return a new function",
          B: "They are CSS styling rules for Tkinter UI",
          C: "They are type annotations for variables",
          D: "They are automated unit test runners"
        },
        correct_answer: "A",
        explanation: "Decorators wrap functions or methods using the @ syntax, allowing dynamic modification or logging without altering source code.",
        difficulty: "Intermediate",
        points: 1
      },
      {
        id: "q-py-6",
        topic: "Python",
        question_text: "What does `*args` and `**kwargs` represent in a function signature?",
        options: {
          A: "Pointers to heap and stack memory",
          B: "Variable number of non-keyword (positional) arguments and keyword arguments respectively",
          C: "Regular expression wildcards",
          D: "Mathematical multiplication and power operators"
        },
        correct_answer: "B",
        explanation: "*args packs excess positional arguments into a tuple, while **kwargs packs excess keyword arguments into a dictionary.",
        difficulty: "Beginner",
        points: 1
      },
      {
        id: "q-py-7",
        topic: "Python",
        question_text: "What does the `__slots__` attribute do in a Python class?",
        options: {
          A: "Prevents dynamic creation of __dict__ on instances, optimizing memory usage for millions of objects",
          B: "Defines database table foreign keys",
          C: "Enables multiple inheritance",
          D: "Limits the maximum number of instances to a fixed integer"
        },
        correct_answer: "A",
        explanation: "Using __slots__ tells Python not to create a dynamic __dict__ for instances, saving significant memory when creating large quantities of instances.",
        difficulty: "Advanced",
        points: 1
      },
      {
        id: "q-py-8",
        topic: "Python",
        question_text: "Which context manager method is called when exiting a `with` block?",
        options: {
          A: "__close__()",
          B: "__exit__()",
          C: "__del__()",
          D: "__stop__()"
        },
        correct_answer: "B",
        explanation: "When exiting a with statement block, Python invokes the __exit__(exc_type, exc_val, exc_tb) method of the context manager.",
        difficulty: "Intermediate",
        points: 1
      }
    ]
  },
  {
    id: "as-react",
    title: "React & Modern UI Architecture Assessment",
    topic: "React",
    difficulty: "Intermediate",
    time_limit_minutes: 15,
    passing_score: 70,
    questions: [
      {
        id: "q-rc-1",
        topic: "React",
        question_text: "Why should state in React never be mutated directly (e.g. state.count = 5)?",
        options: {
          A: "JavaScript will throw a syntax error",
          B: "React relies on reference equality checks (Object.is) to determine if a re-render should be triggered",
          C: "Direct mutation causes browser crashes",
          D: "State is frozen using Object.freeze at build time"
        },
        correct_answer: "B",
        explanation: "React relies on immutable updates and reference comparisons to trigger reconciliation and optimize virtual DOM diffing.",
        difficulty: "Beginner",
        points: 1
      },
      {
        id: "q-rc-2",
        topic: "React",
        question_text: "What is the purpose of the dependency array in the useEffect hook?",
        options: {
          A: "To specify which npm packages to load asynchronously",
          B: "To tell React when to re-run the effect by shallowly comparing previous and current values in the array",
          C: "To pass props down to child components",
          D: "To define TypeScript interfaces for the effect"
        },
        correct_answer: "B",
        explanation: "React compares each dependency value against its previous render value via Object.is; if any value changes, the effect is re-executed.",
        difficulty: "Beginner",
        points: 1
      },
      {
        id: "q-rc-3",
        topic: "React",
        question_text: "What problem does the useCallback hook solve?",
        options: {
          A: "It caches the result of an expensive calculation",
          B: "It memoizes a function definition across renders so child components wrapped in React.memo don't needlessly re-render",
          C: "It executes asynchronous API calls synchronously",
          D: "It creates Redux actions automatically"
        },
        correct_answer: "B",
        explanation: "useCallback caches a function instance between re-renders until one of its dependencies changes, preventing unnecessary child component re-renders.",
        difficulty: "Intermediate",
        points: 1
      },
      {
        id: "q-rc-4",
        topic: "React",
        question_text: "What is React Reconciliation?",
        options: {
          A: "The algorithm React uses to diff one tree with another to determine which parts need to be changed in the real DOM",
          B: "Financial accounting for SaaS subscriptions",
          C: "The build step performed by Vite or Webpack",
          D: "Resolving merge conflicts in Git"
        },
        correct_answer: "A",
        explanation: "Reconciliation is the process through which React updates the DOM by comparing virtual DOM trees using an efficient heuristic O(n) diffing algorithm.",
        difficulty: "Advanced",
        points: 1
      },
      {
        id: "q-rc-5",
        topic: "React",
        question_text: "When should you use the useReducer hook instead of useState?",
        options: {
          A: "When managing complex state logic involving multiple sub-values or when the next state depends on the previous one in complicated ways",
          B: "Whenever you need to render an array of items",
          C: "Only in class components",
          D: "useReducer is deprecated in React 18"
        },
        correct_answer: "A",
        explanation: "useReducer is preferable to useState when state logic is complex, involves multiple actions, or needs clear separation between state transitions.",
        difficulty: "Intermediate",
        points: 1
      },
      {
        id: "q-rc-6",
        topic: "React",
        question_text: "What is the primary role of the `key` prop when rendering lists in React?",
        options: {
          A: "It provides a unique CSS selector for Tailwind",
          B: "It helps React identify which items have changed, been added, or been removed, avoiding full re-creation of list items",
          C: "It encrypts the list data in memory",
          D: "It acts as a primary key for Supabase database operations"
        },
        correct_answer: "B",
        explanation: "Keys give elements a stable identity across renders, allowing React to match existing DOM nodes efficiently during list reconciliation.",
        difficulty: "Beginner",
        points: 1
      },
      {
        id: "q-rc-7",
        topic: "React",
        question_text: "What does React Suspense allow developers to do?",
        options: {
          A: "Pause JavaScript execution indefinitely until the user clicks a button",
          B: "Declaratively specify loading fallbacks while child components are fetching data or lazily loading code",
          C: "Cancel in-flight network requests",
          D: "Debug infinite loops in useEffect"
        },
        correct_answer: "B",
        explanation: "Suspense lets you coordinate visual loading states declaratively by showing a fallback component while async operations (code splitting, data fetching) complete.",
        difficulty: "Advanced",
        points: 1
      },
      {
        id: "q-rc-8",
        topic: "React",
        question_text: "What is the difference between useMemo and useCallback?",
        options: {
          A: "useMemo caches the returned value of a function, whereas useCallback caches the function definition itself",
          B: "useMemo is for components, useCallback is for hooks",
          C: "useMemo runs on the server, useCallback runs on the client",
          D: "There is no difference, they are aliases"
        },
        correct_answer: "A",
        explanation: "useMemo(() => fn(), deps) returns the computed value; useCallback(fn, deps) returns the memoized function reference itself.",
        difficulty: "Intermediate",
        points: 1
      }
    ]
  },
  {
    id: "as-sql",
    title: "SQL & Relational Databases Assessment",
    topic: "SQL",
    difficulty: "Intermediate",
    time_limit_minutes: 15,
    passing_score: 70,
    questions: [
      {
        id: "q-sql-1",
        topic: "SQL",
        question_text: "What is the difference between WHERE and HAVING clauses in SQL?",
        options: {
          A: "WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY",
          B: "WHERE is for numbers; HAVING is for text",
          C: "HAVING is deprecated in PostgreSQL 15+",
          D: "WHERE can only be used with SELECT; HAVING is used with UPDATE"
        },
        correct_answer: "A",
        explanation: "WHERE filters individual table rows prior to grouping, while HAVING applies conditions to aggregated summary records created by GROUP BY.",
        difficulty: "Beginner",
        points: 1
      },
      {
        id: "q-sql-2",
        topic: "SQL",
        question_text: "What is an SQL Index primarily designed to optimize?",
        options: {
          A: "Storage compression on disk",
          B: "Read query performance by allowing the engine to locate rows without a full table scan",
          C: "Writing speed for bulk INSERT operations",
          D: "Automatic database encryption"
        },
        correct_answer: "B",
        explanation: "Indexes (typically B-Trees) provide quick lookup paths for specified columns, drastically accelerating SELECT queries at the cost of slightly slower writes.",
        difficulty: "Beginner",
        points: 1
      },
      {
        id: "q-sql-3",
        topic: "SQL",
        question_text: "What are the four ACID properties in relational transaction management?",
        options: {
          A: "Accuracy, Consistency, Indexing, Durability",
          B: "Atomicity, Consistency, Isolation, Durability",
          C: "Aggregation, Concurrency, Integrity, Distribution",
          D: "Authentication, Confidentiality, Integrity, Decoupling"
        },
        correct_answer: "B",
        explanation: "ACID stands for Atomicity (all or nothing), Consistency (preserves rules), Isolation (independent transactions), and Durability (persisted on commit).",
        difficulty: "Intermediate",
        points: 1
      },
      {
        id: "q-sql-4",
        topic: "SQL",
        question_text: "Which JOIN returns all rows from the left table and matched rows from the right table, filling nulls if no match?",
        options: {
          A: "INNER JOIN",
          B: "LEFT OUTER JOIN",
          C: "CROSS JOIN",
          D: "FULL OUTER JOIN"
        },
        correct_answer: "B",
        explanation: "A LEFT OUTER JOIN preserves every record from the left table, displaying NULL for columns of the right table when no matching row satisfies the join predicate.",
        difficulty: "Beginner",
        points: 1
      },
      {
        id: "q-sql-5",
        topic: "SQL",
        question_text: "What does the ROW_NUMBER() window function do?",
        options: {
          A: "Counts total records in the database table",
          B: "Assigns a sequential integer to each row within a partition of a result set, starting at 1 for the first row in each partition",
          C: "Returns the disk block address of the row",
          D: "Generates an auto-incrementing UUID"
        },
        correct_answer: "B",
        explanation: "ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) numbers the rows within each window partition sequentially based on the ordering criteria.",
        difficulty: "Intermediate",
        points: 1
      },
      {
        id: "q-sql-6",
        topic: "SQL",
        question_text: "What is a Foreign Key constraint?",
        options: {
          A: "A key that links to another database cluster across countries",
          B: "A column or combination of columns used to establish and enforce a link between the data in two tables (referential integrity)",
          C: "An API key for external microservices",
          D: "A unique hash generated for passwords"
        },
        correct_answer: "B",
        explanation: "A foreign key enforces referential integrity by ensuring values in the child table match existing primary keys in the parent table.",
        difficulty: "Beginner",
        points: 1
      },
      {
        id: "q-sql-7",
        topic: "SQL",
        question_text: "What is database normalization (specifically 3NF)?",
        options: {
          A: "Compressing images stored in BLOB fields",
          B: "Structuring a database to reduce data redundancy and eliminate undesirable insertion, update, and deletion anomalies",
          C: "Converting all table and column names to lowercase",
          D: "Translating SQL queries into machine bytecode"
        },
        correct_answer: "B",
        explanation: "3NF requires a table to be in 2NF and have every non-prime attribute non-transitively dependent on every candidate key, eliminating redundancy.",
        difficulty: "Advanced",
        points: 1
      },
      {
        id: "q-sql-8",
        topic: "SQL",
        question_text: "What does an EXPLAIN ANALYZE command do in PostgreSQL?",
        options: {
          A: "Runs a grammar check on SQL keywords",
          B: "Executes the statement and displays actual run times, plan node costs, index usage, and total rows processed",
          C: "Backs up the database schema to S3",
          D: "Restores deleted records from transaction logs"
        },
        correct_answer: "B",
        explanation: "EXPLAIN ANALYZE executes the query and returns the query planner's execution tree with real elapsed times and row counts per node.",
        difficulty: "Advanced",
        points: 1
      }
    ]
  }
];

export const LEARNING_RESOURCES = [
  {
    skill_name: "JavaScript",
    title: "JavaScript - MDN Web Docs",
    type: "documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    provider: "MDN",
    difficulty: "Beginner",
    duration_hours: 20,
    is_free: true,
    rating: 4.9,
    description: "The gold-standard reference for JavaScript primitives, objects, closures, prototypes, and asynchronous patterns."
  },
  {
    skill_name: "JavaScript",
    title: "JavaScript Algorithms & Data Structures",
    type: "course",
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
    provider: "freeCodeCamp",
    difficulty: "Intermediate",
    duration_hours: 30,
    is_free: true,
    rating: 4.8,
    description: "Interactive coding curriculum covering ES6+, OOP, functional programming, and algorithmic challenges."
  },
  {
    skill_name: "React",
    title: "React Official Documentation & Interactive Quickstart",
    type: "documentation",
    url: "https://react.dev/learn",
    provider: "React Team",
    difficulty: "Beginner",
    duration_hours: 15,
    is_free: true,
    rating: 4.95,
    description: "Modern, hooks-first React tutorials with interactive sandboxes explaining state, effects, and component lifecycles."
  },
  {
    skill_name: "React",
    title: "Front End Development Libraries Certification",
    type: "course",
    url: "https://www.freecodecamp.org/learn/front-end-development-libraries/",
    provider: "freeCodeCamp",
    difficulty: "Intermediate",
    duration_hours: 25,
    is_free: true,
    rating: 4.85,
    description: "Hands-on projects building web applications using React, Redux, and modern UI libraries."
  },
  {
    skill_name: "Node.js",
    title: "Node.js Official Documentation",
    type: "documentation",
    url: "https://nodejs.org/en/docs",
    provider: "Node.js",
    difficulty: "Intermediate",
    duration_hours: 18,
    is_free: true,
    rating: 4.7,
    description: "Comprehensive guides on asynchronous event-driven I/O, streams, file systems, and HTTP server creation."
  },
  {
    skill_name: "Python",
    title: "Python Official Documentation & Tutorial",
    type: "documentation",
    url: "https://docs.python.org/3/tutorial/",
    provider: "Python Software Foundation",
    difficulty: "Beginner",
    duration_hours: 15,
    is_free: true,
    rating: 4.9,
    description: "Authoritative introduction to Python syntax, standard library modules, classes, and error handling."
  },
  {
    skill_name: "SQL",
    title: "Relational Database Certification",
    type: "course",
    url: "https://www.freecodecamp.org/learn/relational-database/",
    provider: "freeCodeCamp",
    difficulty: "Intermediate",
    duration_hours: 20,
    is_free: true,
    rating: 4.8,
    description: "Learn PostgreSQL, bash scripting, and relational database schema design with Linux terminal exercises."
  },
  {
    skill_name: "HTML",
    title: "HTML5 & Semantic Markup - MDN",
    type: "documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    provider: "MDN",
    difficulty: "Beginner",
    duration_hours: 10,
    is_free: true,
    rating: 4.9,
    description: "Master semantic web tags, accessibility standards (a11y), forms, and modern web page structuring."
  },
  {
    skill_name: "CSS",
    title: "CSS: Cascading Style Sheets - MDN",
    type: "documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    provider: "MDN",
    difficulty: "Beginner",
    duration_hours: 15,
    is_free: true,
    rating: 4.9,
    description: "Deep dive into Flexbox, CSS Grid, custom properties, animations, and responsive media queries."
  },
  {
    skill_name: "Git",
    title: "Git Pro Book & Documentation",
    type: "documentation",
    url: "https://git-scm.com/doc",
    provider: "Git SCM",
    difficulty: "Beginner",
    duration_hours: 8,
    is_free: true,
    rating: 4.9,
    description: "The official guide to version control, branching strategies, rebasing, cherry-picking, and remote collaboration."
  }
];
