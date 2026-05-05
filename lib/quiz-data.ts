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
  // 'cover' fills the image container by cropping; 'contain' shows the full image
  // letterboxed. Use 'contain' for compositions with content near the edges
  // (e.g. icon callouts) so nothing important gets cropped.
  imageFit?: "cover" | "contain";
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
    question: "Which type of catheter do you use?",
    subtitle: "If you're not sure, select the option that sounds most like yours — or choose \u201cI'm not sure\u201d.",
    options: [
      { id: "2a", label: "Intermittent catheter (ISC)", value: "isc" },
      { id: "2b", label: "Indwelling catheter (Foley / urethral)", value: "indwelling" },
      { id: "2c", label: "Suprapubic catheter", value: "suprapubic" },
      { id: "2d", label: "Catheter valve", value: "valve" },
      { id: "2e", label: "I'm not sure what type I use", value: "not_sure" }
    ],
    image: "/images/quiz-step2-catheter-type.png",
    imageFit: "contain"
  },
  {
    id: 3,
    stage: 1,
    stageTitle: "Your Situation",
    question: "How many times a day do you typically catheterise?",
    options: [
      { id: "3a", label: "1–2 times", value: "1-2" },
      { id: "3b", label: "3–4 times", value: "3-4" },
      { id: "3c", label: "5–6 times", value: "5-6" },
      { id: "3d", label: "More than 6 times", value: "6+" }
    ],
    image: "/images/quiz-step2-routine.png"
  },
  {
    id: 4,
    stage: 2,
    stageTitle: "Your Biggest Frustrations",
    question: "What frustrates you most about your current catheter routine?",
    subtitle: "Choose the one that best describes your experience",
    options: [
      { id: "4a", label: "Discomfort or pain during use", value: "discomfort" },
      { id: "4b", label: "Worrying about infections or UTIs", value: "uti_worry" },
      { id: "4c", label: "The hassle of reordering and managing prescriptions", value: "reorder_hassle" },
      { id: "4d", label: "Lack of discretion — carrying, using, or disposing of catheters in public", value: "discretion" },
      { id: "4e", label: "Feeling like I don't have a choice in what I'm given", value: "no_choice" }
    ],
    image: "/images/quiz-step3-frustrated.png"
  },
  {
    id: 5,
    stage: 2,
    stageTitle: "Your Biggest Frustrations",
    question: "Have you ever wanted to try a different catheter but felt unsure how to go about it?",
    options: [
      { id: "5a", label: "Yes — I didn't know I could ask for something different", value: "unaware_can_ask" },
      { id: "5b", label: "Yes — I asked but was told to stick with what I have", value: "asked_denied" },
      { id: "5c", label: "No — I'm happy with what I use", value: "happy" },
      { id: "5d", label: "I didn't realise there were other options", value: "unaware_options" }
    ],
    image: "/images/quiz-step4-shrug.png"
  },
  {
    id: 6,
    stage: 3,
    stageTitle: "Your Lifestyle & Priorities",
    question: "Where do you find it hardest to manage your catheter routine?",
    options: [
      { id: "6a", label: "At work or during my commute", value: "work" },
      { id: "6b", label: "When travelling or on holiday", value: "travel" },
      { id: "6c", label: "At social events or when out with friends/family", value: "social" },
      { id: "6d", label: "I mostly manage at home and that's fine", value: "home" }
    ],
    image: "/images/quiz-step5-lifestyle.png"
  },
  {
    id: 7,
    stage: 3,
    stageTitle: "Your Lifestyle & Priorities",
    question: "What would make the biggest difference to your catheter experience?",
    options: [
      { id: "7a", label: "More comfort and less irritation", value: "comfort" },
      { id: "7b", label: "A simpler, hassle-free way to reorder my supplies", value: "easy_reorder" },
      { id: "7c", label: "Better hygiene and fewer infection worries", value: "hygiene" },
      { id: "7d", label: "More discreet products and packaging", value: "discretion" },
      { id: "7e", label: "Knowing I'm using the best option for my needs", value: "best_option" }
    ],
    image: "/images/quiz-step6-priority.png"
  },
  {
    id: 8,
    stage: 4,
    stageTitle: "Your Current Supply",
    question: "How do you currently receive your catheter supplies?",
    options: [
      { id: "8a", label: "I collect them from my GP surgery or pharmacy", value: "collect" },
      { id: "8b", label: "They're delivered to my home by a specialist supplier", value: "home_delivery" },
      { id: "8c", label: "A mix — sometimes I collect, sometimes they're delivered", value: "mix" },
      { id: "8d", label: "I'm not sure — someone else manages this for me", value: "unsure" }
    ],
    image: "/images/quiz-step7-supply.png"
  },
  {
    id: 9,
    stage: 4,
    stageTitle: "Your Current Supply",
    question: "How satisfied are you with your current catheter supplier or provider?",
    options: [
      { id: "9a", label: "1 — Very dissatisfied", value: "1" },
      { id: "9b", label: "2 — Dissatisfied", value: "2" },
      { id: "9c", label: "3 — Neutral", value: "3" },
      { id: "9d", label: "4 — Satisfied", value: "4" },
      { id: "9e", label: "5 — Very satisfied", value: "5" }
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
