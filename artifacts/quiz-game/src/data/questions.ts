export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Category =
  | 'Mathematics'
  | 'Science'
  | 'English'
  | 'Filipino'
  | 'ICT'
  | 'General Academic'
  | 'Research'
  | 'STEM'
  | 'ABM'
  | 'HUMSS'
  | 'TVL';

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
    text: "What is the value of π (pi) rounded to two decimal places?",
    category: "Mathematics",
    difficulty: "Easy",
    correctAnswer: "3.14",
    incorrectAnswers: ["2.71", "1.41", "3.41"]
  },
  {
    id: "q2",
    text: "Which of the following is a quadratic equation?",
    category: "Mathematics",
    difficulty: "Medium",
    correctAnswer: "x² + 5x + 6 = 0",
    incorrectAnswers: ["2x + 3 = 0", "x + y = 7", "3x - 4 = 0"]
  },
  {
    id: "q3",
    text: "What is the powerhouse of the cell?",
    category: "Science",
    difficulty: "Easy",
    correctAnswer: "Mitochondria",
    incorrectAnswers: ["Nucleus", "Ribosome", "Chloroplast"]
  },
  {
    id: "q4",
    text: "What type of bond involves the sharing of electrons between atoms?",
    category: "Science",
    difficulty: "Medium",
    correctAnswer: "Covalent bond",
    incorrectAnswers: ["Ionic bond", "Metallic bond", "Hydrogen bond"]
  },
  {
    id: "q5",
    text: "Which literary device is used when a non-human thing is given human qualities?",
    category: "English",
    difficulty: "Medium",
    correctAnswer: "Personification",
    incorrectAnswers: ["Metaphor", "Simile", "Alliteration"]
  },
  {
    id: "q6",
    text: "What is the correct term for the main idea of a paragraph?",
    category: "English",
    difficulty: "Easy",
    correctAnswer: "Topic sentence",
    incorrectAnswers: ["Thesis statement", "Conclusion", "Supporting detail"]
  },
  {
    id: "q7",
    text: "Ano ang tawag sa pagbabago ng isang salita upang tumutugon sa iba't ibang gamit nito?",
    category: "Filipino",
    difficulty: "Medium",
    correctAnswer: "Infleksyon",
    incorrectAnswers: ["Metapora", "Ugnayan", "Banghay"]
  },
  {
    id: "q8",
    text: "Sino ang itinuturing na 'Ama ng Wikang Pambansa' sa Pilipinas?",
    category: "Filipino",
    difficulty: "Easy",
    correctAnswer: "Lope K. Santos",
    incorrectAnswers: ["Jose Rizal", "Andres Bonifacio", "Emilio Jacinto"]
  },
  {
    id: "q9",
    text: "What does 'CPU' stand for in computer science?",
    category: "ICT",
    difficulty: "Easy",
    correctAnswer: "Central Processing Unit",
    incorrectAnswers: ["Computer Personal Unit", "Central Process Unit", "Core Processor Unit"]
  },
  {
    id: "q10",
    text: "Which software is best described as an 'open source' operating system?",
    category: "ICT",
    difficulty: "Medium",
    correctAnswer: "Linux",
    incorrectAnswers: ["Windows 11", "macOS", "iOS"]
  },
  {
    id: "q11",
    text: "What does HTML stand for in web development?",
    category: "ICT",
    difficulty: "Easy",
    correctAnswer: "HyperText Markup Language",
    incorrectAnswers: ["HyperText Machine Language", "HighText Markup Language", "HyperTransfer Markup Language"]
  },
  {
    id: "q12",
    text: "In the GAS strand, which subject focuses on analyzing social and cultural issues?",
    category: "General Academic",
    difficulty: "Medium",
    correctAnswer: "Social Science",
    incorrectAnswers: ["Applied Economics", "Disaster Readiness", "Organization and Management"]
  },
  {
    id: "q13",
    text: "What type of research collects data through numbers and statistics?",
    category: "Research",
    difficulty: "Easy",
    correctAnswer: "Quantitative Research",
    incorrectAnswers: ["Qualitative Research", "Action Research", "Descriptive Research"]
  },
  {
    id: "q14",
    text: "Which research method involves observing participants in their natural setting without interference?",
    category: "Research",
    difficulty: "Medium",
    correctAnswer: "Naturalistic Observation",
    incorrectAnswers: ["Survey Method", "Experimental Method", "Case Study"]
  },
  {
    id: "q15",
    text: "In STEM, which branch of mathematics deals with rates of change and motion?",
    category: "STEM",
    difficulty: "Hard",
    correctAnswer: "Calculus",
    incorrectAnswers: ["Algebra", "Trigonometry", "Statistics"]
  },
  {
    id: "q16",
    text: "What is the primary focus of the ABM (Accountancy, Business and Management) strand?",
    category: "ABM",
    difficulty: "Easy",
    correctAnswer: "Business and financial management skills",
    incorrectAnswers: ["Arts and design skills", "Information and communications technology", "Agricultural technology"]
  },
  {
    id: "q17",
    text: "Which ABM subject involves the recording and reporting of financial transactions?",
    category: "ABM",
    difficulty: "Medium",
    correctAnswer: "Fundamentals of Accountancy",
    incorrectAnswers: ["Business Mathematics", "Entrepreneurship", "Marketing"]
  },
  {
    id: "q18",
    text: "What does HUMSS stand for in Senior High School?",
    category: "HUMSS",
    difficulty: "Easy",
    correctAnswer: "Humanities and Social Sciences",
    incorrectAnswers: ["Human and Social Studies", "Humanities and Social Studies", "Human and Social Sciences"]
  },
  {
    id: "q19",
    text: "Which subject under HUMSS covers analyzing texts and language in social contexts?",
    category: "HUMSS",
    difficulty: "Medium",
    correctAnswer: "Creative Writing and Discourse",
    incorrectAnswers: ["Applied Economics", "Physical Education", "Earth Science"]
  },
  {
    id: "q20",
    text: "In TVL strand, which track focuses on food service and hospitality?",
    category: "TVL",
    difficulty: "Easy",
    correctAnswer: "Home Economics",
    incorrectAnswers: ["Information and Communications Technology", "Agri-Fishery Arts", "Industrial Arts"]
  },
  {
    id: "q21",
    text: "Which part of a research paper presents the interpretation of data and findings?",
    category: "Research",
    difficulty: "Medium",
    correctAnswer: "Results and Discussion",
    incorrectAnswers: ["Introduction", "Methodology", "Abstract"]
  },
  {
    id: "q22",
    text: "What is Newton's Second Law of Motion?",
    category: "STEM",
    difficulty: "Medium",
    correctAnswer: "F = ma (Force = Mass × Acceleration)",
    incorrectAnswers: ["For every action there is an equal and opposite reaction", "An object at rest stays at rest", "Energy cannot be created or destroyed"]
  },
  {
    id: "q23",
    text: "What is the term for the minimum wage in the Philippines governed by the DOLE?",
    category: "General Academic",
    difficulty: "Medium",
    correctAnswer: "Regional Minimum Wage",
    incorrectAnswers: ["National Standard Wage", "Basic Labor Compensation", "Statutory Employment Wage"]
  },
  {
    id: "q24",
    text: "In Mathematics, what is the Pythagorean theorem?",
    category: "Mathematics",
    difficulty: "Easy",
    correctAnswer: "a² + b² = c²",
    incorrectAnswers: ["a + b = c", "a² - b² = c²", "a × b = c²"]
  },
  {
    id: "q25",
    text: "What is the term for a variable that the researcher manipulates in an experiment?",
    category: "Research",
    difficulty: "Hard",
    correctAnswer: "Independent variable",
    incorrectAnswers: ["Dependent variable", "Control variable", "Extraneous variable"]
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
