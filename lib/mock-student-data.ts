export interface Student {
  id: string
  name: string
  email: string
  avatar: string
  enrollmentDate: string
  stats: {
    labsCompleted: number
    averageQuizScore: number
    hoursSpent: number
    achievements: number
  }
  activityData: {
    date: string
    "Minutes Spent": number
    "Labs Completed": number
  }[]
  subjectProgress: {
    subject: string
    progress: number
  }[]
  skills: {
    name: string
    value: number
  }[]
}

export interface CompletedLab {
  id: string
  title: string
  category: string
  completedDate: string
  score: number
  image: string
  timeSpent: string
}

export interface UpcomingLab {
  id: string
  title: string
  category: string
  dueDate: string
  difficulty: string
  estimatedTime: string
  image: string
}

export interface Note {
  id: string
  title: string
  content: string
  labId: string
  labTitle: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface Quiz {
  id: string
  title: string
  description: string
  image: string
  questions: QuizQuestion[]
  completed: boolean
  score: number
  timeLimit: number
  rewards: {
    xp: number
    badge: string
  }
  relatedLab?: string
  bestScore: number
  category: string
}

export interface QuizQuestion {
  id: string
  question: string
  answers: string[]
  correctAnswerIndex: number
  explanation: string
}

export interface Activity {
  id: string
  type: string
  title: string
  timestamp: string
  details: Record<string, any>
}

export interface Achievement {
  id: string
  title: string
  description: string
  progress: number
  target: number
  completed: boolean
  image: string
  dateEarned: string | null
  xpEarned: number
  category?: string
}

export const mockStudentData: Student = {
  id: "student-1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: "/avatars/user-avatar.png",
  enrollmentDate: "2023-08-15",
  stats: {
    labsCompleted: 24,
    averageQuizScore: 88,
    hoursSpent: 65,
    achievements: 12,
  },
  activityData: [
    { date: "2024-01-01", "Minutes Spent": 30, "Labs Completed": 1 },
    { date: "2024-01-08", "Minutes Spent": 45, "Labs Completed": 2 },
    { date: "2024-01-15", "Minutes Spent": 60, "Labs Completed": 1 },
    { date: "2024-01-22", "Minutes Spent": 50, "Labs Completed": 2 },
    { date: "2024-01-29", "Minutes Spent": 75, "Labs Completed": 3 },
    { date: "2024-02-05", "Minutes Spent": 40, "Labs Completed": 1 },
    { date: "2024-02-12", "Minutes Spent": 55, "Labs Completed": 2 },
  ],
  subjectProgress: [
    { subject: "Physics", progress: 75 },
    { subject: "Chemistry", progress: 60 },
    { subject: "Mathematics", progress: 40 },
    { subject: "Computer Science", progress: 30 },
    { subject: "Biology", progress: 20 },
  ],
  skills: [
    { name: "Problem Solving", value: 85 },
    { name: "Critical Thinking", value: 92 },
    { name: "Data Analysis", value: 78 },
    { name: "Experiment Design", value: 65 },
    { name: "Coding", value: 50 },
  ],
}

mockStudentData.recentActivities = [
  {
    id: "activity-1",
    type: "lab_completed",
    title: "Completed Physics Lab",
    timestamp: "2024-02-15T14:30:00",
    details: { labName: "Simple Pendulum Experiment", score: 95 },
  },
  {
    id: "activity-2",
    type: "quiz_completed",
    title: "Passed Chemistry Quiz",
    timestamp: "2024-02-14T10:00:00",
    details: { quizName: "Acid-Base Titration", score: 80 },
  },
  {
    id: "activity-3",
    type: "achievement_earned",
    title: "Earned Physics Pioneer Badge",
    timestamp: "2024-02-10T16:45:00",
    details: { badgeName: "Physics Pioneer" },
  },
  {
    id: "activity-4",
    type: "note_added",
    title: "Added Note to Biology Lab",
    timestamp: "2024-02-05T09:15:00",
    details: { labName: "Cell Explorer" },
  },
]

mockStudentData.completedLabs = [
  {
    id: "lab-1",
    title: "Simple Pendulum Experiment",
    category: "Physics",
    completedDate: "2024-02-15",
    score: 95,
    image: "/pendulum-motion.png",
    timeSpent: "45",
  },
  {
    id: "lab-2",
    title: "Acid-Base Titration",
    category: "Chemistry",
    completedDate: "2024-02-10",
    score: 80,
    image: "/colorful-titration-experiment.png",
    timeSpent: "60",
  },
  {
    id: "lab-3",
    title: "Fractal Explorer",
    category: "Mathematics",
    completedDate: "2024-02-01",
    score: 70,
    image: "/kaleidoscopic-mandelbrot.png",
    timeSpent: "90",
  },
]

mockStudentData.upcomingLabs = [
  {
    id: "upcoming-1",
    title: "Wave Interference Patterns",
    category: "Physics",
    dueDate: "February 22, 2024",
    difficulty: "Intermediate",
    estimatedTime: "60 minutes",
    image: "/water-wave-interference.png",
  },
  {
    id: "upcoming-2",
    title: "Organic Chemistry Reactions",
    category: "Chemistry",
    dueDate: "February 28, 2024",
    difficulty: "Advanced",
    estimatedTime: "75 minutes",
    image: "/busy-chemistry-lab.png",
  },
  {
    id: "upcoming-3",
    title: "Chaos Theory",
    category: "Mathematics",
    dueDate: "March 5, 2024",
    difficulty: "Advanced",
    estimatedTime: "90 minutes",
    image: "/abstract-mathematical-concepts.png",
  },
]

mockStudentData.notes = [
  {
    id: "note-1",
    title: "Pendulum Motion Observations",
    content:
      "Observed that longer pendulum length results in a longer period. Air resistance seems to have a minor effect.",
    labId: "lab-1",
    labTitle: "Simple Pendulum Experiment",
    createdAt: "2024-02-15",
    updatedAt: "2024-02-15",
    tags: ["physics", "pendulum", "experiment"],
  },
  {
    id: "note-2",
    title: "Titration Endpoint Errors",
    content:
      "Difficult to determine the exact endpoint due to color change ambiguity. Need to use a more precise indicator.",
    labId: "lab-2",
    labTitle: "Acid-Base Titration",
    createdAt: "2024-02-10",
    updatedAt: "2024-02-11",
    tags: ["chemistry", "titration", "errors"],
  },
  {
    id: "note-3",
    title: "Mandelbrot Set Exploration",
    content:
      "Zoomed in to the Mandelbrot set and found repeating patterns at different scales. The boundary is infinitely complex!",
    labId: "lab-3",
    labTitle: "Fractal Explorer",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01",
    tags: ["mathematics", "fractals", "mandelbrot"],
  },
]

mockStudentData.quizzes = [
  {
    id: "quiz-1",
    title: "Physics Fundamentals",
    description: "Test your knowledge of basic physics concepts.",
    image: "/physics-lab.jpg",
    questions: [
      {
        id: "q1",
        question: "What is the SI unit of force?",
        options: ["Newton", "Joule", "Watt", "Pascal"],
        correctAnswerIndex: 0,
        explanation: "The SI unit of force is the Newton (N).",
      },
      {
        id: "q2",
        question: "What is the law of conservation of energy?",
        options: [
          "Energy cannot be created or destroyed",
          "Energy can be created but not destroyed",
          "Energy can be destroyed but not created",
          "Energy can be both created and destroyed",
        ],
        correctAnswerIndex: 0,
        explanation: "The law of conservation of energy states that energy cannot be created or destroyed.",
      },
    ],
    completed: true,
    score: 85,
    timeLimit: 15,
    rewards: {
      xp: 100,
      badge: "Physics Beginner",
    },
    relatedLab: "Simple Pendulum Experiment",
    bestScore: 85,
    category: "physics",
  },
  {
    id: "quiz-2",
    title: "Acid-Base Chemistry",
    description: "Test your understanding of acids, bases, and pH.",
    image: "/chemistry-lab.jpg",
    questions: [
      {
        id: "q3",
        question: "What is the pH of a neutral solution?",
        options: ["7", "0", "14", "Depends on the solution"],
        correctAnswerIndex: 0,
        explanation: "A neutral solution has a pH of 7.",
      },
      {
        id: "q4",
        question: "What is the definition of an acid?",
        options: [
          "A substance that donates protons",
          "A substance that accepts protons",
          "A substance that donates electrons",
          "A substance that accepts electrons",
        ],
        correctAnswerIndex: 0,
        explanation: "An acid is a substance that donates protons (H+).",
      },
    ],
    completed: false,
    score: 0,
    timeLimit: 10,
    rewards: {
      xp: 80,
      badge: "Chemistry Novice",
    },
    relatedLab: "Acid-Base Titration",
    bestScore: 0,
    category: "chemistry",
  },
]

mockStudentData.achievements = [
  {
    id: "achievement-1",
    title: "Physics Pioneer",
    description: "Complete 5 physics labs",
    progress: 100,
    target: 5,
    completed: true,
    image: "/physics-lab.jpg",
    dateEarned: "2024-02-15",
    xpEarned: 150,
    category: "physics",
  },
  {
    id: "achievement-2",
    title: "Chemistry Whiz",
    description: "Achieve a perfect score in 3 chemistry quizzes",
    progress: 100,
    target: 3,
    completed: true,
    image: "/chemistry-lab.jpg",
    dateEarned: "2024-02-10",
    xpEarned: 120,
    category: "chemistry",
  },
  {
    id: "achievement-3",
    title: "Math Master",
    description: "Complete all mathematics labs",
    progress: 70,
    target: 10,
    completed: false,
    image: "/math-lab.jpg",
    dateEarned: null,
    xpEarned: 0,
    category: "mathematics",
  },
  {
    id: "achievement-4",
    title: "Code Conqueror",
    description: "Complete 3 computer science labs",
    progress: 30,
    target: 3,
    completed: false,
    image: "/computer-lab.jpg",
    dateEarned: null,
    xpEarned: 0,
    category: "computer science",
  },
  {
    id: "achievement-5",
    title: "Biology Explorer",
    description: "Explore all cell structures in the Cell Explorer lab",
    progress: 100,
    target: 1,
    completed: true,
    image: "/biology-lab.jpg",
    dateEarned: "2024-02-05",
    xpEarned: 100,
    category: "biology",
  },
]

mockStudentData.labCompletionData = [
  { month: "Jan", completed: 5 },
  { month: "Feb", completed: 8 },
  { month: "Mar", completed: 6 },
  { month: "Apr", completed: 9 },
  { month: "May", completed: 7 },
  { month: "Jun", completed: 10 },
]

mockStudentData.timeSpentData = [
  { subject: "Physics", minutes: 120, color: "#4f46e5" },
  { subject: "Chemistry", minutes: 90, color: "#ec4899" },
  { subject: "Mathematics", minutes: 60, color: "#10b981" },
  { subject: "Computer Science", minutes: 45, color: "#06b6d4" },
  { subject: "Biology", minutes: 30, color: "#f43f5e" },
]
