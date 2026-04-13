"use client";

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { determineQuizLevel } from "@/lib/quiz-level";
import {
  Clock,
  Trophy,
  ArrowLeft,
  ArrowRight,
  Play,
  CheckCircle,
  XCircle,
  Palette,
  Timer,
  Zap,
  Star,
  Award,
  Target,
  Eye,
  Sparkles,
  Brain,
  Lightbulb,
  BookOpen,
  Cable,
  Snail,
  Infinity,
  User,
  Code,
  AlertCircle,
  Calculator as CalculatorIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createBrowserClient } from "@/lib/supabase/client";
import { getStudentSession } from "@/lib/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Dialog as ImageDialog, DialogContent as ImageDialogContent } from "@/components/ui/dialog";
import Calculator from "@/components/Calculator";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

interface QuizQuestion {
  numb: number;
  question: string;
  type: string;
  answer: string;
  options: string[];
  image?: string | null;
  explanation?: string | null;
}

interface QuizData {
  id: string;
  name: string;
  code: string;
  duration: number;
  jsonFile: string;
}

interface QuizInterfaceProps {
  quizData: QuizData;
  onExit: () => void;
}

const themes = [
  {
    name: "Ocean",
    primary: "#0066cc",
    secondary: "#004499",
    accent: "#00aaff",
    gradient: "from-blue-500/[0.15]",
  },
  {
    name: "Forest",
    primary: "#228B22",
    secondary: "#006400",
    accent: "#32CD32",
    gradient: "from-green-500/[0.15]",
  },
  {
    name: "Sunset",
    primary: "#FF6B35",
    secondary: "#CC4125",
    accent: "#FF8C69",
    gradient: "from-orange-500/[0.15]",
  },
  {
    name: "Purple",
    primary: "#8A2BE2",
    secondary: "#6A1B9A",
    accent: "#BA55D3",
    gradient: "from-purple-500/[0.15]",
  },
  {
    name: "Rose",
    primary: "#E91E63",
    secondary: "#C2185B",
    accent: "#F48FB1",
    gradient: "from-rose-500/[0.15]",
  },
  {
    name: "Teal",
    primary: "#009688",
    secondary: "#00695C",
    accent: "#4DB6AC",
    gradient: "from-teal-500/[0.15]",
  },
];

const durations = [
  { label: "Lightning", value: 1, icon: Zap, description: "1 Minute" },
  { label: "Short", value: 5, icon: Star, description: "5 Minutes" },
  { label: "Standard (DEF)", value: 10, icon: Cable, description: "10 Minutes" },
  { label: "Extended", value: 15, icon: Clock, description: "15 Minutes" },
  { label: "Indolent", value: 30, icon: Snail, description: "30 Minutes" },
  { label: "Unlimited", value: 0, icon: Infinity, description: "No Time Limit" },
];

const quizModes = [
  {
    id: "instant",
    name: "Instant Feedback",
    icon: Lightbulb,
    description: "See Answers Immediately with Explain",
    color: "from-yellow-500/[0.15]",
  },
  {
    id: "traditional",
    name: "Traditional Mode",
    icon: Brain,
    description: "Answer All Questions Then See Results",
    color: "from-indigo-500/[0.15]",
  },
];

// Detect mobile devices and reduced motion
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
    
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches || isMobile);
    
    const listener = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches || isMobile);
    mediaQuery.addEventListener('change', listener);
    window.addEventListener('resize', checkMobile);
    
    return () => {
      mediaQuery.removeEventListener('change', listener);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);
  
  return { prefersReducedMotion: prefersReducedMotion || isMobile, isMobile };
}

// Helper to format LaTeX mathematically-like strings with inline code styling
function formatTextWithLatex(text?: string | null) {
  if (!text) return text;
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const math = part.slice(1, -1);
      return (
        <span key={i} className="inline px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-indigo-200 shadow-sm align-middle" style={{ wordBreak: 'break-word', whiteSpace: 'normal', display: 'inline' }}>
          <InlineMath math={math} />
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// Memoized Option Button Component
const OptionButton = memo(function OptionButton({ 
  option, 
  index, 
  isSelected, 
  isCorrectOption, 
  showFeedback, 
  isQuestionAnswered, 
  onSelect, 
  selectedTheme,
  isMobile 
}: {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrectOption: boolean;
  showFeedback: boolean;
  isQuestionAnswered: boolean;
  onSelect: (option: string) => void;
  selectedTheme: typeof themes[0];
  isMobile: boolean;
}) {
  return (
    <motion.button
      key={index}
      initial={!isMobile ? { opacity: 0, y: 20 } : false}
      animate={!isMobile ? { opacity: 1, y: 0 } : {}}
      transition={!isMobile ? { delay: index * 0.05 } : {}}
      whileHover={!showFeedback && !isQuestionAnswered && !isMobile ? { scale: 1.02, x: 8 } : {}}
      whileTap={!isMobile ? { scale: 0.98 } : {}}
      onClick={() => !isQuestionAnswered && onSelect(option)}
      disabled={isQuestionAnswered}
      className={cn(
        "w-full p-4 md:p-6 text-left rounded-xl border-2 transition-all backdrop-blur-sm relative overflow-hidden",
        showFeedback
          ? isCorrectOption
            ? "border-green-400 bg-green-500/[0.2] shadow-lg shadow-green-500/[0.3]"
            : isSelected
            ? "border-red-400 bg-red-500/[0.2] shadow-lg shadow-red-500/[0.3]"
            : "border-white/[0.15] bg-white/[0.02]"
          : isSelected
          ? "border-white bg-white/[0.1] shadow-lg"
          : "border-white/[0.15] hover:border-white/[0.3] hover:bg-white/[0.03]",
        isQuestionAnswered && "cursor-not-allowed opacity-80"
      )}
      style={{
        backgroundColor:
          !showFeedback && isSelected
            ? `${selectedTheme.primary}20`
            : undefined,
      }}
    >
      <AnimatePresence>
        {showFeedback && isCorrectOption && !isMobile && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-4 right-4"
          >
            <CheckCircle className="w-8 h-8 text-green-400" />
          </motion.div>
        )}
        {showFeedback && isSelected && !isCorrectOption && !isMobile && (
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-4 right-4"
          >
            <XCircle className="w-8 h-8 text-red-400" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <span className="text-base md:text-lg leading-relaxed">{formatTextWithLatex(option)}</span>
        {showFeedback && isCorrectOption && isMobile && (
          <CheckCircle className="w-6 h-6 text-green-400" />
        )}
        {showFeedback && isSelected && !isCorrectOption && isMobile && (
          <XCircle className="w-6 h-6 text-red-400" />
        )}
      </div>
    </motion.button>
  );
});

export default function QuizInterface({
  quizData,
  onExit,
}: QuizInterfaceProps) {
  // Detect mobile and reduced motion
  const { prefersReducedMotion, isMobile } = useReducedMotion();
  
  const [currentStep, setCurrentStep] = useState<
    "setup" | "quiz" | "results" | "review"
  >("setup");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [selectedMode, setSelectedMode] = useState("traditional");
  const [showSettings, setShowSettings] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState<{
    [key: number]: boolean;
  }>({});
  const [quizStatus, setQuizStatus] = useState<
    "completed" | "timed-out"
  >("completed");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [attemptsToday, setAttemptsToday] = useState(0);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
  const [showAttemptsDialog, setShowAttemptsDialog] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const submissionInProgress = useRef(false);
  const supabase = useMemo(() => createBrowserClient(), []);

  // Check authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [showBannedDialog, setShowBannedDialog] = useState(false);
  
  // Memoize checkQuizAttempts to avoid unnecessary recreations
  const checkQuizAttempts = useCallback(async (): Promise<void> => {
    try {
      const session = await getStudentSession();
      if (!session) {
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const { error, count } = await supabase
        .from("quiz_data")
        .select("*", { count: "exact", head: true })
        .eq("auth_id", session.auth_id)
        .eq("quiz_id", quizData.code)
        .gte("solved_at", todayISO);

      if (error) {
        console.error("Error checking quiz attempts:", error);
        return;
      }

      const attemptsCount = count || 0;
      setAttemptsToday(attemptsCount);
      setMaxAttemptsReached(attemptsCount >= 5);
    } catch (error) {
      console.error("Unexpected error checking attempts:", error);
    }
  }, [supabase, quizData.code]);
  
  useEffect(() => {
    const checkAuth = async () => {
      const session = await getStudentSession();
      setIsAuthenticated(!!session);
      
      if (session) {
        // ✅ Check if user is banned
        if (session.is_banned) {
          console.log("🚫 User is banned, forcing logout");
          setIsBanned(true);
          setShowBannedDialog(true);
          return;
        }
        
        await checkQuizAttempts();
      }
    };
    
    // Clear session storage when component first mounts (on page load)
    sessionStorage.removeItem(`quiz_${quizData.code}_answers`);
    
    checkAuth();
  }, [checkQuizAttempts, quizData.code]);
  
  // ✅ Force logout if banned
  const handleBannedLogout = async () => {
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut({ scope: 'global' });
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/auth";
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = "/auth";
    }
  };

  // Memoize loadQuestions
  const loadQuestions = useCallback(async () => {
    try {
      const response = await fetch(quizData.jsonFile);
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Failed to load questions:", error);
      setQuestions([
        {
          numb: 1,
          question: "Sample question - What is 2 + 2?",
          type: "Mathematics",
          answer: "4",
          options: ["2", "3", "4", "5"],
          image: null,
        },
      ]);
    }
  }, [quizData.jsonFile]);

  useEffect(() => {
    loadQuestions();
    
    // Load answers from session storage when starting quiz
    if (currentStep === "quiz") {
      const savedAnswers = sessionStorage.getItem(`quiz_${quizData.code}_answers`);
      if (savedAnswers) {
        setUserAnswers(JSON.parse(savedAnswers));
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Clear session storage when component unmounts (page refresh/navigation)
      if (currentStep === "setup") {
        sessionStorage.removeItem(`quiz_${quizData.code}_answers`);
      }
    };
  }, [loadQuestions, currentStep, quizData.code]);

  // Save answers to session storage whenever they change during quiz
  useEffect(() => {
    if (currentStep === "quiz" && Object.keys(userAnswers).length > 0) {
      sessionStorage.setItem(`quiz_${quizData.code}_answers`, JSON.stringify(userAnswers));
    }
  }, [userAnswers, quizData.code, currentStep]);
  
  // Clear session storage when going back to setup
  useEffect(() => {
    if (currentStep === "setup") {
      sessionStorage.removeItem(`quiz_${quizData.code}_answers`);
    }
  }, [currentStep, quizData.code]);

  // Debounce theme changes
  useEffect(() => {
    const handler = setTimeout(() => {
      document.documentElement.style.setProperty(
        "--quiz-primary",
        selectedTheme.primary
      );
      document.documentElement.style.setProperty(
        "--quiz-secondary",
        selectedTheme.secondary
      );
      document.documentElement.style.setProperty(
        "--quiz-accent",
        selectedTheme.accent
      );
    }, 50);
    
    return () => clearTimeout(handler);
  }, [selectedTheme]);

  // checkQuizAttempts and loadQuestions moved to useCallback above

  // Function to handle image display
  // Moved to useCallback above

  const startQuiz = async () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    
    // ✅ Check if user is banned
    if (isBanned) {
      setShowBannedDialog(true);
      return;
    }
    
    // Check attempts before starting
    await checkQuizAttempts();
    
    if (maxAttemptsReached) {
      setShowAttemptsDialog(true);
      return;
    }
    
    // Clear any previous session storage when starting a new quiz
    sessionStorage.removeItem(`quiz_${quizData.code}_answers`);
    setUserAnswers({});
    setAnswerRevealed({});
    setShowAnswer(false);
    
    setCurrentStep("quiz");

    if (selectedDuration > 0) {
      // Only set timer for non-unlimited durations
      setTimeLeft(selectedDuration * 60);
      startTimer();
    } else {
      // For unlimited duration, set a very large number or skip timer completely
      setTimeLeft(Number.MAX_SAFE_INTEGER); // Effectively unlimited
    }
  };

  const startTimer = () => {
    // No timeout handling here, just count down
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Only clear the timer here
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Memoized callbacks for better performance
  const selectAnswer = useCallback((answer: string) => {
    // 🔒 في Instant Mode: ممنوع تغيير الإجابة بعد ما تجاوب
    if (selectedMode === "instant" && userAnswers[currentQuestion] !== undefined) {
      return;
    }

    // Batch state updates using functional updates
    setUserAnswers(prev => {
      const updated = {
        ...prev,
        [currentQuestion]: answer,
      };
      // Save to session storage immediately
      sessionStorage.setItem(`quiz_${quizData.code}_answers`, JSON.stringify(updated));
      return updated;
    });

    if (selectedMode === "instant") {
      setShowAnswer(true);
      setAnswerRevealed(prev => ({
        ...prev,
        [currentQuestion]: true,
      }));
    }
  }, [selectedMode, currentQuestion, userAnswers, quizData.code]);

  const nextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // ✅ On last question, finish the quiz
      setQuizStatus("completed");
      // Use a ref or direct call without dependency
      setCurrentStep("results");
    }
  }, [currentQuestion, questions.length]);

  const prevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      const prevQuestionIndex = currentQuestion - 1;
      setCurrentQuestion(prevQuestionIndex);
    }
  }, [currentQuestion]);

  const handleShowImage = useCallback((imageUrl: string | null | undefined) => {
    if (imageUrl) {
      setCurrentImage(imageUrl);
      setShowImageDialog(true);
    }
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Updated saveScoreToSupabase function with all required fields
  const saveScoreToSupabase = async (finalScore: number, status: "completed" | "timed-out") => {
    // Additional guard against double submission
    if (submissionInProgress.current && quizSubmitted) {
      console.log("Submission already in progress, skipping database save");
      return;
    }
    
    // Set flags to prevent further submissions
    submissionInProgress.current = true;
    setQuizSubmitted(true);
    
    try {
      const session = await getStudentSession();
      if (!session) {
        console.error("No user session found");
        return;
      }

      // Use the quiz code directly instead of trying to parse it as an integer
      const quizId = quizData.code;
      
      // ✅ Calculate percentage correctly to avoid rounding issues
      const scorePercentage = Math.round((finalScore / questions.length) * 100);
      
      console.log(`📊 Score Calculation: ${finalScore} correct out of ${questions.length} = ${scorePercentage}%`);
      
      const quizResult = {
        auth_id: session.auth_id,
        quiz_id: quizId,
        score: scorePercentage,
        how_finished: status,
        chosen_theme: selectedTheme.name,
        answering_mode: selectedMode,
        duration_selected: selectedDuration === 0 ? "Unlimited" : `${selectedDuration} minutes`,
        total_questions: questions.length,
        quiz_level: determineQuizLevel(quizId), // Use the imported function here
      };

      
      const { data, error } = await supabase
        .from("quiz_data")
        .insert([quizResult])
        .select();

      if (error) {
        console.error("Error saving quiz data to Supabase:", error.message);
      } else {
        // Update attempts count after successful submission
        setAttemptsToday(prev => prev + 1);
        setMaxAttemptsReached(attemptsToday + 1 >= 10);
      }
    } catch (error) {
      console.error("Unexpected error saving quiz data:", error);
    }
  };

  // Updated saveScore function for localStorage
  const saveScore = (finalScore: number, status: "completed" | "timed-out") => {
    const quizResult = {
      quizId: quizData.code,
      score: finalScore,
      totalQuestions: questions.length,
      status: status,
      timestamp: new Date().toISOString(),
      answers: userAnswers,
      theme: selectedTheme.name,
      mode: selectedMode,
      duration: selectedDuration,
    };

    localStorage.setItem(
      `quiz_${quizData.id}_result`,
      JSON.stringify(quizResult)
    );
  };

  const finishQuiz = useCallback((answersToUse = userAnswers) => {
    // Use ref to prevent double execution
    if (submissionInProgress.current) {
      console.log("Submission already in progress");
      return;
    }
    
    // Set flag immediately
    submissionInProgress.current = true;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Calculate score using the passed answers
    let correctAnswers = 0;
    
    questions.forEach((question, index) => {
      const userAnswer = answersToUse[index];
      const correctAnswer = question.answer;
      
      // Check for whitespace issues
      const userAnswerLength = userAnswer?.length || 0;
      const correctAnswerLength = correctAnswer?.length || 0;
      
      // Trim whitespace from both answers
      const trimmedUserAnswer = userAnswer?.trim();
      const trimmedCorrectAnswer = correctAnswer?.trim();
      const isMatch = trimmedUserAnswer === trimmedCorrectAnswer;
            
      if (isMatch) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
    setCurrentStep("results");

    // Clear session storage after finishing
    sessionStorage.removeItem(`quiz_${quizData.code}_answers`);

    // Save to localStorage and database
    saveScore(correctAnswers, quizStatus);
    saveScoreToSupabase(correctAnswers, quizStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, userAnswers, quizStatus, quizData.code]);

  // formatTime moved to useCallback above

  const getScoreMessage = () => {
    const percentage = Math.round((score / questions.length) * 100);
    if (percentage >= 90)
      return {
        message: "Outstanding! Perfect mastery! 🏆",
        color: "text-yellow-400",
      };
    if (percentage >= 80)
      return {
        message: "Excellent work! Well done! ⭐",
        color: "text-green-400",
      };
    if (percentage >= 70)
      return { message: "Great job! Keep it up! 👏", color: "text-blue-400" };
    if (percentage >= 60)
      return {
        message: "Good effort! Room for improvement! 📚",
        color: "text-white-400",
      };
    return {
      message: "Keep studying! You'll do better next time! 💪",
      color: "text-red-400",
    };
  };

  useEffect(() => {
    if (currentStep === "quiz" && timeLeft > 0 && selectedDuration > 0) {
      // Only start timer if not unlimited and time left is positive
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Start the timer
      startTimer();
    } else if (timeLeft === 0 && currentStep === "quiz" && selectedDuration > 0) {
      // Only handle timeout for non-unlimited durations
      handleTimeExpired();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, currentStep, selectedDuration]);

  const handleTimeExpired = () => {
    // Use ref to prevent double execution
    if (submissionInProgress.current) {
      console.log("Time expired submission already in progress");
      return;
    }
    
    // Set the flag immediately
    submissionInProgress.current = true;
    console.log("Time expired, handling quiz completion");
    
    // Use functional update to get the latest userAnswers
    setUserAnswers(currentAnswers => {
      // Calculate score using current answers
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        const userAnswer = currentAnswers[index];
        const correctAnswer = question.answer;
        const trimmedUserAnswer = userAnswer?.trim();
        const trimmedCorrectAnswer = correctAnswer?.trim();
        const isMatch = trimmedUserAnswer === trimmedCorrectAnswer;
        
        
        if (isMatch) {
          correctAnswers++;
        }
      });

      console.log(`⏰ Final Score (Timed Out): ${correctAnswers} out of ${questions.length}`);

      // Update state
      setQuizStatus("timed-out");
      setScore(correctAnswers);
      setCurrentStep("results");
      
      // Save to localStorage
      const quizResult = {
        quizId: quizData.code,
        score: correctAnswers,
        totalQuestions: questions.length,
        status: "timed-out" as const,
        timestamp: new Date().toISOString(),
        answers: currentAnswers,
        theme: selectedTheme.name,
        mode: selectedMode,
        duration: selectedDuration,
      };
      localStorage.setItem(
        `quiz_${quizData.id}_result`,
        JSON.stringify(quizResult)
      );
      
      // Save to database
      saveScoreToSupabase(correctAnswers, "timed-out");
      
      return currentAnswers;
    });
  };

  useEffect(() => {
    if (selectedMode === "traditional" && currentStep === "quiz") {
      // Calculate current score based on all answered questions
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        // ✅ Normalize answers by trimming whitespace for accurate comparison
        const userAnswer = userAnswers[index]?.trim();
        const correctAnswer = question.answer?.trim();
        
        if (userAnswer === correctAnswer) {
          correctAnswers++;
        }
      });
      setScore(correctAnswers); // Update score in real-time
    }
  }, [userAnswers, selectedMode, currentStep, questions]);

  // ✅ Handle quiz completion when moving to results
  useEffect(() => {
    if (currentStep === "results" && quizStatus === "completed" && !submissionInProgress.current) {
      finishQuiz(userAnswers);
    }
  }, [currentStep, quizStatus, userAnswers, finishQuiz]);

  // Update showAnswer when navigating between questions
  useEffect(() => {
    if (currentStep === "quiz") {
      const hasAnswer = userAnswers[currentQuestion] !== undefined;
      const wasRevealed = answerRevealed[currentQuestion] || false;
      
      // Show answer only if it was previously revealed (in instant mode)
      if (selectedMode === "instant" && hasAnswer && wasRevealed) {
        setShowAnswer(true);
      } else {
        setShowAnswer(false);
      }
    }
  }, [currentQuestion, currentStep, userAnswers, answerRevealed, selectedMode]);

  // Authentication Dialog Component
  const AuthDialog = () => (
    <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
      <DialogContent className="bg-black/80 backdrop-blur-md border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            Authentication Required
          </DialogTitle>
          <DialogDescription className="text-white/70">
            You need to be logged in to start this quiz. Please sign in to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
            <Button 
            onClick={() => {
              // Redirect to login page or show login modal
              window.location.href = "/auth";
            }}
            className="w-full py-3 text-lg"
            style={{
              backgroundColor: selectedTheme.primary,
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = selectedTheme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = selectedTheme.primary;
              e.currentTarget.style.color = "white";
            }}
            >
            Sign In
            </Button>
            <Button 
            variant="outline" 
            onClick={() => setShowAuthDialog(false)}
            className="w-full py-3 text-lg border-white/30"
            style={{
              backgroundColor: "white",
              color: selectedTheme.primary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = selectedTheme.primary;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = selectedTheme.primary;
            }}
            >
            Cancel
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Attempts Limit Dialog Component
  const AttemptsDialog = () => (
    <Dialog open={showAttemptsDialog} onOpenChange={setShowAttemptsDialog}>
      <DialogContent className="bg-black/80 backdrop-blur-md border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-yellow-400" />
            Maximum Attempts Reached
          </DialogTitle>
          <DialogDescription className="text-white/70">
            You have already used {attemptsToday} out of 10 attempts for this quiz today. 
            Please try again tomorrow.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
            <Button 
            onClick={() => setShowAttemptsDialog(false)}
            className="w-full py-3 text-lg"
            style={{
              backgroundColor: selectedTheme.primary,
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = selectedTheme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = selectedTheme.primary;
              e.currentTarget.style.color = "white";
            }}
            >
            Okay
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // ✅ Banned User Dialog Component
  const BannedDialog = () => (
    <Dialog open={showBannedDialog} onOpenChange={() => {}}>
      <DialogContent className="bg-black/80 backdrop-blur-md border-red-500/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-red-400">
            <XCircle className="w-6 h-6" />
            Account Banned
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Your account has been banned. You cannot access quizzes or other features. 
            Please contact support if you believe this is a mistake.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
            <Button 
            onClick={handleBannedLogout}
            className="w-full py-3 text-lg bg-red-600 hover:bg-red-700"
            >
            <XCircle className="w-5 h-5 mr-2" />
            Logout
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (currentStep === "setup") {
    return (
      <MotionConfig reducedMotion={isMobile ? "always" : "user"}>
      <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
        <AuthDialog />
        <AttemptsDialog />
        <BannedDialog />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

        {/* Elegant Shapes with Theme Colors */}
        {/* Removed for performance */}

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-5xl transition-all duration-300 opacity-100 quiz-card">
            <Card className="bg-black/40 border-white/20 backdrop-blur-lg text-white">
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      sessionStorage.removeItem(`quiz_${quizData.code}_answers`);
                      window.history.back();
                    }}
                    className="text-white/90 hover:text-white hover:bg-white/10 border border-white/20 bg-black/20"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white/90 hover:text-white hover:bg-white/10 border border-white/20 bg-black/20"
                  >
                    <Palette className="w-4 h-4" />
                  </Button>
                </div>

                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-center mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center",
                        "bg-gradient-to-r to-transparent border-2 border-white/30",
                        "backdrop-blur-[2px] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        selectedTheme.gradient
                      )}
                      style={{
                        background: `linear-gradient(to right, ${selectedTheme.primary}40, transparent)`,
                      }}
                    >
                      <Target className="w-10 h-10 text-white" />
                    </motion.div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                    {quizData.name}
                  </h1>
                  <Badge
                    variant="outline"
                    className="text-lg px-6 py-3 border-white/30 text-white/90 backdrop-blur-sm bg-black/20"
                    style={{ backgroundColor: `${selectedTheme.primary}30` }}
                  >
                    Code: {quizData.code}
                  </Badge>
                </motion.div>
              </CardHeader>

              <CardContent className="space-y-8">
                {showSettings && (
                  <div className="space-y-6 p-6 bg-black/30 rounded-xl border border-white/20 transition-all duration-300 ease-in-out">
                    <h3 className="text-xl font-semibold flex items-center text-white">
                      <Palette className="w-5 h-5 mr-3" />
                      Customize Your Experience
                    </h3>

                    <div>
                      <label className="block text-sm font-medium mb-4 text-white/90">
                        Choose Theme
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {themes.map((theme) => (
                          <button
                            key={theme.name}
                            onClick={() => setSelectedTheme(theme)}
                            className={cn(
                              "p-4 rounded-xl border-2 transition-all duration-200 backdrop-blur-sm hover:scale-105 active:scale-95",
                              selectedTheme.name === theme.name
                                ? "border-white scale-105 shadow-lg bg-black/30"
                                : "border-white/30 hover:border-white/50 bg-black/20"
                            )}
                            style={{ backgroundColor: `${theme.primary}30` }}
                          >
                            <div
                              className="w-8 h-8 rounded-full mx-auto mb-2"
                              style={{ backgroundColor: theme.primary }}
                            />
                            <div className="text-sm font-medium text-white">
                              {theme.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quiz Mode Selection */}
                <div>
                  <label className="text-lg font-medium mb-6 text-white flex items-center">
                    <Sparkles className="w-5 h-5 mr-3" />
                    Choose Quiz Mode
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizModes.map((mode) => {
                      const IconComponent = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setSelectedMode(mode.id)}
                          className={cn(
                            "p-6 rounded-xl border-2 transition-all duration-200 backdrop-blur-sm text-left hover:scale-102 active:scale-98",
                            selectedMode === mode.id
                              ? "border-white bg-black/40 scale-105"
                              : "border-white/30 hover:border-white/50 hover:bg-black/20 bg-black/10"
                          )}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-lg flex items-center justify-center",
                                "bg-gradient-to-r to-transparent border border-white/30",
                                mode.color
                              )}
                              style={{
                                background: `linear-gradient(to right, ${selectedTheme.primary}40, transparent)`,
                              }}
                            >
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-white mb-2">
                                {mode.name}
                              </div>
                              <div className="text-sm text-white/80">
                                {mode.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-lg font-medium mb-6 text-white flex items-center">
                    <Timer className="w-5 h-5 mr-3" />
                    Select Duration
                  </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {durations.map((duration) => {
                      const IconComponent = duration.icon || Clock;
                      return (
                        <button
                        key={duration.value}
                        onClick={() => setSelectedDuration(duration.value)}
                        className={cn(
                          "p-6 rounded-xl border-2 transition-all duration-200 backdrop-blur-sm text-center hover:scale-105 active:scale-95",
                          selectedDuration === duration.value
                          ? "scale-105"
                          : "hover:border-white/50 hover:bg-black/20 bg-black/10"
                        )}
                        style={{
                          borderColor:
                          selectedDuration === duration.value
                            ? selectedTheme.primary
                            : "rgba(255, 255, 255, 0.3)",
                          backgroundColor:
                          selectedDuration === duration.value
                            ? "rgba(0, 0, 0, 0.4)"
                            : undefined,
                        }}
                        >
                        <IconComponent
                          className="w-8 h-8 mx-auto mb-3"
                          style={{
                          color:
                            selectedDuration === duration.value
                            ? selectedTheme.primary
                            : "white",
                          }}
                        />
                        <div className="text-lg font-semibold text-white mb-1">
                          {duration.label}
                        </div>
                        <div className="text-sm text-white/80">
                          {duration.description}
                        </div>
                        </button>
                      );
                    })}
                    </div>
                </div>

                <div className="bg-black/30 p-6 rounded-xl border border-white/20">
                  <h3 className="font-semibold mb-4 text-white text-lg">
                    Quiz Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {questions.length}
                      </div>
                      <div className="text-sm text-white/80">Questions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {selectedDuration === 0 ? "∞" : `${selectedDuration}m`}
                      </div>
                      <div className="text-sm text-white/80">Duration</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {selectedTheme.name}
                      </div>
                      <div className="text-sm text-white/80">Theme</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {selectedMode === "instant" ? "Instant" : "Traditional"}
                      </div>
                      <div className="text-sm text-white/80">Mode</div>
                    </div>
                  </div>
                  
                  {/* Attempts counter */}
                  {isAuthenticated && (
                    <div className="mt-6 pt-4 border-t border-white/20">
                      <div className="flex items-center justify-center gap-2 text-white/70">
                        <Clock className="w-4 h-4" />
                        <span>Attempts today: {attemptsToday}/10</span>
                        {maxAttemptsReached && (
                          <Badge variant="destructive" className="ml-2">
                            Limit Reached
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={startQuiz}
                    disabled={maxAttemptsReached}
                    className="w-full py-6 text-xl font-semibold rounded-xl"
                    style={{ 
                      backgroundColor: maxAttemptsReached ? "#666" : selectedTheme.primary,
                      cursor: maxAttemptsReached ? "not-allowed" : "pointer"
                    }}
                  >
                    <Play className="w-6 h-6 mr-3" />
                    {maxAttemptsReached ? "Maximum Attempts Reached" : "Start Quiz Adventure"}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </MotionConfig>
    );
  }

  if (currentStep === "quiz") {
    const currentQ = questions[currentQuestion];
    const isAnswered = userAnswers[currentQuestion] !== undefined;
    const isCorrect = userAnswers[currentQuestion] === currentQ?.answer;

    return (
      <MotionConfig reducedMotion={isMobile ? "always" : "user"}>
      <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

        {/* Elegant Shapes */}
        {/* Removed for performance */}

        {/* Timer and Score Display */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          {selectedDuration > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <Card
                className="bg-black/[0.3] backdrop-blur-md border-white/[0.1] shadow-md"
                style={{ padding: "0.25rem 1rem", borderRadius: "1rem" }}
              >
                <CardContent className="p-0">
                  <div className="flex items-center text-white">
                    <Clock
                      className={`w-4 h-4 mr-2`}
                      style={{ color: selectedTheme.accent }}
                    />
                    <span
                      className="font-mono text-lg font-semibold"
                      style={{ color: selectedTheme.accent }}
                    >
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Progress */}
        <div className="relative z-10 pt-6 px-6">
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/70 text-sm">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <Badge
                variant="outline"
                className="border-white/[0.15] text-white/70 px-4 py-2"
                style={{ backgroundColor: `${selectedTheme.primary}20` }}
              >
                {currentQ?.type}
              </Badge>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-white/[0.1] rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  backgroundColor: selectedTheme.primary,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="relative z-10 px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-lg text-white">
                  <CardHeader className="pb-6">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-2xl leading-relaxed font-medium flex-1">
                        {formatTextWithLatex(currentQ?.question)}
                      </CardTitle>
                      {currentQ?.image && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShowImage(currentQ.image)}
                            className="ml-4 border-white/[0.15] text-white hover:bg-white/[0.05] bg-transparent"
                            style={{
                              backgroundColor: selectedTheme.primary,
                              color: "white",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "white";
                              e.currentTarget.style.color = selectedTheme.primary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = selectedTheme.primary;
                              e.currentTarget.style.color = "white";
                            }}
                            >
                            <Code className="w-4 h-4 mr-2" />
                            Show Code
                            </Button>
                        </motion.div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3 md:space-y-4">
                      {currentQ?.options.map((option, index) => {
                        const isSelected =
                          userAnswers[currentQuestion] === option;
                        const isCorrectOption = option === currentQ.answer;
                        const showFeedback =
                          selectedMode === "instant" && showAnswer;
                        const isQuestionAnswered = selectedMode === "instant" && userAnswers[currentQuestion] !== undefined;

                        return (
                          <OptionButton
                            key={index}
                            option={option}
                            index={index}
                            isSelected={isSelected}
                            isCorrectOption={isCorrectOption}
                            showFeedback={showFeedback}
                            isQuestionAnswered={isQuestionAnswered}
                            onSelect={selectAnswer}
                            selectedTheme={selectedTheme}
                            isMobile={isMobile}
                          />
                        );
                      })}
                    </div>

                    {/* Creative answer explanation for instant mode */}
                    <AnimatePresence>
                      {selectedMode === "instant" && showAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          className="mt-6 p-6 rounded-xl border border-white/[0.15] bg-white/[0.03] backdrop-blur-sm"
                        >
                          <div className="flex items-center mb-3">
                            {isCorrect ? (
                              <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-400 mr-3" />
                            )}
                            <span
                              className={cn(
                                "text-lg font-semibold",
                                isCorrect ? "text-green-400" : "text-red-400"
                              )}
                            >
                              {isCorrect ? "Correct! Well done!" : "Incorrect"}
                            </span>
                          </div>
                          <p className="text-white/80 mb-3">
                            The correct answer is:{" "}
                            <span className="font-semibold text-white">
                              {formatTextWithLatex(currentQ?.answer)}
                            </span>
                          </p>
                          {currentQ?.explanation && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ delay: 0.2 }}
                              className="mt-4 pt-4 border-t border-white/[0.1]"
                            >
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-semibold text-yellow-400 mb-2">
                                    Explanation:
                                  </p>
                                  <p className="text-white/70 text-sm leading-relaxed">
                                    {formatTextWithLatex(currentQ.explanation)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="relative z-10 px-6 pb-6">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="border-white/[0.15] text-white hover:bg-white/[0.05] px-8 py-3 bg-transparent hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowCalculator(!showCalculator)}
                className="px-6 py-3 mx-4 border-white/[0.15] text-white hover:bg-white hover:text-black bg-transparent transition-colors duration-200"
                variant="outline"
              >
                <CalculatorIcon className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={nextQuestion}
                disabled={selectedMode === "traditional" && !isAnswered}
                className="px-8 py-3 text-lg font-semibold"
                style={{ backgroundColor: selectedTheme.primary }}
              >
                {currentQuestion === questions.length - 1 ? (
                  <>
                    <Trophy className="w-5 h-5 mr-2" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Calculator Overlay */}
        <AnimatePresence>
          {showCalculator && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCalculator(false)}
            >
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  duration: 0.4
                }}
                className="w-full max-w-md mx-4 mb-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-black/90 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                      <CalculatorIcon className="w-5 h-5" />
                      Calculator
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCalculator(false)}
                      className="text-white/70 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 p-0"
                    >
                      ✕
                    </Button>
                  </div>
                  <Calculator />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Dialog */}
        <ImageDialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <ImageDialogContent className="bg-black/90 backdrop-blur-md border-white/20 max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Code Reference</h3>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageDialog(false)}
                className="text-white hover:bg-white/10"
                style={{
                  backgroundColor: selectedTheme.primary,
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = selectedTheme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedTheme.primary;
                  e.currentTarget.style.color = "white";
                }}
                >
                ✕
                </Button>
            </div>
            {currentImage && (
              <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImage}
                  alt="Code reference"
                  className="max-w-full max-h-full object-contain"
                  loading="eager"
                  style={{ imageRendering: 'crisp-edges' }}
                  onError={(e) => {
                    console.error('Failed to load image:', currentImage);
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="text-white text-center p-8">
                          <p class="text-red-400 mb-2">❌ Failed to load image</p>
                          <p class="text-sm text-white/60">${currentImage}</p>
                        </div>
                      `;
                    }
                  }}
                  onLoad={() => console.log('✅ Image loaded:', currentImage)}
                />
              </div>
            )}
            <p className="text-sm text-white/70 mt-4 text-center">
              Refer to this code snippet to answer the question num.{currentQuestion + 1}
            </p>
          </ImageDialogContent>
        </ImageDialog>
      </div>
      </MotionConfig>
    );
  }

  if (currentStep === "results") {
    const percentage = Math.round((score / questions.length) * 100);
    const scoreInfo = getScoreMessage();

    return (
      <MotionConfig reducedMotion={isMobile ? "always" : "user"}>
      <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

        {/* Elegant Shapes */}
        {/* Removed for performance */}

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl"
          >
            <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-lg text-white text-center">
              <CardHeader className="pb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-6"
                >
                  {percentage >= 80 ? (
                    <div className="relative">
                      <Trophy
                        className="w-24 h-24 mx-auto"
                        style={{ color: selectedTheme.primary }}
                      />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="absolute -top-2 -right-2"
                      >
                        <Star
                          className="w-8 h-8"
                          style={{ color: selectedTheme.accent }}
                        />
                      </motion.div>
                  </div>
                  ) : percentage >= 60 ? (
                    <Award
                      className="w-24 h-24 mx-auto"
                      style={{ color: selectedTheme.secondary }}
                    />
                  ) : (
                    <Target
                      className="w-24 h-24 mx-auto"
                      style={{ color: selectedTheme.accent }}
                    />
                  )}
                </motion.div>

                <CardTitle className="text-4xl mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                  Quiz{" "}
                  {quizStatus === "timed-out" ? "Time Expired!" : "Completed!"}
                </CardTitle>
                {quizStatus === "timed-out" && (
                  <p className="text-orange-400 text-lg mb-2">
                    Time&apos;s up! Your progress has been saved.
                  </p>
                )}
                <p className={cn("text-xl", scoreInfo.color)}>
                  {scoreInfo.message}
                </p>
              </CardHeader>

              <CardContent className="space-y-8">
                <div className="relative">
                  <div className="w-40 h-40 mx-auto relative">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="6"
                        fill="none"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke={selectedTheme.primary}
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 35}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 35 }}
                        animate={{
                          strokeDashoffset:
                            2 * Math.PI * 35 * (1 - percentage / 100),
                        }}
                        transition={{
                          duration: 2,
                          delay: 0.5,
                          ease: "easeOut",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="text-4xl font-bold"
                      >
                        {percentage}%
                      </motion.span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/[0.03] p-6 rounded-xl border border-white/[0.08]"
                  >
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-green-400 mb-1">
                      {score}
                    </div>
                    <div className="text-sm text-white/60">Correct</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white/[0.03] p-6 rounded-xl border border-white/[0.08]"
                  >
                    <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-red-400 mb-1">
                      {questions.length - score}
                    </div>
                    <div className="text-sm text-white/60">Incorrect</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-white/[0.03] p-6 rounded-xl border border-white/[0.08]"
                  >
                    <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-blue-400 mb-1">
                      {questions.length}
                    </div>
                    <div className="text-sm text-white/60">Total</div>
                  </motion.div>
                </div>

                <div className="flex gap-4" style={{ display: "grid" }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("review")}
                      style={{
                        backgroundColor: selectedTheme.primary,
                        color: "white",
                      }}
                      className="w-full border-white/[0.15] text-white hover:bg-white/[0.05] py-4 text-lg"
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      Review Answers
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Clear session storage before reload
                        sessionStorage.removeItem(`quiz_${quizData.code}_answers`);
                        window.location.reload(); // Refresh the page
                        setCurrentStep("setup");
                        setCurrentQuestion(0);
                        setUserAnswers({});
                        setScore(0);
                        setAnswerRevealed({});
                        setQuizStatus("completed");
                        setQuizSubmitted(false); 
                        // Reset submission state
                      }}
                      style={{
                      backgroundColor: selectedTheme.primary,
                      color: "white",
                      }}
                      className="w-full border-white/[0.15] text-white hover:bg-white/[0.05] py-4 text-lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Try Again
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={() => window.history.back()}
                      className="w-full py-4 text-lg font-semibold"
                      style={{ backgroundColor: selectedTheme.primary }}
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back to Course
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      </MotionConfig>
    );
  }

  if (currentStep === "review") {
    return (
      <MotionConfig reducedMotion={isMobile ? "always" : "user"}>
      <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

        {/* Elegant Shapes */}
        {/* Removed for performance */}

        <div className="relative z-10 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
              >
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep("results")}
                  className="text-white/60 hover:text-white hover:bg-white/[0.05] border border-white/[0.08]"
                  style={{ backgroundColor: `${selectedTheme.primary}20` }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Results
                </Button>
                <Badge
                  variant="outline"
                  className="text-lg px-6 py-3 border-white/[0.15] text-white/70"
                  style={{ backgroundColor: `${selectedTheme.primary}20` }}
                >
                  Answer Review
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              >
                Your Quiz Answers
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-white/60"
              >
                Review your performance and learn from the correct answers
              </motion.p>
            </div>

            {/* Answer blocks */}
            <div className="grid gap-6">
              {questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.answer;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={cn(
                        "bg-white/[0.02] border-2 backdrop-blur-lg transition-all",
                        isCorrect
                          ? "border-green-500/[0.3] bg-green-500/[0.05]"
                          : "border-red-500/[0.3] bg-red-500/[0.05]"
                      )}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                                        <Badge
                            variant="outline"
                            className="text-sm px-3 py-1 border-white/[0.15] text-white/70"
                            style={{
                              backgroundColor: `${selectedTheme.primary}20`,
                            }}
                          >
                            Question {index + 1}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-sm px-3 py-1 border-white/[0.15] text-white/70"
                            style={{
                              backgroundColor: `${selectedTheme.primary}20`,
                            }}
                          >
                            {question.type}
                          </Badge>
                          {question.image && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShowImage(question.image)}
                              className="border-white/[0.15] text-white hover:bg-white/[0.05] bg-transparent"
                            >
                              <Code className="w-3 h-3 mr-1" />
                              View Code
                            </Button>
                          )}
                        </div>
                        <CardTitle className="text-xl text-white leading-relaxed">
                          {formatTextWithLatex(question.question)}
                        </CardTitle>
                      </div>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="ml-4"
                      >
                        {isCorrect ? (
                          <div className="w-12 h-12 rounded-full bg-green-500/[0.2] border-2 border-green-400 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-red-500/[0.2] border-2 border-red-400 flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-400" />
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* User's answer */}
                      <div className="p-4 rounded-lg border border-white/[0.08] bg-white/[0.02]">
                        <div className="flex items-center gap-3 mb-2">
                          <BookOpen className="w-5 h-5 text-white/60" />
                          <span className="text-sm font-medium text-white/60">
                            Your Answer:
                          </span>
                        </div>
                        <p
                          className={cn(
                            "text-lg font-medium",
                            isCorrect ? "text-green-400" : "text-red-400"
                          )}
                        >
                          {userAnswer ? formatTextWithLatex(userAnswer) : "No answer selected"}
                        </p>
                      </div>

                      {/* Correct answer (if different) */}
                      {!isCorrect && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                          className="p-4 rounded-lg border border-green-500/[0.3] bg-green-500/[0.05]"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Lightbulb className="w-5 h-5 text-green-400" />
                            <span className="text-sm font-medium text-green-400">
                              Correct Answer:
                            </span>
                          </div>
                          <p className="text-lg font-medium text-green-400">
                            {formatTextWithLatex(question.answer)}
                          </p>
                        </motion.div>
                      )}

                      {/* Explanation section */}
                      {question.explanation && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.6 }}
                          className="p-4 rounded-lg border border-yellow-500/[0.3] bg-yellow-500/[0.05]"
                        >
                          <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-medium text-yellow-400 block mb-2">
                                Explanation:
                              </span>
                              <p className="text-white/80 text-sm leading-relaxed">
                                {formatTextWithLatex(question.explanation)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: questions.length * 0.1 + 0.5 }}
          className="mt-12"
        >
          <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Quiz Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-green-500/[0.1] border border-green-500/[0.3]">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {score}
                  </div>
                  <div className="text-sm text-white/60">
                    Correct Answers
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-red-500/[0.1] border border-red-500/[0.3]">
                  <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-400 mb-1">
                    {questions.length - score}
                  </div>
                  <div className="text-sm text-white/60">
                    Incorrect Answers
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.05] border border-white/[0.15]">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <div className="text-sm text-white/60">Final Score</div>
                </div>
              </div>

              <div
                className="flex gap-4 mt-8 justify-center"
                style={{ display: "-grid" }}
              >
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("results")}
                  className="border-white/[0.15] text-white hover:bg-white/[0.05] px-8 py-3"
                  style={{
                    backgroundColor: selectedTheme.primary,
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = selectedTheme.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = selectedTheme.primary;
                    e.currentTarget.style.color = "white";
                  }}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Results
                </Button>
                <Button
                  onClick={() => window.history.back()}
                  className="px-8 py-3 font-semibold"
                  style={{ backgroundColor: selectedTheme.primary }}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Back to Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>

    {/* Image Dialog */}
    <ImageDialog open={showImageDialog} onOpenChange={setShowImageDialog}>
      <ImageDialogContent className="bg-black/90 backdrop-blur-md border-white/20 max-w-4xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Code Reference</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImageDialog(false)}
            className="text-white hover:bg-white/10"
          >
            ✕
          </Button>
        </DialogHeader>
        {currentImage && (
          <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt="Code reference"
              className="max-w-full max-h-full object-contain"
              loading="eager"
              style={{ imageRendering: 'crisp-edges' }}
              onError={(e) => {
                console.error('Failed to load image:', currentImage);
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="text-white text-center p-8">
                      <p class="text-red-400 mb-2">❌ Failed to load image</p>
                      <p class="text-sm text-white/60">${currentImage}</p>
                    </div>
                  `;
                }
              }}
              onLoad={() => console.log('✅ Image loaded:', currentImage)}
            />
          </div>
        )}
        <p className="text-sm text-white/70 mt-4 text-center">
          Refer to this code snippet to answer the question num.{currentQuestion + 1}
        </p>
      </ImageDialogContent>
    </ImageDialog>
  </div>
  </MotionConfig>
);
  }
  return null;
}
