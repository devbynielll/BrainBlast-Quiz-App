export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Category = 'General Knowledge' | 'Science' | 'Technology' | 'Gaming' | 'Pop Culture' | 'Anime';

export interface Question {
  id: string;
  text: string;
  category: Category;
  difficulty: Difficulty;
  correctAnswer: string;
  incorrectAnswers: string[];
}

export const QUESTION_POOL: Question[] = [
  {
    id: "q1",
    text: "What is the capital of France?",
    category: "General Knowledge",
    difficulty: "Easy",
    correctAnswer: "Paris",
    incorrectAnswers: ["London", "Berlin", "Madrid"]
  },
  {
    id: "q2",
    text: "What planet is closest to the Sun?",
    category: "Science",
    difficulty: "Easy",
    correctAnswer: "Mercury",
    incorrectAnswers: ["Venus", "Earth", "Mars"]
  },
  {
    id: "q3",
    text: "What does 'HTML' stand for?",
    category: "Technology",
    difficulty: "Medium",
    correctAnswer: "HyperText Markup Language",
    incorrectAnswers: ["HighText Machine Language", "HyperLoop Machine Language", "HyperText Multi Language"]
  },
  {
    id: "q4",
    text: "In Minecraft, what material is needed to craft a compass?",
    category: "Gaming",
    difficulty: "Medium",
    correctAnswer: "Iron + Redstone",
    incorrectAnswers: ["Gold + Redstone", "Iron + Coal", "Gold + Coal"]
  },
  {
    id: "q5",
    text: "Who directed the movie 'Avengers: Endgame'?",
    category: "Pop Culture",
    difficulty: "Easy",
    correctAnswer: "Russo Brothers",
    incorrectAnswers: ["Steven Spielberg", "Christopher Nolan", "James Cameron"]
  },
  {
    id: "q6",
    text: "What is the name of the main character in Naruto?",
    category: "Anime",
    difficulty: "Medium",
    correctAnswer: "Naruto Uzumaki",
    incorrectAnswers: ["Sasuke Uchiha", "Kakashi Hatake", "Itachi Uchiha"]
  },
  {
    id: "q7",
    text: "What is the chemical formula for water?",
    category: "Science",
    difficulty: "Hard",
    correctAnswer: "H2O",
    incorrectAnswers: ["HO", "H2O2", "OH2"]
  },
  {
    id: "q8",
    text: "How many continents are there on Earth?",
    category: "General Knowledge",
    difficulty: "Medium",
    correctAnswer: "7",
    incorrectAnswers: ["5", "6", "8"]
  },
  {
    id: "q9",
    text: "What does 'CPU' stand for?",
    category: "Technology",
    difficulty: "Easy",
    correctAnswer: "Central Processing Unit",
    incorrectAnswers: ["Computer Personal Unit", "Central Process Unit", "Central Processor Unit"]
  },
  {
    id: "q10",
    text: "In what year was the original Pokemon game released in Japan?",
    category: "Gaming",
    difficulty: "Easy",
    correctAnswer: "1996",
    incorrectAnswers: ["1994", "1995", "1997"]
  },
  {
    id: "q11",
    text: "Which streaming platform produced 'Stranger Things'?",
    category: "Pop Culture",
    difficulty: "Medium",
    correctAnswer: "Netflix",
    incorrectAnswers: ["Hulu", "Disney+", "HBO Max"]
  },
  {
    id: "q12",
    text: "What is the name of the hidden village in Naruto?",
    category: "Anime",
    difficulty: "Easy",
    correctAnswer: "Leaf Village",
    incorrectAnswers: ["Sand Village", "Cloud Village", "Mist Village"]
  },
  {
    id: "q13",
    text: "How many bones are in the adult human body?",
    category: "Science",
    difficulty: "Medium",
    correctAnswer: "206",
    incorrectAnswers: ["196", "216", "186"]
  },
  {
    id: "q14",
    text: "What is the longest river in the world?",
    category: "General Knowledge",
    difficulty: "Hard",
    correctAnswer: "Nile",
    incorrectAnswers: ["Amazon", "Yangtze", "Mississippi"]
  },
  {
    id: "q15",
    text: "What does 'DNS' stand for?",
    category: "Technology",
    difficulty: "Hard",
    correctAnswer: "Domain Name System",
    incorrectAnswers: ["Digital Network Service", "Data Node Server", "Direct Network System"]
  }
];

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
