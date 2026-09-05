import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../context/CourseContext';
import { Quiz, QuizQuestion } from '../../types';
import {
  Lock,
  Clock,
  CheckSquare,
  Award,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const TestsView: React.FC<{ onNavigateToAdmin?: () => void }> = ({
  onNavigateToAdmin,
}) => {
  const { currentUser } = useAuth();
  const { quizzes } = useCourses();

  const isLocked = currentUser?.status === 'pending';

  // Active quiz runner state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!activeQuiz || isSubmitted) return;

    setTimeLeft(activeQuiz.durationMinutes * 60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, isSubmitted]);

  // If status is 'pending', show Admin Approval Lock!
  if (isLocked) {
    return (
      <div id="tests-locked-container" className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-amber-200 dark:border-amber-900/50 shadow-xl relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-6 shadow-inner ring-8 ring-amber-50 dark:ring-amber-950/20">
            <Lock className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800 mb-4">
            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-600" />
            <span>Holatingiz: Kutilmoqda (Pending Approval)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Interaktiv Testlar Bo'limi Qulflangan
          </h1>

          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Talaba <strong className="text-slate-900 dark:text-white">{currentUser?.firstName} {currentUser?.lastName}</strong>,
            testlar va sertifikat olish tizimi faqat administrator tomonidan
            tasdiqlangan foydalanuvchilar uchun ochiq.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm font-medium">
              <Clock className="w-4 h-4 animate-spin text-amber-600" />
              <span>Testlar bo'limi sizning arizangiz administrator tomonidan tasdiqlanganidan so'ng ochiladi.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    if (!activeQuiz) return { correct: 0, total: 0, percentage: 0 };
    let correct = 0;
    activeQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const total = activeQuiz.questions.length;
    const percentage = Math.round((correct / total) * 100);
    return { correct, total, percentage };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="tests-active-container" className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      {!activeQuiz && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 mb-1">
                <span>app</span>
                <span>/</span>
                <span className="font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60">
                  /interactive-tests
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Interaktiv Testlar va Bilim Sinovi
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                O'zlashtirgan bilimlaringizni real vaqtda tekshiring va natijalarni tahlil qiling.
              </p>
            </div>
          </div>

          {/* Test Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                id={`quiz-card-${quiz.id}`}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {quiz.category}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {quiz.durationMinutes} daqiqa
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {quiz.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {quiz.description}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>Savollar: {quiz.questionsCount} ta</span>
                    <span>Qiyinlik darajasi: <strong>{quiz.difficulty}</strong></span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    id={`start-quiz-btn-${quiz.id}`}
                    onClick={() => startQuiz(quiz)}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Testni Boshlash</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Active Quiz Runner */}
      {activeQuiz && (
        <div id="quiz-runner-box" className="space-y-6">
          {/* Runner Top Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                {activeQuiz.category}
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeQuiz.title}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 ${
                  timeLeft < 60
                    ? 'bg-rose-100 text-rose-700 animate-pulse'
                    : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Qolgan vaqt: {formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={() => setActiveQuiz(null)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
              >
                Chiqish
              </button>
            </div>
          </div>

          {!isSubmitted ? (
            /* Questions in progress */
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Progress Indicator */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Savol: {currentQuestionIndex + 1} / {activeQuiz.questions.length}</span>
                  <span>Javob berilgan: {Object.keys(selectedAnswers).length} / {activeQuiz.questions.length}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Current Question */}
              {(() => {
                const question = activeQuiz.questions[currentQuestionIndex];
                return (
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                      {currentQuestionIndex + 1}. {question.question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-2.5">
                      {question.options.map((option, idx) => {
                        const isSelected = selectedAnswers[question.id] === idx;
                        return (
                          <button
                            key={idx}
                            id={`option-btn-${question.id}-${idx}`}
                            onClick={() => handleSelectOption(question.id, idx)}
                            className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-medium'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{option}</span>
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-600 text-white'
                                  : 'border-slate-300 dark:border-slate-700'
                              }`}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-40"
                >
                  Oldingi savol
                </button>

                {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all"
                  >
                    Keyingi savol
                  </button>
                ) : (
                  <button
                    id="submit-quiz-btn"
                    onClick={() => setIsSubmitted(true)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                  >
                    <span>Testni Yakunlash</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Scorecard */
            <div id="quiz-results-card" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-center">
              {(() => {
                const { correct, total, percentage } = calculateScore();
                const isPassed = percentage >= 60;

                return (
                  <div>
                    <div
                      className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-4 ${
                        isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                      }`}
                    >
                      <Award className="w-10 h-10" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {isPassed ? 'Tabriklaymiz! Testdan o\'tdingiz' : 'Qayta urinib ko\'ring'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Siz {total} ta savoldan {correct} tasiga to'g'ri javob berdingiz.
                    </p>

                    <div className="mt-6 inline-flex items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="block text-2xl font-black text-indigo-600 dark:text-indigo-400">
                          {percentage}%
                        </span>
                        <span className="text-[11px] text-slate-400 uppercase font-semibold">
                          Umumiy Ball
                        </span>
                      </div>
                      <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                      <div>
                        <span className="block text-2xl font-black text-slate-800 dark:text-slate-200">
                          {correct}/{total}
                        </span>
                        <span className="text-[11px] text-slate-400 uppercase font-semibold">
                          To'g'ri Javoblar
                        </span>
                      </div>
                    </div>

                    {/* Explanations Accordion */}
                    <div className="mt-8 text-left space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Savollar va To'g'ri Javoblar Tahlili:
                      </h4>

                      <div className="space-y-3">
                        {activeQuiz.questions.map((q, idx) => {
                          const userAnswer = selectedAnswers[q.id];
                          const isCorrect = userAnswer === q.correctIndex;

                          return (
                            <div
                              key={q.id}
                              className={`p-4 rounded-xl border text-xs space-y-2 ${
                                isCorrect
                                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20'
                                  : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {idx + 1}. {q.question}
                                </span>
                                {isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                )}
                              </div>

                              <p className="text-slate-600 dark:text-slate-300">
                                <strong>To'g'ri javob:</strong> {q.options[q.correctIndex]}
                              </p>
                              <p className="text-slate-500 dark:text-slate-400 italic">
                                💡 {q.explanation}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-center gap-3">
                      <button
                        onClick={() => startQuiz(activeQuiz)}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Qayta topshirish</span>
                      </button>
                      <button
                        onClick={() => setActiveQuiz(null)}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                      >
                        Barcha testlarga qaytish
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
