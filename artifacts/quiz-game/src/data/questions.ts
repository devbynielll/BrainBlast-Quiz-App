export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionType = 'SHS' | 'Trivia';
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
  | 'TVL'
  | 'Pop Culture'
  | 'World History'
  | 'General Knowledge';

export interface Question {
  id: string;
  text: string;
  category: Category;
  type: QuestionType;
  difficulty: Difficulty;
  correctAnswer: string;
  incorrectAnswers: string[];
}

// ─── SHS Philippines Questions ───────────────────────────────────────────────

export const SHS_QUESTIONS: Question[] = [
  {
    id: "s1",
    text: "What is the value of π (pi) rounded to two decimal places?",
    category: "Mathematics", type: "SHS", difficulty: "Easy",
    correctAnswer: "3.14",
    incorrectAnswers: ["2.71", "1.41", "3.41"]
  },
  {
    id: "s2",
    text: "Which of the following is a quadratic equation?",
    category: "Mathematics", type: "SHS", difficulty: "Medium",
    correctAnswer: "x² + 5x + 6 = 0",
    incorrectAnswers: ["2x + 3 = 0", "x + y = 7", "3x - 4 = 0"]
  },
  {
    id: "s3",
    text: "What is the Pythagorean theorem?",
    category: "Mathematics", type: "SHS", difficulty: "Easy",
    correctAnswer: "a² + b² = c²",
    incorrectAnswers: ["a + b = c", "a² - b² = c²", "a × b = c²"]
  },
  {
    id: "s4",
    text: "What is the powerhouse of the cell?",
    category: "Science", type: "SHS", difficulty: "Easy",
    correctAnswer: "Mitochondria",
    incorrectAnswers: ["Nucleus", "Ribosome", "Chloroplast"]
  },
  {
    id: "s5",
    text: "What type of bond involves the sharing of electrons between atoms?",
    category: "Science", type: "SHS", difficulty: "Medium",
    correctAnswer: "Covalent bond",
    incorrectAnswers: ["Ionic bond", "Metallic bond", "Hydrogen bond"]
  },
  {
    id: "s6",
    text: "Newton's Second Law states that Force equals…",
    category: "STEM", type: "SHS", difficulty: "Medium",
    correctAnswer: "Mass × Acceleration",
    incorrectAnswers: ["Mass × Velocity", "Mass ÷ Acceleration", "Mass + Acceleration"]
  },
  {
    id: "s7",
    text: "In STEM, which branch of mathematics deals with rates of change and motion?",
    category: "STEM", type: "SHS", difficulty: "Hard",
    correctAnswer: "Calculus",
    incorrectAnswers: ["Algebra", "Trigonometry", "Statistics"]
  },
  {
    id: "s8",
    text: "Which literary device gives human qualities to non-human things?",
    category: "English", type: "SHS", difficulty: "Medium",
    correctAnswer: "Personification",
    incorrectAnswers: ["Metaphor", "Simile", "Alliteration"]
  },
  {
    id: "s9",
    text: "What is the correct term for the main idea of a paragraph?",
    category: "English", type: "SHS", difficulty: "Easy",
    correctAnswer: "Topic sentence",
    incorrectAnswers: ["Thesis statement", "Conclusion", "Supporting detail"]
  },
  {
    id: "s10",
    text: "Sino ang itinuturing na 'Ama ng Wikang Pambansa' sa Pilipinas?",
    category: "Filipino", type: "SHS", difficulty: "Easy",
    correctAnswer: "Lope K. Santos",
    incorrectAnswers: ["Jose Rizal", "Andres Bonifacio", "Emilio Jacinto"]
  },
  {
    id: "s11",
    text: "Ano ang tawag sa pagbabago ng isang salita upang tumutugon sa iba't ibang gamit nito?",
    category: "Filipino", type: "SHS", difficulty: "Hard",
    correctAnswer: "Infleksyon",
    incorrectAnswers: ["Metapora", "Ugnayan", "Banghay"]
  },
  {
    id: "s12",
    text: "What does 'CPU' stand for in computer science?",
    category: "ICT", type: "SHS", difficulty: "Easy",
    correctAnswer: "Central Processing Unit",
    incorrectAnswers: ["Computer Personal Unit", "Central Process Unit", "Core Processor Unit"]
  },
  {
    id: "s13",
    text: "Which of the following is an open source operating system?",
    category: "ICT", type: "SHS", difficulty: "Medium",
    correctAnswer: "Linux",
    incorrectAnswers: ["Windows 11", "macOS", "iOS"]
  },
  {
    id: "s14",
    text: "What does HTML stand for in web development?",
    category: "ICT", type: "SHS", difficulty: "Easy",
    correctAnswer: "HyperText Markup Language",
    incorrectAnswers: ["HyperText Machine Language", "HighText Markup Language", "HyperTransfer Markup Language"]
  },
  {
    id: "s15",
    text: "What type of research collects data through numbers and statistics?",
    category: "Research", type: "SHS", difficulty: "Easy",
    correctAnswer: "Quantitative Research",
    incorrectAnswers: ["Qualitative Research", "Action Research", "Descriptive Research"]
  },
  {
    id: "s16",
    text: "Which part of a research paper presents interpretation of data and findings?",
    category: "Research", type: "SHS", difficulty: "Medium",
    correctAnswer: "Results and Discussion",
    incorrectAnswers: ["Introduction", "Methodology", "Abstract"]
  },
  {
    id: "s17",
    text: "What is the term for a variable that the researcher manipulates in an experiment?",
    category: "Research", type: "SHS", difficulty: "Hard",
    correctAnswer: "Independent variable",
    incorrectAnswers: ["Dependent variable", "Control variable", "Extraneous variable"]
  },
  {
    id: "s18",
    text: "What does HUMSS stand for in Senior High School?",
    category: "HUMSS", type: "SHS", difficulty: "Easy",
    correctAnswer: "Humanities and Social Sciences",
    incorrectAnswers: ["Human and Social Studies", "Humanities and Social Studies", "Human and Social Sciences"]
  },
  {
    id: "s19",
    text: "Which ABM subject involves recording and reporting of financial transactions?",
    category: "ABM", type: "SHS", difficulty: "Medium",
    correctAnswer: "Fundamentals of Accountancy",
    incorrectAnswers: ["Business Mathematics", "Entrepreneurship", "Marketing"]
  },
  {
    id: "s20",
    text: "What is the primary focus of the ABM strand?",
    category: "ABM", type: "SHS", difficulty: "Easy",
    correctAnswer: "Business and financial management skills",
    incorrectAnswers: ["Arts and design skills", "Information and communications technology", "Agricultural technology"]
  },
  {
    id: "s21",
    text: "In TVL strand, which track focuses on food service and hospitality?",
    category: "TVL", type: "SHS", difficulty: "Easy",
    correctAnswer: "Home Economics",
    incorrectAnswers: ["ICT", "Agri-Fishery Arts", "Industrial Arts"]
  },
  {
    id: "s22",
    text: "In the GAS strand, which subject covers analyzing social and cultural issues?",
    category: "General Academic", type: "SHS", difficulty: "Medium",
    correctAnswer: "Social Science",
    incorrectAnswers: ["Applied Economics", "Disaster Readiness", "Organization and Management"]
  },
  {
    id: "s23",
    text: "Which research method involves observing participants in their natural setting?",
    category: "Research", type: "SHS", difficulty: "Medium",
    correctAnswer: "Naturalistic Observation",
    incorrectAnswers: ["Survey Method", "Experimental Method", "Case Study"]
  },
  {
    id: "s24",
    text: "What is the minimum wage in the Philippines governed by?",
    category: "General Academic", type: "SHS", difficulty: "Medium",
    correctAnswer: "DOLE – Regional Tripartite Wages Board",
    incorrectAnswers: ["National Labor Council", "Bureau of Employment", "PhilSAGA Commission"]
  },
  {
    id: "s25",
    text: "Which subject under HUMSS covers analyzing texts and language in social contexts?",
    category: "HUMSS", type: "SHS", difficulty: "Hard",
    correctAnswer: "Creative Writing and Discourse",
    incorrectAnswers: ["Applied Economics", "Physical Education", "Earth Science"]
  },
];

// ─── General Trivia Questions ─────────────────────────────────────────────────

export const TRIVIA_QUESTIONS: Question[] = [
  {
    id: "t1",
    text: "What is the fastest land animal on Earth?",
    category: "General Knowledge", type: "Trivia", difficulty: "Easy",
    correctAnswer: "Cheetah",
    incorrectAnswers: ["Lion", "Leopard", "Greyhound"]
  },
  {
    id: "t2",
    text: "How many planets are in our solar system?",
    category: "Science", type: "Trivia", difficulty: "Easy",
    correctAnswer: "8",
    incorrectAnswers: ["7", "9", "10"]
  },
  {
    id: "t3",
    text: "Who was the first human to walk on the Moon?",
    category: "World History", type: "Trivia", difficulty: "Easy",
    correctAnswer: "Neil Armstrong",
    incorrectAnswers: ["Buzz Aldrin", "Yuri Gagarin", "Michael Collins"]
  },
  {
    id: "t4",
    text: "What element has the chemical symbol Au?",
    category: "Science", type: "Trivia", difficulty: "Medium",
    correctAnswer: "Gold",
    incorrectAnswers: ["Silver", "Copper", "Aluminum"]
  },
  {
    id: "t5",
    text: "What gas do plants absorb during photosynthesis?",
    category: "Science", type: "Trivia", difficulty: "Easy",
    correctAnswer: "Carbon Dioxide (CO₂)",
    incorrectAnswers: ["Oxygen", "Nitrogen", "Hydrogen"]
  },
  {
    id: "t6",
    text: "Which animated movie features the song 'Let It Go'?",
    category: "Pop Culture", type: "Trivia", difficulty: "Easy",
    correctAnswer: "Frozen",
    incorrectAnswers: ["Tangled", "Brave", "Moana"]
  },
  {
    id: "t7",
    text: "Who founded Facebook?",
    category: "General Knowledge", type: "Trivia", difficulty: "Easy",
    correctAnswer: "Mark Zuckerberg",
    incorrectAnswers: ["Elon Musk", "Jeff Bezos", "Steve Jobs"]
  },
  {
    id: "t8",
    text: "What is the largest country in the world by area?",
    category: "General Knowledge", type: "Trivia", difficulty: "Easy",
    correctAnswer: "Russia",
    incorrectAnswers: ["China", "Canada", "United States"]
  },
  {
    id: "t9",
    text: "In which year did World War II end?",
    category: "World History", type: "Trivia", difficulty: "Medium",
    correctAnswer: "1945",
    incorrectAnswers: ["1944", "1946", "1943"]
  },
  {
    id: "t10",
    text: "What is the square root of 144?",
    category: "Mathematics", type: "Trivia", difficulty: "Easy",
    correctAnswer: "12",
    incorrectAnswers: ["11", "13", "14"]
  },
  {
    id: "t11",
    text: "How many hearts does an octopus have?",
    category: "Science", type: "Trivia", difficulty: "Hard",
    correctAnswer: "3",
    incorrectAnswers: ["1", "2", "4"]
  },
  {
    id: "t12",
    text: "Which country invented sushi?",
    category: "General Knowledge", type: "Trivia", difficulty: "Medium",
    correctAnswer: "Japan",
    incorrectAnswers: ["China", "South Korea", "Vietnam"]
  },
  {
    id: "t13",
    text: "Who sang the hit song 'Blinding Lights'?",
    category: "Pop Culture", type: "Trivia", difficulty: "Easy",
    correctAnswer: "The Weeknd",
    incorrectAnswers: ["Drake", "Justin Bieber", "Post Malone"]
  },
  {
    id: "t14",
    text: "What is approximately the speed of light?",
    category: "Science", type: "Trivia", difficulty: "Hard",
    correctAnswer: "300,000 km/s",
    incorrectAnswers: ["150,000 km/s", "500,000 km/s", "1,000,000 km/s"]
  },
  {
    id: "t15",
    text: "Which planet is known as the Red Planet?",
    category: "Science", type: "Trivia", difficulty: "Easy",
    correctAnswer: "Mars",
    incorrectAnswers: ["Jupiter", "Saturn", "Venus"]
  },
  {
    id: "t16",
    text: "What is 15% of 200?",
    category: "Mathematics", type: "Trivia", difficulty: "Medium",
    correctAnswer: "30",
    incorrectAnswers: ["25", "35", "20"]
  },
  {
    id: "t17",
    text: "Which artist painted the Mona Lisa?",
    category: "World History", type: "Trivia", difficulty: "Easy",
    correctAnswer: "Leonardo da Vinci",
    incorrectAnswers: ["Michelangelo", "Raphael", "Pablo Picasso"]
  },
  {
    id: "t18",
    text: "What programming language is primarily used to style web pages?",
    category: "General Knowledge", type: "Trivia", difficulty: "Medium",
    correctAnswer: "CSS",
    incorrectAnswers: ["JavaScript", "Python", "HTML"]
  },
];

// ─── Combined Pool ────────────────────────────────────────────────────────────

export const QUESTION_POOL: Question[] = [...SHS_QUESTIONS, ...TRIVIA_QUESTIONS];

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
