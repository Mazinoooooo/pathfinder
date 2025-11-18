// src/utils/isRecommendationQuery.js
import Fuse from 'fuse.js';

export const courseList = [
  // Science & Mathematics
  "Applied Physics",
  "Physics",
  "Applied Mathematics",
  "Mathematics",
  "Applied Statistics",
  "Statistics",
  "Biochemistry",
  "Biology",
  "Botany",
  "Chemistry",
  "Environmental Science",
  "Geology",
  "Human Biology",
  "Marine Biology",
  "Marine Science",
  "Meteorology",
  "Molecular Biology and Biotechnology",

  // Information Technology & Computing
  "Computer Science",
  "Information Technology",
  "Information Systems",
  "Cyber Security",
  "Game Development and Animation",
  "Entertainment and Multimedia Computing",
  "Library and Information Science",

  // Engineering & Technology
  "Agricultural and Biosystems Engineering",
  "Ceramic Engineering",
  "Chemical Engineering",
  "Civil Engineering",
  "Computer Engineering",
  "Electrical Engineering",
  "Electronics and Communications Engineering",
  "Food Engineering",
  "Geodetic Engineering",
  "Industrial Engineering",
  "Manufacturing/Production Engineering",
  "Materials Engineering",
  "Mechanical Engineering",
  "Mechatronics Engineering",
  "Metallurgical Engineering",
  "Mining Engineering",
  "Petroleum Engineering",
  "Robotics Engineering",
  "Sanitary Engineering",
  "Structural Engineering",
  "Aircraft Maintenance Technology",
  "Aviation Technology",
  "Engineering Technology",
  "Industrial Technology",
  "Renewable Energy Engineering",
  "Disaster Risk Management",

  // Architecture & Arts
  "Architecture",
  "Landscape Architecture",
  "Fine Arts",
  "Interior Design",
  "Environmental Planning",

  // Business & Management
  "Accountancy",
  "Business Administration",
  "Financial Management",
  "Human Resource Management",
  "Marketing Management",
  "Management Accounting",
  "Business Analytics",
  "Hospitality Management",
  "Hotel and Restaurant Management",
  "Tourism Management",
  "Entrepreneurial Management",
  "Real Estate Management",

  // Health & Allied Health
  "Nursing",
  "Pharmacy",
  "Medical Technology",
  "Nutrition and Dietetics",
  "Physical Therapy",
  "Occupational Therapy",
  "Radiologic Technology",
  "Respiratory Therapy",
  "Midwifery",
  "Speech-Language Pathology",
  "Public Health",

  // Social Sciences & Humanities
  "Psychology",
  "Social Work",
  "Community Development",
  "Human Services (Guidance and Counseling)",
  "Peace Studies",
  "Indigenous Peoples Education",
  "Development Communication",
  "Journalism",
  "Mass Communication",
  "Broadcast Communication",
  "Advertising",
  "English",
  "Comparative Literature",

  // Education & Teacher Training
  "Early Childhood Education",
  "Elementary Education",
  "Secondary Education",
  "Special Needs Education",
  "Industrial Teacher Education",
  "Sports and Exercise Science",
  "Culture and Arts Education",
  "Technology and Livelihood Education",

  // Maritime & Transportation
  "Marine Engineering",
  "Marine Transportation",
  "Naval Architecture",

  // Interdisciplinary & Emerging Programs
  "Data Science and Analytics",
  "Agribusiness",
  "Agroforestry",
  "Food Technology",
  "Forestry",
  "Fisheries",
  "Packaging Engineering",
  "Disaster Risk Management",
  "Renewable/Sustainable Energy",

  // 2 Year Programms
  "Associate in Computer Technology",
  "Associate of Science in Information Technology",
  "Associate in Digital Design and Art",
  "Associate in Digital Entrepreneurship",
  "Associate in Radiologic Technology",
  "Associate in Aircraft Maintenance Technology",
  "Associate in Hotel and Restaurant Management",
  "Associate in Computer Secretarial",
  "Associate in Electromechanics Technology",
  "Associate in Automotive Servicing",
  "Associate in Web Development and Design",
  "Associate in Accounting Technology"

];

export const isRecommendationQuery = (text) => {
  const lower = text.toLowerCase();

    const fuse = new Fuse(courseList, {
    threshold: 0.3, // Lower = stricter match
  });
  
  const recommendationPhrases = [
    "what course should i take",
    "recommend a course for me",
    "suggest a college course",
    "i need help choosing a course",
    "what's a good course for me",
    "help me decide a course",
    "is this course right for me",
    "what fits my interest",
    "course that matches my personality",
    "best course for my shs track",
    "what college course fits me",
    "can i take this course",
    "is it possible to take this course",
    "am i allowed to take this in college",
    "is this course hard",
    "is this the right course for me",
    "is this course available for my track",
    "courses related to my strand",
    "what degree suits my background",
    "is this course compatible with my strand",
    "what should i take in college",
    "can i pursue this course",
    "is this a good course choice",
    "which course should i pursue",
    "i want to take this course, is it okay"
  ];

  const preparationPhrases = [
    "subjects i should be ready for",
    "what do i need to study",
    "what should i learn for this course",
    "skills required for this course",
    "what to expect in this course",
    "how to prepare for this course",
    "subjects included in this course",
    "what will i learn in this course",
    "what are the main topics",
    "is math important in this course",
    "do i need science for this",
    "what are the requirements for this course",
    "what is the curriculum like",
    "subjects related to this course",
    "academic preparation for college",
    "do i need to be good at math",
    "do i need to be good at science",
    "will this course need calculus",
    "does this involve programming",
    "should i take extra classes before college",
    "is this course math heavy"
  ];

  const comparisonPhrases = [
    "which course is better",
    "compare this course to",
    "should i choose between",
    "difference between this and that course",
    "is this better than that",
    "which has more opportunities",
    "what course has better job prospects",
    "which course fits my personality better",
    "should i shift courses",
    "how does this course compare to",
    "is this easier than"
  ];

  const allPhrases = [
    ...recommendationPhrases,
    ...preparationPhrases,
    ...comparisonPhrases
  ];

  const matchedPhrase = allPhrases.some(phrase => lower.includes(phrase));
  const matchedCourse = fuse.search(lower).length > 0;

  return matchedPhrase || matchedCourse;

};


// Checks if the message is academic misuse (like cheating or requesting schoolwork)
export const isAcademicMisuse = (text) => {
  const lower = text.toLowerCase().replace(/[^\w\s]/gi, "").trim();

  // Fuse.js setup for course matching
  const fuse = new Fuse(courseList.map(c => c.toLowerCase()), { threshold: 0.3 });

  // Predefined phrase categories
  const categories = {
    systemActions: ["create", "build", "develop", "design", "make", "generate", "construct", "propose"],
    systemObjects: ["system", "website", "app", "application", "program", "software", "project", "platform", "database"],
    systemContexts: ["for", "using", "based on", "with", "in", "about"],
    redFlagPhrases: [
    // Direct cheating/problem-solving
    "solve this", "calculate", "compute this", "what is the answer to",
    "show me the solution", "give me the answer", "help me solve",
    "solve for x", "find the value of", "explain the solution",
    "answer the following", "i need the answer to", "step by step answer",
    "how do you solve this", "what's the final answer",

    // Essay/writing misuse
    "write an essay", "generate an essay", "compose a paragraph",
    "essay about", "essay on", "give me a paragraph", "write a reaction paper",
    "make a position paper", "script for presentation", "speech about",
    "literary analysis", "critical essay", "summary of the story",
    "introduction for", "conclusion for", "write a review on",
    "create a storyboard", "write a synopsis", "compose a letter about",
    "expand this into an essay", "turn this outline into a full essay",

    // Test/homework/assignment
    "quiz answer", "test answer", "exam answer", "assignment answer",
    "project solution", "homework help", "schoolwork help",
    "do my assignment", "help me with my homework", "answer this question for me",
    "pls answer", "activity answer", "activity 1 answer", "worksheet answer",
    "help me with this output", "can you do this task for me", "what's the correct answer to",
    "send me the answers", "answer key for",

    // Academic-specific work types
    "summarize this", "summarize the chapter", "give me the summary of",
    "reaction paper", "critical analysis", "position paper", "literary analysis",
    "what is the formula for", "formula of", "step by step solution",
    "can you explain the theory behind", "explain the law of", "state the differences between",
    "compare and contrast", "differences of", "how to solve this in math",
    "how to interpret this data", "correct answer is", "give me detailed explanation",

    // Programming/code abuse
    "code this", "generate code", "write a program", "give me code for", "how to code",
    "python program for", "java program to", "arduino sketch", "html code for",
    "c++ program to", "can you fix this code", "debug this code for me",
    "write a function that", "complete this code",

    // 🧩 NEW: System / Thesis or Development misuse
    "create a system", "develop a system", "make a system for", "system proposal",
    "thesis system", "capstone system", "build me a website", "create a website",
    "system documentation", "design a database for", "database schema for",
    "backend code for", "frontend code for", "react code for", "firebase setup for",
    "create an app for", "mobile app for", "flutter app for", "android app for",
    "generate a project idea", "thesis title suggestion", "capstone proposal",
    "make a chatbot system", "develop this project", "can you code this project",
    "explain my system idea", "write my documentation", "system analysis for",
    "software requirement for", "help me build a system", "make my thesis project",
    "complete my system", "write srs for", "make my documentation", "finish my project",

    // Lab or experiment-specific
    "help me with my lab activity", "lab activity answer", "experiment answer",
    "solve this experiment", "data interpretation for lab", "procedure explanation for lab",
    "analyze this result", "hypothesis for", "conclusion for experiment",
    "observation table", "chemical reaction result", "laboratory worksheet",
    "lab report", "materials and procedure for", "what's the result of the experiment",

    // Other red flags
    "plagiarism", "copy this", "rephrase this for me", "paraphrase this",
    "make this unique", "turn this into my own words", "how to make this untraceable",
    "rewrite this to avoid detection", "how to bypass plagiarism checker",
    "spin this content", "ai detection bypass", "original version of this answer",
    "give me the full answer", "walk me through the solution",
    "what's the formula used", "rewrite this output", 
    "compose the full answer", "expand the answer", 
    "develop this into a full response","explain like a student", 
    "how to write a full answer", "give me the essay version", 
    "give detailed output for", "what should be the content of", 
    "generate the full explanation", "provide the complete response"
  ],

    contextSensitive: [
    "define", "definition of", "explain", "explain this concept", "explain this term",
    "summarize", "summarize this", "summarize the", "discussion of", "discuss",
    "clarify", "elaborate on", "differentiate", "compare and contrast",
    "what is the difference between", "how to answer", "how to respond to",
    "explain this topic", "how to explain", "how to summarize", "how to differentiate",
    "analysis of", "what is meant by", "overview of", "interpret the meaning of",
    "explain thoroughly", "describe in detail", "interpret this", "what does this mean",
    "what can you say about", "how would you interpret", "give insights on",
    "explain briefly", "short explanation about", "break down the meaning of",
    "restate in simpler terms", "what is the significance of", "why is this important in",
    "importance of", "meaning behind", "explain the implication of", "elaborate your answer", 
    "show understanding of", "what can be inferred from", 
    "interpret the meaning behind", "what's your understanding of", 
    "provide a response to", "how do you answer this in class", 
    "what's the takeaway from", "how should this be explained"
  ],

    keywords: [
    "homework", "assignment", "essay", "quiz", "test", "exam", "formula",
    "summary", "project", "worksheet", "activity", "paper", "module",
    "schoolwork", "task", "seatwork", "output", "reaction", "assessment",
    "reviewer", "questions", "experiment", "lab work", "subject matter", "chapter", "performance task", 
    "essay draft", "reflection", "diagnostic", "learning activity", "lesson", "subject discussion", 
    "graded task", "instruction", "explanation output"
  ]
  };

  // Helper functions
  const includesAny = (arr) => arr.some(word => lower.includes(word));
  const isSystemRequest = categories.systemActions.some(action =>
    categories.systemObjects.some(obj => lower.includes(action) && lower.includes(obj))
  );
  const looksLikeSystemRequest = isSystemRequest && includesAny(categories.systemContexts);

  const hasRedFlagPhrase = includesAny(categories.redFlagPhrases);
  const hasMisuseKeyword = includesAny(categories.keywords) &&
                           !lower.includes("course") &&
                           !lower.includes("subject") &&
                           !lower.includes("college");

  const courseMatch = fuse.search(lower);
  const isContextSensitiveMisuse = includesAny(categories.contextSensitive) && courseMatch.length === 0;

  return hasRedFlagPhrase || hasMisuseKeyword || isContextSensitiveMisuse || looksLikeSystemRequest;
};

export const getUserProfileString = (schoolType, track, courseDuration, tags) => `
User Profile:
- School Type: ${schoolType}
- SHS Track: ${track}
- Personality Traits: ${tags?.Personality?.join(", ") || "None"}
- Workstyle: ${tags?.Workstyle?.join(", ") || "None"}
- Interests: ${tags?.Interests?.join(", ") || "None"}
- Course Duration: ${courseDuration}
`;
