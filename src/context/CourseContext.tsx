import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Quiz, QuizQuestion, Lesson } from '../types';
import { INITIAL_COURSES, INITIAL_QUIZZES } from '../data/mockData';

interface CourseContextType {
  courses: Course[];
  quizzes: Quiz[];
  addCourse: (course: Omit<Course, 'id' | 'studentsCount' | 'rating'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  toggleLessonCompleted: (courseId: string, lessonId: string) => void;
  addLessonToCourse: (courseId: string, lesson: Omit<Lesson, 'id'>) => void;
  updateLessonInCourse: (courseId: string, lessonId: string, updates: Partial<Lesson>) => void;
  deleteLessonFromCourse: (courseId: string, lessonId: string) => void;
  addQuiz: (quiz: Omit<Quiz, 'id'>) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  addQuestionToQuiz: (quizId: string, question: Omit<QuizQuestion, 'id'>) => void;
  updateQuestionInQuiz: (quizId: string, questionId: string, updates: Partial<QuizQuestion>) => void;
  deleteQuestionFromQuiz: (quizId: string, questionId: string) => void;
  clearAllCourses: () => void;
  clearAllQuizzes: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(() => {
    const version = localStorage.getItem('eduplatform-courses-version');
    if (version !== 'v2') {
      localStorage.setItem('eduplatform-courses-version', 'v2');
      localStorage.setItem('eduplatform-courses', JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    const saved = localStorage.getItem('eduplatform-courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved courses', e);
      }
    }
    return INITIAL_COURSES;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('eduplatform-quizzes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved quizzes', e);
      }
    }
    return INITIAL_QUIZZES;
  });

  useEffect(() => {
    localStorage.setItem('eduplatform-courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('eduplatform-quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  const addCourse = (newCourseData: Omit<Course, 'id' | 'studentsCount' | 'rating'>) => {
    const newCourse: Course = {
      ...newCourseData,
      id: `course-${Date.now()}`,
      studentsCount: 0,
      rating: 5.0,
    };
    setCourses((prev) => [newCourse, ...prev]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleLessonCompleted = (courseId: string, lessonId: string) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id !== courseId) return course;
        return {
          ...course,
          lessons: course.lessons.map((lesson) =>
            lesson.id === lessonId
              ? { ...lesson, isCompleted: !lesson.isCompleted }
              : lesson
          ),
        };
      })
    );
  };

  const addLessonToCourse = (courseId: string, lesson: Omit<Lesson, 'id'>) => {
    const newLesson: Lesson = {
      ...lesson,
      id: `lesson-${Date.now()}`,
    };
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              lessons: [...c.lessons, newLesson],
              lessonsCount: c.lessons.length + 1,
            }
          : c
      )
    );
  };

  const updateLessonInCourse = (courseId: string, lessonId: string, updates: Partial<Lesson>) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              lessons: c.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)),
            }
          : c
      )
    );
  };

  const deleteLessonFromCourse = (courseId: string, lessonId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              lessons: c.lessons.filter((l) => l.id !== lessonId),
              lessonsCount: Math.max(0, c.lessons.length - 1),
            }
          : c
      )
    );
  };

  const clearAllCourses = () => {
    setCourses([]);
    localStorage.removeItem('eduplatform-courses');
  };

  const clearAllQuizzes = () => {
    setQuizzes([]);
    localStorage.removeItem('eduplatform-quizzes');
  };

  const addQuiz = (quizData: Omit<Quiz, 'id'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
      questionsCount: quizData.questions?.length || 0,
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
  };

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    setQuizzes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const deleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  const addQuestionToQuiz = (quizId: string, questionData: Omit<QuizQuestion, 'id'>) => {
    const newQuestion: QuizQuestion = {
      ...questionData,
      id: `q-${Date.now()}`,
    };
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quizId
          ? {
              ...q,
              questions: [...q.questions, newQuestion],
              questionsCount: q.questions.length + 1,
            }
          : q
      )
    );
  };

  const updateQuestionInQuiz = (quizId: string, questionId: string, updates: Partial<QuizQuestion>) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quizId
          ? {
              ...q,
              questions: q.questions.map((item) => (item.id === questionId ? { ...item, ...updates } : item)),
            }
          : q
      )
    );
  };

  const deleteQuestionFromQuiz = (quizId: string, questionId: string) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quizId
          ? {
              ...q,
              questions: q.questions.filter((item) => item.id !== questionId),
              questionsCount: Math.max(0, q.questions.length - 1),
            }
          : q
      )
    );
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        quizzes,
        addCourse,
        updateCourse,
        deleteCourse,
        toggleLessonCompleted,
        addLessonToCourse,
        updateLessonInCourse,
        deleteLessonFromCourse,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        addQuestionToQuiz,
        updateQuestionInQuiz,
        deleteQuestionFromQuiz,
        clearAllCourses,
        clearAllQuizzes,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
}
