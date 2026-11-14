import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

const sampleAssessments = [
  {
    id: 'assess-1',
    title: 'JavaScript Core & ES6+ Mastery',
    topic: 'JavaScript',
    difficulty: 'Intermediate',
    time_limit_minutes: 15,
    passing_score: 70,
    questions_count: 5,
    questions: [
      {
        id: 1,
        question: 'What is the primary difference between let and var in JavaScript?',
        options: [
          'let has block scope while var has function scope',
          'var creates immutable bindings while let is mutable',
          'let is hoisted to the global object while var is not',
          'There is no functional difference in modern engines'
        ],
        correct_index: 0,
        explanation: 'let and const are block scoped, whereas var is function scoped and hoisted.'
      },
      {
        id: 2,
        question: 'What does Promise.all() do when one of the input promises rejects?',
        options: [
          'Waits for all promises to settle before rejecting',
          'Rejects immediately with the reason of the first promise that rejected',
          'Ignores the error and resolves with undefined for that index',
          'Retries the rejected promise automatically once'
        ],
        correct_index: 1,
        explanation: 'Promise.all rejects immediately upon any rejection (fail-fast behavior).'
      },
      {
        id: 3,
        question: 'Which event loop phase handles microtasks like Promise callbacks?',
        options: [
          'Timers phase',
          'Poll phase',
          'Immediately after the current synchronous script and between macrotasks',
          'Check phase (setImmediate)'
        ],
        correct_index: 2,
        explanation: 'Microtasks run immediately after the current task finishes, before the next macrotask.'
      },
      {
        id: 4,
        question: 'What is closure in JavaScript?',
        options: [
          'A method to seal objects against property modification',
          'The combination of a function bundled with references to its surrounding lexical environment',
          'A syntax error caused by unmatched curly braces',
          'An API used to terminate worker threads'
        ],
        correct_index: 1,
        explanation: 'A closure gives an inner function access to an outer enclosing function’s scope.'
      },
      {
        id: 5,
        question: 'What will typeof NaN return in JavaScript?',
        options: ['number', 'NaN', 'undefined', 'object'],
        correct_index: 0,
        explanation: 'In the IEEE 754 floating-point specification, NaN is categorized as a number type.'
      }
    ]
  },
  {
    id: 'assess-2',
    title: 'React Components & Hooks Architecture',
    topic: 'React',
    difficulty: 'Intermediate',
    time_limit_minutes: 15,
    passing_score: 70,
    questions_count: 5,
    questions: [
      {
        id: 1,
        question: 'When does the useEffect cleanup function execute?',
        options: [
          'Only when the component unmounts',
          'Before the effect runs again and when the component unmounts',
          'Immediately after each render without waiting for paint',
          'Only when an uncaught error occurs in the child tree'
        ],
        correct_index: 1,
        explanation: 'React runs cleanups from the previous render before running effects of the next render.'
      },
      {
        id: 2,
        question: 'What is the purpose of useCallback in React?',
        options: [
          'To memoize an expensive calculated value',
          'To cache a function definition between renders to prevent unnecessary child re-renders',
          'To schedule a background web worker task',
          'To force a component tree synchronization'
        ],
        correct_index: 1,
        explanation: 'useCallback memoizes callback references between renders.'
      },
      {
        id: 3,
        question: 'What is a key requirement of React Hooks rules?',
        options: [
          'Must only be called at the top level, never inside loops, conditions, or nested functions',
          'Must always be written in uppercase',
          'Can only be imported from third-party npm packages',
          'Must only be used inside class components'
        ],
        correct_index: 0,
        explanation: 'Hooks must execute in the exact same order on every render.'
      },
      {
        id: 4,
        question: 'What is the Virtual DOM in React?',
        options: [
          'A direct fork of the Chrome browser C++ rendering engine',
          'A lightweight in-memory representation of real DOM elements',
          'A hardware acceleration protocol for WebGL',
          'A replacement for CSS stylesheets'
        ],
        correct_index: 1,
        explanation: 'Virtual DOM enables efficient diffing and batch updates.'
      },
      {
        id: 5,
        question: 'Why should you avoid using array indices as React keys when item order may change?',
        options: [
          'It throws a fatal syntax compile error',
          'It can negatively impact performance and cause state mismatches with component instances',
          'It breaks HTML5 validation',
          'Keys must strictly be UUID format'
        ],
        correct_index: 1,
        explanation: 'Index keys cause incorrect component state retention during reorders/insertions.'
      }
    ]
  },
  {
    id: 'assess-3',
    title: 'Node.js & Express Architecture',
    topic: 'Node.js',
    difficulty: 'Advanced',
    time_limit_minutes: 20,
    passing_score: 75,
    questions_count: 4,
    questions: [
      {
        id: 1,
        question: 'Which Node.js internal module handles thread pool operations for filesystem and crypto?',
        options: ['libuv', 'v8-engine', 'http-parser', 'zlib-core'],
        correct_index: 0,
        explanation: 'libuv provides the event loop and thread pool in Node.js.'
      },
      {
        id: 2,
        question: 'What signature must Express error-handling middleware have?',
        options: [
          '(err, req, res, next)',
          '(req, res, next, err)',
          '(err, req, res)',
          '(error, next)'
        ],
        correct_index: 0,
        explanation: 'Express distinguishes error handlers by the 4-argument arity: (err, req, res, next).'
      },
      {
        id: 3,
        question: 'What happens when next(new Error(...)) is called in Express?',
        options: [
          'The server terminates immediately with code 1',
          'Execution skips all remaining non-error handling routes and goes to error middlewares',
          'A HTTP 500 status is sent automatically to the client without further checks',
          'The request is queued for retry in 5000ms'
        ],
        correct_index: 1,
        explanation: 'Passing any argument to next() jumps straight to error middleware.'
      },
      {
        id: 4,
        question: 'Which method should be used to protect Express APIs against Cross-Site Scripting (XSS) headers?',
        options: ['Helmet middleware', 'body-parser raw mode', 'cluster module', 'morgan logger'],
        correct_index: 0,
        explanation: 'Helmet sets security-related HTTP headers like CSP, X-Content-Type-Options, etc.'
      }
    ]
  },
  {
    id: 'assess-4',
    title: 'Data Structures & Algorithms',
    topic: 'Data Structures',
    difficulty: 'Advanced',
    time_limit_minutes: 30,
    passing_score: 70,
    questions_count: 5,
    questions: [
      {
        id: 1,
        question: 'What is the time complexity of searching in a balanced Binary Search Tree (BST)?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correct_index: 1,
        explanation: 'In balanced BSTs (AVL, Red-Black), the tree height is logarithmic, yielding O(log n) search time.'
      },
      {
        id: 2,
        question: 'Which data structure operates strictly on a Last-In, First-Out (LIFO) basis?',
        options: ['Queue', 'Stack', 'Heap', 'Deque'],
        correct_index: 1,
        explanation: 'A stack pushes and pops items exclusively from the top, obeying LIFO order.'
      },
      {
        id: 3,
        question: 'What is the worst-case time complexity of standard Quicksort?',
        options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
        correct_index: 1,
        explanation: 'Quicksort degrades to O(n²) when the pivot partitions elements in a maximally skewed manner.'
      },
      {
        id: 4,
        question: 'What is the average time complexity for lookup in a well-distributed Hash Table?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correct_index: 0,
        explanation: 'Hash tables deliver average O(1) time complexity for lookup, insertion, and deletion.'
      },
      {
        id: 5,
        question: 'Which algorithm finds the shortest path between two nodes in an unweighted graph?',
        options: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Prim Algorithm', 'Bellman-Ford'],
        correct_index: 0,
        explanation: 'BFS explores layer-by-layer, ensuring the first time a target node is visited is via the minimum number of edges.'
      }
    ]
  },
  {
    id: 'assess-5',
    title: 'Python Core Proficiency & Systems',
    topic: 'Python',
    difficulty: 'Intermediate',
    time_limit_minutes: 20,
    passing_score: 70,
    questions_count: 5,
    questions: [
      {
        id: 1,
        question: 'Which of the following data types in Python is mutable?',
        options: ['tuple', 'str', 'list', 'frozenset'],
        correct_index: 2,
        explanation: 'Lists and dictionaries are mutable in Python; tuples, strings, and frozensets are immutable.'
      },
      {
        id: 2,
        question: 'What does the "yield" keyword accomplish inside a Python function?',
        options: [
          'Terminates the program immediately',
          'Converts the function into a generator that produces values lazily on iteration',
          'Creates a daemon background thread',
          'Forces garbage collection'
        ],
        correct_index: 1,
        explanation: 'yield produces a generator object, suspending execution state until the next iteration.'
      },
      {
        id: 3,
        question: 'What is the average time complexity of looking up a key in a Python dict?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
        correct_index: 2,
        explanation: 'Python dictionaries use hash tables, offering O(1) average lookup and insertion.'
      },
      {
        id: 4,
        question: 'What is the Global Interpreter Lock (GIL) in CPython?',
        options: [
          'A database row-level locking mechanism',
          'A mutex preventing multiple native OS threads from executing Python bytecodes simultaneously in CPython',
          'A compiler flag for WebAssembly',
          'A file permission validator'
        ],
        correct_index: 1,
        explanation: 'The GIL prevents race conditions in CPython memory management by allowing only one native thread to run bytecode at once.'
      },
      {
        id: 5,
        question: 'How do Python decorators function conceptually?',
        options: [
          'Higher-order functions that accept a function, extend its behavior, and return a new callable',
          'CSS stylesheets for terminal output',
          'Type annotations for dataclasses',
          'Unit test mocks'
        ],
        correct_index: 0,
        explanation: 'Decorators wrap existing functions dynamically via closure syntax (@decorator).'
      }
    ]
  },
  {
    id: 'assess-6',
    title: 'SQL & Database Architecture',
    topic: 'SQL',
    difficulty: 'Intermediate',
    time_limit_minutes: 20,
    passing_score: 70,
    questions_count: 5,
    questions: [
      {
        id: 1,
        question: 'What is the primary difference between WHERE and HAVING in SQL?',
        options: [
          'WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY',
          'WHERE works on strings; HAVING works on integers',
          'HAVING is deprecated in SQL:2016',
          'WHERE is only valid with SELECT; HAVING is used with UPDATE'
        ],
        correct_index: 0,
        explanation: 'WHERE filters rows prior to aggregation; HAVING applies conditions to aggregated rows after GROUP BY.'
      },
      {
        id: 2,
        question: 'What are the four ACID properties in relational database transactions?',
        options: [
          'Atomicity, Consistency, Isolation, Durability',
          'Accuracy, Compression, Integrity, Distribution',
          'Authentication, Confidentiality, Indexing, Decoupling',
          'Aggregation, Concurrency, Isolation, Durability'
        ],
        correct_index: 0,
        explanation: 'ACID guarantees reliable transaction processing in database management systems.'
      },
      {
        id: 3,
        question: 'Which index type is the standard default for primary key columns in PostgreSQL and MySQL InnoDB?',
        options: ['Hash Index', 'B-Tree Index', 'GIN Index', 'BRIN Index'],
        correct_index: 1,
        explanation: 'B-Tree indexes maintain balanced sorted keys, supporting equality and range queries efficiently.'
      },
      {
        id: 4,
        question: 'What does a LEFT JOIN return when no match is found in the right table?',
        options: [
          'Excludes the row completely',
          'Returns the left row with NULL values for right table columns',
          'Throws a foreign key error',
          'Duplicates the row twice'
        ],
        correct_index: 1,
        explanation: 'LEFT JOIN keeps all rows from the left table, filling right-side columns with NULL if no match exists.'
      },
      {
        id: 5,
        question: 'What does database normalization to 3NF aim to eliminate?',
        options: [
          'Transitive functional dependencies and data redundancy',
          'Primary key requirements',
          'Foreign key relationships',
          'SQL query execution plans'
        ],
        correct_index: 0,
        explanation: '3NF removes transitive dependencies where non-key attributes depend on other non-key attributes.'
      }
    ]
  },
  {
    id: 'assess-7',
    title: 'HTML & CSS Responsive Engineering',
    topic: 'HTML/CSS',
    difficulty: 'Beginner',
    time_limit_minutes: 15,
    passing_score: 70,
    questions_count: 5,
    questions: [
      {
        id: 1,
        question: 'What are the four box model layers from innermost to outermost?',
        options: [
          'Content, Padding, Border, Margin',
          'Content, Margin, Border, Padding',
          'Margin, Border, Padding, Content',
          'Border, Padding, Content, Outline'
        ],
        correct_index: 0,
        explanation: 'The CSS box model layers are Content -> Padding -> Border -> Margin.'
      },
      {
        id: 2,
        question: 'What is the key difference between "display: none" and "visibility: hidden"?',
        options: [
          '"display: none" removes layout space entirely; "visibility: hidden" leaves blank layout space',
          'There is no visual or geometrical difference',
          '"visibility: hidden" works only on images',
          '"display: none" is an inline style only'
        ],
        correct_index: 0,
        explanation: 'display: none removes the element from rendering flow; visibility: hidden hides it while preserving space.'
      },
      {
        id: 3,
        question: 'What CSS rule creates an auto-responsive grid layout without media queries?',
        options: [
          'grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));',
          'grid-template-columns: 1fr 1fr 1fr;',
          'display: flex; flex-direction: auto;',
          'columns: 3 auto;'
        ],
        correct_index: 0,
        explanation: 'repeat(auto-fit, minmax(280px, 1fr)) wraps columns automatically as viewport width changes.'
      },
      {
        id: 4,
        question: 'Why are semantic elements like <main>, <nav>, and <section> preferred over <div>?',
        options: [
          'They communicate meaningful document structure to screen readers and search engines',
          'They execute JavaScript faster',
          'They are mandatory in HTML5 compilation',
          'They automatically style text'
        ],
        correct_index: 0,
        explanation: 'Semantic HTML aids accessibility (a11y) tree navigation and search engine indexing.'
      },
      {
        id: 5,
        question: 'What does "1rem" correspond to in standard browser styling?',
        options: [
          'Font size of the root <html> element (usually 16px)',
          'Font size of the immediate parent container',
          '1% of viewport width',
          '1 physical millimeter on screen'
        ],
        correct_index: 0,
        explanation: 'rem is relative to the root element (<html>) font size.'
      }
    ]
  },
  {
    id: 'assess-8',
    title: 'Machine Learning & AI Foundations',
    topic: 'Machine Learning',
    difficulty: 'Advanced',
    time_limit_minutes: 30,
    passing_score: 70,
    questions_count: 5,
    questions: [
      {
        id: 1,
        question: 'What is the definitive symptom of Overfitting during model training?',
        options: [
          'Very low training loss accompanied by high or increasing validation loss',
          'Both training and validation loss remain high',
          'Training converges in zero epochs',
          'All predictions are identical constants'
        ],
        correct_index: 0,
        explanation: 'Overfitting occurs when a model memorizes training noise and fails to generalize to unseen data.'
      },
      {
        id: 2,
        question: 'Which evaluation metric is best for severe class imbalance (e.g., 99% negative, 1% positive)?',
        options: ['Accuracy', 'Precision-Recall AUC / F1-Score', 'Mean Squared Error', 'R² Score'],
        correct_index: 1,
        explanation: 'Accuracy is misleading on imbalanced sets; F1-score balances precision and recall on positive cases.'
      },
      {
        id: 3,
        question: 'What is the core architectural innovation of the Transformer model (Vaswani et al.)?',
        options: [
          'Multi-Head Self-Attention mechanisms processing all tokens concurrently',
          'Deep Convolutional sliding windows',
          'Recurrent hidden memory states (LSTM/GRU)',
          'Markov Decision Processes'
        ],
        correct_index: 0,
        explanation: 'Self-attention calculates dynamic pairwise relationships across all tokens simultaneously in parallel.'
      },
      {
        id: 4,
        question: 'What purpose does Dropout serve during neural network training?',
        options: [
          'Regularization to prevent co-adaptation of neurons and curb overfitting',
          'Decreasing inference latency on CPU',
          'Normalizing weights to sum to 1',
          'Backpropagation acceleration'
        ],
        correct_index: 0,
        explanation: 'Dropout randomly deactivates a fraction of neurons during training to build resilient feature representations.'
      },
      {
        id: 5,
        question: 'What advantage does ReLU offer over Sigmoid in deep hidden layers?',
        options: [
          'Mitigates the vanishing gradient problem for positive inputs',
          'Limits output values between 0 and 1',
          'Guarantees smooth mathematical differentiability at zero',
          'Reduces model parameter count'
        ],
        correct_index: 0,
        explanation: 'ReLU has a constant gradient of 1 for positive inputs, preventing gradients from vanishing in deep networks.'
      }
    ]
  }
];

export default function SkillAssessmentPage() {
  const [assessments, setAssessments] = useState(sampleAssessments);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load from backend if available
  useEffect(() => {
    async function loadBackendAssessments() {
      try {
        const res = await api.get('/api/assessments');
        if (res.data?.assessments && res.data.assessments.length > 0) {
          // Merge or format questions
          setAssessments(res.data.assessments);
        }
      } catch (err) {
        console.warn('Using seeded assessment catalog', err);
      }
    }
    loadBackendAssessments();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!activeQuiz || quizResult) return;
    if (timeLeft <= 0) {
      handleCompleteQuiz();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeQuiz, timeLeft, quizResult]);

  const normalizeQuestions = (rawQuestions, topic = '') => {
    if (!rawQuestions || rawQuestions.length === 0) {
      const fallback = sampleAssessments.find(a => 
        a.topic?.toLowerCase() === topic.toLowerCase() || 
        topic.toLowerCase().includes(a.topic?.toLowerCase() || '')
      );
      return fallback ? fallback.questions : sampleAssessments[0].questions;
    }
    return rawQuestions.map((q, idx) => {
      let opts = [];
      if (Array.isArray(q.options)) {
        opts = q.options;
      } else if (typeof q.options === 'string') {
        try {
          const parsed = JSON.parse(q.options);
          opts = Array.isArray(parsed) ? parsed : Object.values(parsed);
        } catch (e) {
          opts = [q.options];
        }
      } else if (typeof q.options === 'object' && q.options !== null) {
        opts = Object.values(q.options);
      }

      let correctIdx = 0;
      if (typeof q.correct_index === 'number') {
        correctIdx = q.correct_index;
      } else if (typeof q.correct_answer === 'string') {
        const letterIdx = ['A', 'B', 'C', 'D'].indexOf(q.correct_answer.trim().toUpperCase());
        if (letterIdx >= 0) {
          correctIdx = letterIdx;
        } else {
          const matchIdx = opts.findIndex(o => o.toLowerCase() === q.correct_answer.toLowerCase());
          if (matchIdx >= 0) correctIdx = matchIdx;
        }
      }

      return {
        id: q.id || idx + 1,
        question: q.question || q.question_text || 'Technical Assessment Question',
        options: opts.length > 0 ? opts : ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_index: correctIdx,
        explanation: q.explanation || 'Review documentation and core references for full explanation.'
      };
    });
  };

  const startQuiz = async (quiz) => {
    let questions = quiz.questions || [];
    if (!questions || questions.length === 0) {
      if (quiz.id) {
        try {
          const res = await api.get(`/api/assessments/${quiz.id}`);
          if (res.data?.questions && res.data.questions.length > 0) {
            questions = res.data.questions;
          }
        } catch (e) {}
      }
    }

    const normalized = normalizeQuestions(questions, quiz.topic);

    setActiveQuiz({
      ...quiz,
      questions: normalized
    });
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setQuizResult(null);
    setTimeLeft((quiz.time_limit_minutes || 15) * 60);
  };

  const handleSelectAnswer = (qIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [qIndex]: optionIndex
    });
  };

  const handleCompleteQuiz = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);
    const questions = activeQuiz.questions || [];
    let correctCount = 0;

    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_index) {
        correctCount += 1;
      }
    });

    const scorePct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const passed = scorePct >= (activeQuiz.passing_score || 70);

    const resultObj = {
      score: scorePct,
      passed,
      correctCount,
      totalQuestions: questions.length,
      topic: activeQuiz.topic,
      difficulty: activeQuiz.difficulty,
      feedback: passed
        ? `Excellent performance! You proved solid comprehension in ${activeQuiz.topic}. Your skill verification confidence has been raised.`
        : `You scored ${scorePct}%. We recommend reviewing key core concepts and retaking this assessment after milestone completion.`
    };

    setQuizResult(resultObj);

    // Persist result to backend
    try {
      await api.post(`/api/assessments/${activeQuiz.id}/submit`, {
        score: scorePct,
        passed,
        topic: activeQuiz.topic,
        answers: selectedAnswers
      });
    } catch (err) {
      console.warn('Assessment result save note', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const topics = ['All', ...new Set(assessments.map((a) => a.topic))];
  const filteredAssessments =
    selectedTopic === 'All'
      ? assessments
      : assessments.filter((a) => a.topic.toLowerCase() === selectedTopic.toLowerCase());

  // 1. In-Quiz Mode
  if (activeQuiz && !quizResult) {
    const questions = activeQuiz.questions || [];
    const currentQ = questions[currentQIndex] || {};

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Quiz Header Bar */}
        <div className="glass-card p-5 flex items-center justify-between border-white/10">
          <div>
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
              {activeQuiz.topic} • {activeQuiz.difficulty}
            </span>
            <h2 className="text-lg font-bold text-white">{activeQuiz.title}</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 font-mono font-bold text-sm">
            <Clock className="w-4 h-4 text-violet-400" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-card p-6 sm:p-8 border-white/10">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 text-xs text-slate-400 font-semibold">
            <span>Question {currentQIndex + 1} of {questions.length}</span>
            <span>Passing Mark: {activeQuiz.passing_score}%</span>
          </div>

          <h3 className="text-lg font-semibold text-white leading-relaxed mb-6">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.options?.map((opt, oIdx) => {
              const isSelected = selectedAnswers[currentQIndex] === oIdx;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectAnswer(currentQIndex, oIdx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-violet-600/20 border-violet-500 text-white shadow-md shadow-violet-500/10'
                      : 'bg-white/[0.02] border-white/10 hover:border-violet-500/30 text-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-violet-400 bg-violet-500 text-white'
                        : 'border-slate-500'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm font-medium leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <button
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex(currentQIndex - 1)}
              className="btn-secondary text-xs flex items-center gap-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentQIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQIndex(currentQIndex + 1)}
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCompleteQuiz}
                disabled={submitting}
                className="btn-primary text-xs flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Submit Assessment'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Results Modal / View
  if (quizResult) {
    return (
      <div className="max-w-2xl mx-auto glass-card p-8 border-white/10 text-center space-y-6">
        <div
          className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center ${
            quizResult.passed
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}
        >
          {quizResult.passed ? (
            <CheckCircle2 className="w-10 h-10" />
          ) : (
            <XCircle className="w-10 h-10" />
          )}
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Assessment Evaluation
          </span>
          <h2 className="text-3xl font-black text-white mt-1">
            {quizResult.passed ? 'Assessment Passed!' : 'Needs Further Review'}
          </h2>
          <p className="text-slate-300 text-sm mt-3 max-w-md mx-auto leading-relaxed">
            {quizResult.feedback}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto p-4 rounded-xl bg-white/5 border border-white/10">
          <div>
            <div className="text-2xl font-black text-white">{quizResult.score}%</div>
            <div className="text-[11px] text-slate-400 uppercase mt-0.5">Final Score</div>
          </div>
          <div>
            <div className="text-2xl font-black text-violet-400">
              {quizResult.correctCount}/{quizResult.totalQuestions}
            </div>
            <div className="text-[11px] text-slate-400 uppercase mt-0.5">Correct</div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400">
              {quizResult.passed ? 'PASSED' : 'RETRY'}
            </div>
            <div className="text-[11px] text-slate-400 uppercase mt-0.5">Status</div>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => setActiveQuiz(null)}
            className="btn-secondary text-sm px-6"
          >
            Back to Assessment Catalog
          </button>
          <button
            onClick={() => startQuiz(activeQuiz)}
            className="btn-primary text-sm px-6 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Assessment List View
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Diagnostic Skill Assessments</h1>
          <p className="text-sm text-slate-400 mt-1">
            Scientifically validate your proficiency with timed technical evaluations.
          </p>
        </div>
      </div>

      {/* Topic Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTopic(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedTopic === t
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((quiz) => (
          <div
            key={quiz.id}
            className="glass-card p-6 border-white/10 hover:border-violet-500/40 hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                  {quiz.topic}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {quiz.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-snug">
                {quiz.title}
              </h3>

              <div className="flex items-center gap-4 text-xs text-slate-400 mt-4 py-3 border-y border-white/5">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-violet-400" />
                  <span>{quiz.time_limit_minutes} Mins</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pass: {quiz.passing_score}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{quiz.questions?.length || quiz.questions_count || 5} Questions</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => startQuiz(quiz)}
                className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 shadow-md shadow-violet-600/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Assessment</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
