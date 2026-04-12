'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { getLesson, getNextLessonId } from '@/lib/curriculum';
import { LessonFlow } from '@/components/lesson/LessonFlow';

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const completeLesson = useStore(s => s.completeLesson);
  const addCard = useStore(s => s.addCard);
  const updateStreak = useStore(s => s.updateStreak);
  const setCurrentLesson = useStore(s => s.setCurrentLesson);
  const endSession = useStore(s => s.endSession);

  const lesson = getLesson(id);

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🏗️</div>
          <h2 className="text-xl font-bold text-stone-900">Coming Soon!</h2>
          <p className="text-stone-500 mt-2 text-sm">This lesson is being crafted...</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-blue-600 font-medium text-sm hover:text-blue-700"
          >
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  const handleComplete = (xpEarned: number, accuracy: number) => {
    // Add SRS cards for new vocabulary
    lesson.newVocabulary.forEach(vocabId => {
      addCard('vocabulary', vocabId);
    });

    // Add SRS cards for new grammar
    lesson.newGrammarIds.forEach(grammarId => {
      addCard('grammar', grammarId);
    });

    // Complete the lesson
    completeLesson(lesson.id, xpEarned);
    updateStreak();
    endSession();

    // Advance to next lesson
    const nextId = getNextLessonId(lesson.id);
    if (nextId) {
      // Parse world/chapter from lesson ID pattern w1-c1-l1
      const parts = nextId.split('-');
      const worldId = parseInt(parts[0].replace('w', ''));
      const chapterId = `${parts[0]}-${parts[1]}`;
      setCurrentLesson(worldId, chapterId, nextId);
    }

    router.push('/');
  };

  const handleExit = () => {
    endSession();
    router.push('/');
  };

  return (
    <div className="min-h-screen p-4">
      <LessonFlow
        lesson={lesson}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    </div>
  );
}
