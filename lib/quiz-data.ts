export type QuizOption = {
  id: string;
  label: string;
  value: string;
};

export type QuizQuestion = {
  id: number;
  stage: number;
  stageTitle: string;
  question: string;
  subtitle?: string;
  options: QuizOption[];
  image: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    stage: 1,
    stageTitle: "Your Situation",
    question: "How long have you been using intermittent catheters?",
    options: [
      { id: "1a", label: "Less than 3 months — I'm still getting used to it", value: "new" },
      { id: "1b", label: "3–12 months — I'm finding my routine", value: "settling" },
      { id: "1c", label: "1–5 years — it's part of my life now", value: "established" },
      { id: "1d", label: "5+ years — I've been doing this a long time", value: "veteran" }
    ],
    image: "/images/quiz-step1-thinking.png"
  },
  {
    id: 2,
    stage: 1,
    stageTitle: "Your Situation",
    question: "How many times a day do you typically catheterise?",
    options: [
      { id: "2a", label: "1–2 times", value: "1-2" },
      { id: "2b", label: "3–4 times", value: "3-4" },
      { id: "2c", label: "5–6 times", value: "5-6" },
      { id: "2d", label: "More than 6 times", value: "6+" }
    ],
    image: "/images/quiz-step2-routine.png"
  },
  {
    id: 3,
    stage: 2,
    stageTitle: "Your Biggest Frustrations",
    question: "What frustrates you most about your current catheter routine?",
    subtitle: "Choose the one that best describes your experience",
    options: [
      { id: "3a", label: "Discomfort or pain during use", value: "discomfort" },
      { id: "3b", label: "Worrying about infections or UTIs", value: "uti_worry" },
      { id: "3c", label: "The hassle of reordering and managing prescriptions", value: "reorder_hassle" },
      { id: "3d", label: "Lack of discretion — carrying, using, or disposing of catheters in public", value: "discretion" },
      { id: "3e", label: "Feeling like I don't have a choice in what I'm given", value: "no_choice" }
    ],
    image: "/images/quiz-step3-frustrated.png"
  },
  {
    id: 4,
    stage: 2,
    stageTitle: "Your Biggest Frustrations",
    question: "Have you ever wanted to try a different catheter but felt unsure how to go about it?",
    options: [
      { id: "4a", label: "Yes — I didn't know I could ask for something different", value: "unaware_can_ask" },
      { id: "4b", label: "Yes — I asked but was told to stick with what I have", value: "asked_denied" },
      { id: "4c", label: "No — I'm happy with what I use", value: "happy" },
      { id: "4d", label: "I didn't realise there were other options", value: "unaware_options" }
    ],
    image: "/images/quiz-step4-shrug.png"
  },
  {
    id: 5,
    stage: 3,
    stageTitle: "Your Lifestyle & Priorities",
    question: "Where do you find it hardest to manage your catheter routine?",
    options: [
      { id: "5a", label: "At work or during my commute", value: "work" },
      { id: "5b", label: "When travelling or on holiday", value: "travel" },
      { id: "5c", label: "At social events or when out with friends/family", value: "social" },
      { id: "5d", label: "I mostly manage at home and that's fine", value: "home" }
    ],
    image: "/images/quiz-step5-lifestyle.png"
  },
  {
    id: 6,
    stage: 3,
    stageTitle: "Your Lifestyle & Priorities",
    question: "What would make the biggest difference to your catheter experience?",
    options: [
      { id: "6a", label: "More comfort and less irritation", value: "comfort" },
      { id: "6b", label: "A simpler, hassle-free way to reorder my supplies", value: "easy_reorder" },
      { id: "6c", label: "Better hygiene and fewer infection worries", value: "hygiene" },
      { id: "6d", label: "More discreet products and packaging", value: "discretion" },
      { id: "6e", label: "Knowing I'm using the best option for my needs", value: "best_option" }
    ],
    image: "/images/quiz-step6-priority.png"
  },
  {
    id: 7,
    stage: 4,
    stageTitle: "Your Current Supply",
    question: "How do you currently receive your catheter supplies?",
    options: [
      { id: "7a", label: "I collect them from my GP surgery or pharmacy", value: "collect" },
      { id: "7b", label: "They're delivered to my home by a specialist supplier", value: "home_delivery" },
      { id: "7c", label: "A mix — sometimes I collect, sometimes they're delivered", value: "mix" },
      { id: "7d", label: "I'm not sure — someone else manages this for me", value: "unsure" }
    ],
    image: "/images/quiz-step7-supply.png"
  },
  {
    id: 8,
    stage: 4,
    stageTitle: "Your Current Supply",
    question: "How satisfied are you with your current catheter supplier or provider?",
    options: [
      { id: "8a", label: "1 — Very dissatisfied", value: "1" },
      { id: "8b", label: "2 — Dissatisfied", value: "2" },
      { id: "8c", label: "3 — Neutral", value: "3" },
      { id: "8d", label: "4 — Satisfied", value: "4" },
      { id: "8e", label: "5 — Very satisfied", value: "5" }
    ],
    image: "/images/quiz-step8-openness.png"
  }
];

export const quizLabelByQuestionAndValue = quizQuestions.reduce<Record<number, Record<string, string>>>(
  (acc, question) => {
    acc[question.id] = question.options.reduce<Record<string, string>>((optionMap, option) => {
      optionMap[option.value] = option.label;
      return optionMap;
    }, {});
    return acc;
  },
  {}
);
