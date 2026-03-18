// ─── Shared Question types & Data ────────────────────────────────────────────
export type QType = "radio" | "checkbox" | "textarea" | "radio-other" | "checkbox-other" | "text-input" | "rating" | "text-compare" | "text-display"
export interface SubQuestion {
  id: string
  label: string
  options: readonly string[]
}
export interface Question {
  id: string
  section: string
  type: QType
  label: string
  sub: string
  options?: readonly string[]
  placeholder?: string
  required: boolean
  accent: string
  accent2: string
  inputType?: string
  minLabel?: string
  maxLabel?: string
  // For text-compare type
  textContent?: string
  textLabel?: string
  subQuestions?: SubQuestion[]
}

export const DEMO_COUNT = 5;

export const FORM_BASE = "https://docs.google.com/forms/d/e/1FAIpQLSd-mzQXe4BIt6YYbqO-U7IOnjCyQ1dmY1P1k7s6vhacdfLxIw/formResponse";

export const FORM_MAP: Record<string, string> = {
  "demo-phone": "entry.717101430",
  "demo-gender": "entry.798394087",
  "demo-age": "entry.47830583",
  "demo-education": "entry.2083655778",
  "demo-field": "entry.619390488",
  q1: "entry.296797076",
  q2: "entry.261381429",
  q3: "entry.95330015",
  q4: "entry.134092811",
  q5: "entry.605011309",
  q6: "entry.965800260",
  q7: "entry.1945943633",
  q8: "entry.998586002",
  q9: "entry.886929303",
  q10: "entry.1404740189",
  q11: "entry.791437058",
  q12: "entry.235163170",
  q13: "entry.1666772442",
  q14: "entry.1886876082",
  q15: "entry.1129077419",
  q16: "entry.1155979803",
  q17: "entry.671122580",
  q18: "entry.580089303",
  q19: "entry.2070190031",
  q20: "entry.2104612883",
}

export const AR_TO_EN_MAP: Record<string, string> = {
  // demo-gender
  "ذكر": "Male",
  "أنثى": "Female",
  // demo-age
  "١٦ - ١٩": "16 - 19",
  "٢٠ - ٢٣": "20 - 23",
  "٢٤ أو أكبر": "24 or above",
  // demo-education
  "ثانوية عامة": "High School",
  "جامعة": "University",
  "خريج": "Graduated",
  // demo-field
  "علم البيانات": "Data Science",
  "هندسة": "Engineering",
  "طب": "Medicine",
  "تجارة": "Business",
  "فنون": "Arts",
  "أخرى": "Other",
  // q1 — Do you like AI writing style?
  "بحبه جداً": "I like it very much",
  "بحبه لحد ما": "I somewhat like it",
  "محايد": "Neutral",
  "مش بحبه": "I do not like it",
  "بفضل ماستخدمهوش": "I prefer not to use it",
  // q2 & q16 — Which writing style gives more trust?
  "كتابة الإنسان": "Human writing",
  "كتابة الذكاء الاصطناعي": "AI writing",
  "الاتنين بالتساوي": "Both equally",
  "حسب الموضوع": "It depends on the topic",
  // q3 — Main advantages of AI in writing (checkbox)
  "السرعة في إتمام المهام": "Speed in completing tasks",
  "توفير الجهد": "Saving effort",
  "صياغة اللغة/الأسلوب": "Language formulation/style",
  "مفيش حاجة مميزة": "Nothing special",
  "المساعدة في توليد الأفكار": "Helps generate ideas",
  // q4 — Can AI be relied upon?
  "في الكتابة الرسمية بس": "Only in formal writing",
  "في الكتابة غير الرسمية بس": "Only in informal writing",
  "في الاتنين": "In both",
  "مينفعش يُعتمد عليه": "It cannot be relied upon",
  // q5 — AI writing repetitive?
  "دايماً": "Always",
  "غالباً": "Often",
  "أحياناً": "Sometimes",
  "نادراً": "Rarely",
  "مش حاسس بكده": "I do not feel that",
  // q6 — AI convey emotions?
  "أيوه، بشكل كبير": "Yes, to a great extent",
  "أيوه، بشكل متوسط": "Yes, to a moderate extent",
  "بشكل محدود": "To a limited extent",
  "لأ، مش بيقدر ينقل مشاعر": "No, it cannot convey emotions",
  "مش متأكد": "Not sure",
  // q9 — Does AI writing need editing?
  "عمري ما استخدمتها": "I have never used it",
  // q10 — What distinguishes human writing? (checkbox)
  "التعبير العاطفي": "Emotional expression",
  "الأسلوب الشخصي": "Personal style",
  "الإبداع والخيال": "Creativity and imagination",
  "خبرة الكاتب وفهمه للسياق": "Writer's experience and contextual understanding",
  // q11/q13 — Text clarity
  "واضح جداً وأسلوبه حلو": "Very clear with a good style",
  "واضح لحد ما": "Moderately clear",
  "مش واضح قوي": "Not very clear",
  "مش عارف": "I do not know",
  // q12/q14 — Who wrote it?
  "الإنسان": "Human",
  "الذكاء الاصطناعي": "Artificial Intelligence",
  // q15 — AI tools (checkbox)
  "مش بستخدم أدوات ذكاء اصطناعي": "I do not use AI tools",
}

export const ALL_STEPS_EN: Question[] = [
  // ──────────── DEMOGRAPHICS: Tell Us About You ─────────────────────────
  {
    id: "demo-phone", section: "Tell Us About You", type: "text-input",
    label: "What is your\nphone number?",
    sub: "Optional — so we can contact you if you win a prize.",
    placeholder: "Phone number",
    inputType: "tel",
    required: false,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-gender", section: "Tell Us About You", type: "radio",
    label: "What is\nyour gender?",
    sub: "",
    options: ["Male", "Female"],
    required: true,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-age", section: "Tell Us About You", type: "radio",
    label: "What's\nyour age?",
    sub: "",
    options: ["16 - 19", "20 - 23", "24 or above"],
    required: true,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-education", section: "Tell Us About You", type: "radio",
    label: "What is your current\neducational status?",
    sub: "",
    options: ["High School", "University", "Graduated"],
    required: true,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-field", section: "Tell Us About You", type: "radio-other",
    label: "What is your\nfield of study?",
    sub: "",
    options: ["Data Science", "Engineering", "Medicine", "Business", "Arts", "Other"],
    required: true,
    accent: "#f97316", accent2: "#ec4899",
  },

  // ──────────── SECTION 1: Perceptions of AI Writing ─────────────────────
  {
    id: "q1", section: "1 · Perceptions", type: "radio",
    label: "Do you like the writing style\nof Artificial Intelligence (AI)?",
    sub: "",
    options: ["I like it very much", "I somewhat like it", "Neutral", "I do not like it", "I prefer not to use it"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q2", section: "1 · Perceptions", type: "radio",
    label: "Which writing style gives\nyou more trust?",
    sub: "",
    options: ["Human writing", "AI writing", "Both equally", "It depends on the topic"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q3", section: "1 · Perceptions", type: "checkbox",
    label: "What are the main advantages\nof using AI in writing?",
    sub: "Select all that apply.",
    options: ["Speed in completing tasks", "Saving effort", "Language formulation/style", "Nothing special", "Helps generate ideas"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q4", section: "1 · Perceptions", type: "radio",
    label: "Do you think AI can be\nrelied upon in writing?",
    sub: "",
    options: ["Only in formal writing", "Only in informal writing", "In both", "It cannot be relied upon"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q5", section: "1 · Perceptions", type: "radio",
    label: "Do you feel that AI writing is\nsometimes repetitive or similar?",
    sub: "",
    options: ["Always", "Often", "Sometimes", "Rarely", "I do not feel that"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q6", section: "1 · Perceptions", type: "radio",
    label: "Do you think AI can convey\nemotions in writing?",
    sub: "",
    options: ["Yes, to a great extent", "Yes, to a moderate extent", "To a limited extent", "No, it cannot convey emotions", "Not sure"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q7", section: "1 · Perceptions", type: "rating",
    label: "Rate AI writing when dealing\nwith complex topics.",
    sub: "Select a rating from 1 to 5.",
    minLabel: "Not effective", maxLabel: "Very effective",
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q8", section: "1 · Perceptions", type: "rating",
    label: "How would you rate the\ncreativity of AI-generated writing?",
    sub: "Select a rating from 1 to 5.",
    minLabel: "Not effective", maxLabel: "Very effective",
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q9", section: "1 · Perceptions", type: "radio",
    label: "Does AI writing\nneed editing?",
    sub: "",
    options: ["Always", "Often", "Sometimes", "Rarely", "I have never used it"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q10", section: "1 · Perceptions", type: "checkbox-other",
    label: "What most distinguishes\nhuman writing?",
    sub: "Select all that apply.",
    options: ["Emotional expression", "Personal style", "Creativity and imagination", "Writer’s experience and contextual understanding", "Other"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },

  // ──────────── SECTION 2: Text Comparison ───────────────────────────────
  {
    id: "text-a-read", section: "2 · Text Comparison", type: "text-display",
    textLabel: "TEXT A",
    textContent: "Reading is important because it influences the human mind and provides different ideas and information. Even if a person overlooks it, reading can enrich knowledge. Sometimes books contain many details, and those who do not read may feel lost in conversations and may not easily understand certain things.",
    label: "Read the following text carefully.",
    sub: "After reading, you will be asked questions about this text.",
    required: false,
    accent: "#10b981", accent2: "#06b6d4",
  },
  {
    id: "text-a-qs", section: "2 · Text Comparison", type: "text-compare",
    textLabel: "TEXT A",
    label: "Now answer these questions\nabout TEXT A.",
    sub: "",
    subQuestions: [
      {
        id: "q11",
        label: "How would you rate the clarity and writing style of this text?",
        options: ["Very clear with a good style", "Moderately clear", "Not very clear", "I do not know"],
      },
      {
        id: "q12",
        label: "In your opinion, who wrote this text?",
        options: ["Human", "Artificial Intelligence", "Not sure"],
      },
    ],
    required: true,
    accent: "#10b981", accent2: "#06b6d4",
  },
  {
    id: "text-b-read", section: "2 · Text Comparison", type: "text-display",
    textLabel: "TEXT B",
    textContent: "Reading is an effective way to acquire knowledge and develop critical thinking. It broadens an individual's perspective and increases their knowledge. It also improves practical and personal performance and enhances a person's ability to solve problems.",
    label: "Read the following text carefully.",
    sub: "After reading, you will be asked questions about this text.",
    required: false,
    accent: "#10b981", accent2: "#06b6d4",
  },
  {
    id: "text-b-qs", section: "2 · Text Comparison", type: "text-compare",
    textLabel: "TEXT B",
    label: "Now answer these questions\nabout TEXT B.",
    sub: "",
    subQuestions: [
      {
        id: "q13",
        label: "How would you rate the clarity and writing style of this text?",
        options: ["Very clear with a good style", "Moderately clear", "Not very clear", "I do not know"],
      },
      {
        id: "q14",
        label: "In your opinion, who wrote this text?",
        options: ["Human", "Artificial Intelligence", "Not sure"],
      },
    ],
    required: true,
    accent: "#10b981", accent2: "#06b6d4",
  },

  // ──────────── SECTION 3: Tools & Final Thoughts ────────────────────────
  {
    id: "q15", section: "3 · Tools & Feedback", type: "checkbox-other",
    label: "Which AI tools do you\nuse for writing?",
    sub: "Select all that apply.",
    options: ["ChatGPT", "Grammarly", "Notion AI", "Google Gemini", "Microsoft Copilot", "Anthropic Claude", "Other"],
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q16", section: "3 · Tools & Feedback", type: "radio",
    label: "Which writing style gives\nyou more trust?",
    sub: "",
    options: ["Human writing", "AI writing", "Both equally", "It depends on the topic"],
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q17", section: "3 · Tools & Feedback", type: "textarea",
    label: "What qualities does human writing\nhave that AI lacks?",
    sub: "Share your thoughts.",
    placeholder: "Write your answer here…",
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q18", section: "3 · Tools & Feedback", type: "textarea",
    label: "Do you think AI writing has\ndisadvantages? If yes, mention them.",
    sub: "Share your thoughts.",
    placeholder: "Write your answer here…",
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q19", section: "3 · Tools & Feedback", type: "textarea",
    label: "What are the main advantages\nof AI writing?",
    sub: "Share your thoughts.",
    placeholder: "Write your answer here…",
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q20", section: "3 · Tools & Feedback", type: "textarea",
    label: "Any additional\ncomments?",
    sub: "This question is optional.",
    placeholder: "Write anything you'd like to add…",
    required: false,
    accent: "#ec4899", accent2: "#f97316",
  },
];

export const ALL_STEPS_AR: Question[] = [
  // ──────────── البيانات الديموغرافية: احكيلنا عنك ──────────────────────
  {
    id: "demo-phone", section: "احكيلنا عنك", type: "text-input",
    label: "رقم تليفونك ايه؟",
    sub: "اختياري — عشان نتواصل معاك لو كسبت جايزة.",
    placeholder: "رقم التليفون",
    inputType: "tel",
    required: false,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-gender", section: "احكيلنا عنك", type: "radio",
    label: "إنت ولا إنتي؟",
    sub: "",
    options: ["ذكر", "أنثى"],
    required: true,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-age", section: "احكيلنا عنك", type: "radio",
    label: "عندك كام سنة؟",
    sub: "",
    options: ["١٦ - ١٩", "٢٠ - ٢٣", "٢٤ أو أكبر"],
    required: true,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-education", section: "احكيلنا عنك", type: "radio",
    label: "ايه حالتك الدراسية حاليًا؟",
    sub: "",
    options: ["ثانوية عامة", "جامعة", "خريج"],
    required: true,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-field", section: "احكيلنا عنك", type: "radio-other",
    label: "ايه هو مجال دراستك؟",
    sub: "",
    options: ["علم البيانات", "هندسة", "طب", "تجارة", "فنون", "أخرى"],
    required: true,
    accent: "#f97316", accent2: "#ec4899",
  },

  // ──────────── القسم 1: انطباعات عن كتابة الذكاء الاصطناعي ──────────────
  {
    id: "q1", section: "١ · الانطباعات", type: "radio",
    label: "هل بتحب أسلوب كتابة\nالذكاء الاصطناعي؟",
    sub: "",
    options: ["بحبه جداً", "بحبه لحد ما", "محايد", "مش بحبه", "بفضل ماستخدمهوش"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q2", section: "١ · الانطباعات", type: "radio",
    label: "أنهي أسلوب كتابة\nبيديك ثقة أكتر؟",
    sub: "",
    options: ["كتابة الإنسان", "كتابة الذكاء الاصطناعي", "الاتنين بالتساوي", "حسب الموضوع"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q3", section: "١ · الانطباعات", type: "checkbox",
    label: "إيه أهم مميزات استخدام\nالذكاء الاصطناعي في الكتابة؟",
    sub: "اختار كل اللي ينطبق.",
    options: ["السرعة في إتمام المهام", "توفير الجهد", "صياغة اللغة/الأسلوب", "مفيش حاجة مميزة", "المساعدة في توليد الأفكار"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q4", section: "١ · الانطباعات", type: "radio",
    label: "هل تفتكر إن الذكاء الاصطناعي\nممكن يُعتمد عليه في الكتابة؟",
    sub: "",
    options: ["في الكتابة الرسمية بس", "في الكتابة غير الرسمية بس", "في الاتنين", "مينفعش يُعتمد عليه"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q5", section: "١ · الانطباعات", type: "radio",
    label: "هل بتحس إن كتابة الذكاء الاصطناعي\nساعات بتكون متكررة أو متشابهة؟",
    sub: "",
    options: ["دايماً", "غالباً", "أحياناً", "نادراً", "مش حاسس بكده"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q6", section: "١ · الانطباعات", type: "radio",
    label: "هل تفتكر إن الذكاء الاصطناعي\nيقدر ينقل المشاعر في الكتابة؟",
    sub: "",
    options: ["أيوه، بشكل كبير", "أيوه، بشكل متوسط", "بشكل محدود", "لأ، مش بيقدر ينقل مشاعر", "مش متأكد"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q7", section: "١ · الانطباعات", type: "rating",
    label: "قيّم كتابة الذكاء الاصطناعي\nلما بيتعامل مع مواضيع معقدة.",
    sub: "اختار تقييم من 1 لـ 5.",
    minLabel: "غير فعال", maxLabel: "فعال جداً",
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q8", section: "١ · الانطباعات", type: "rating",
    label: "إزاي بتقيّم إبداع\nالذكاء الاصطناعي في الكتابة؟",
    sub: "اختار تقييم من 1 لـ 5.",
    minLabel: "غير فعال", maxLabel: "فعال جداً",
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q9", section: "١ · الانطباعات", type: "radio",
    label: "هل كتابة الذكاء الاصطناعي\nمحتاجة تعديل؟",
    sub: "",
    options: ["دايماً", "غالباً", "أحياناً", "نادراً", "عمري ما استخدمتها"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q10", section: "١ · الانطباعات", type: "checkbox-other",
    label: "إيه أكتر حاجة بتميز\nكتابة الإنسان؟",
    sub: "اختار كل اللي ينطبق.",
    options: ["التعبير العاطفي", "الأسلوب الشخصي", "الإبداع والخيال", "خبرة الكاتب وفهمه للسياق", "أخرى"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },

  // ──────────── القسم 2: مقارنة النصوص ──────────────────────────────────
  {
    id: "text-a-read", section: "٢ · مقارنة النصوص", type: "text-display",
    textLabel: "النص أ",
    textContent: "القراءة مهمة لأنها بتأثر على عقل الإنسان وبتديه أفكار ومعلومات مختلفة. حتى لو الواحد مش واخد باله، القراءة ممكن تزود المعرفة. ساعات الكتب بيبقى فيها تفاصيل كتير، واللي مش بيقرأ ممكن يحس إنه تايه في الكلام ومش بيفهم حاجات معينة بسهولة.",
    label: "اقرأ النص ده كويس.",
    sub: "بعد ما تقرأ، هنسألك أسئلة عن النص ده.",
    required: false,
    accent: "#10b981", accent2: "#06b6d4",
  },
  {
    id: "text-a-qs", section: "٢ · مقارنة النصوص", type: "text-compare",
    textLabel: "النص أ",
    label: "دلوقتي جاوب على الأسئلة دي\nعن النص أ.",
    sub: "",
    subQuestions: [
      {
        id: "q11",
        label: "إزاي بتقيّم وضوح النص ده وأسلوب كتابته؟",
        options: ["واضح جداً وأسلوبه حلو", "واضح لحد ما", "مش واضح قوي", "مش عارف"],
      },
      {
        id: "q12",
        label: "في رأيك، مين كتب النص ده؟",
        options: ["الإنسان", "الذكاء الاصطناعي", "مش متأكد"],
      },
    ],
    required: true,
    accent: "#10b981", accent2: "#06b6d4",
  },
  {
    id: "text-b-read", section: "٢ · مقارنة النصوص", type: "text-display",
    textLabel: "النص ب",
    textContent: "القراءة طريقة فعّالة لاكتساب المعرفة وتطوير التفكير النقدي. بتوسّع أفق الفرد وبتزود معرفته. كمان بتحسّن الأداء العملي والشخصي وبتعزز قدرة الشخص على حل المشاكل.",
    label: "اقرأ النص ده كويس.",
    sub: "بعد ما تقرأ، هنسألك أسئلة عن النص ده.",
    required: false,
    accent: "#10b981", accent2: "#06b6d4",
  },
  {
    id: "text-b-qs", section: "٢ · مقارنة النصوص", type: "text-compare",
    textLabel: "النص ب",
    label: "دلوقتي جاوب على الأسئلة دي\nعن النص ب.",
    sub: "",
    subQuestions: [
      {
        id: "q13",
        label: "إزاي بتقيّم وضوح النص ده وأسلوب كتابته؟",
        options: ["واضح جداً وأسلوبه حلو", "واضح لحد ما", "مش واضح قوي", "مش عارف"],
      },
      {
        id: "q14",
        label: "في رأيك، مين كتب النص ده؟",
        options: ["الإنسان", "الذكاء الاصطناعي", "مش متأكد"],
      },
    ],
    required: true,
    accent: "#10b981", accent2: "#06b6d4",
  },

  // ──────────── القسم 3: أدوات وملاحظات ──────────────────────────────────
  {
    id: "q15", section: "٣ · أدوات وملاحظات", type: "checkbox-other",
    label: "أنهي أدوات ذكاء اصطناعي\nبتستخدمها في الكتابة؟",
    sub: "اختار كل اللي ينطبق.",
    options: ["ChatGPT", "Grammarly", "Notion AI", "Google Gemini", "Microsoft Copilot", "Anthropic Claude", "أخرى"],
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q16", section: "٣ · أدوات وملاحظات", type: "radio",
    label: "أنهي أسلوب كتابة\nبيديك ثقة أكتر؟",
    sub: "",
    options: ["كتابة الإنسان", "كتابة الذكاء الاصطناعي", "الاتنين بالتساوي", "حسب الموضوع"],
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q17", section: "٣ · أدوات وملاحظات", type: "textarea",
    label: "إيه الصفات اللي في كتابة الإنسان\nومش ممكن الذكاء الاصطناعي يقلدها؟",
    sub: "شاركنا رأيك.",
    placeholder: "اكتب إجابتك هنا…",
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q18", section: "٣ · أدوات وملاحظات", type: "textarea",
    label: "هل تفتكر إن كتابة الذكاء الاصطناعي\nليها عيوب؟ لو أيوه اذكرها.",
    sub: "شاركنا رأيك.",
    placeholder: "اكتب إجابتك هنا…",
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q19", section: "٣ · أدوات وملاحظات", type: "textarea",
    label: "إيه أهم مميزات كتابة\nالذكاء الاصطناعي؟",
    sub: "شاركنا رأيك.",
    placeholder: "اكتب إجابتك هنا…",
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q20", section: "٣ · أدوات وملاحظات", type: "textarea",
    label: "أي تعليقات إضافية؟",
    sub: "السؤال ده اختياري ممكن تبعت ردك من غير إجابة.",
    placeholder: "اكتب أي حاجة عايز تضيفها…",
    required: false,
    accent: "#ec4899", accent2: "#f97316",
  },
];

export const TOTAL = ALL_STEPS_EN.length;
