'use client';

import { useState, useEffect } from 'react';
import { Assignment } from '@/types';
import { supabase } from '@/lib/supabase/client';
import type { Json } from '@/types/database';

export function ExamTaker({ assignment, studentId }: { assignment: Assignment; studentId: string }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(assignment.exam_duration_minutes! * 60);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (submitted) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [submitted]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionIndex]: answerIndex });
  };

  const handleSubmit = async () => {
    if (submitted) return;

    let totalScore = 0;
    assignment.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        totalScore += q.points;
      }
    });

    const { error } = await supabase.from('submissions').insert({
      assignment_id: assignment.id,
      student_id: studentId,
      answers: answers as unknown as Json,
      score: totalScore,
      started_at: new Date(Date.now() - (assignment.exam_duration_minutes! * 60 - timeLeft) * 1000).toISOString(),
    });

    if (!error) {
      setScore(totalScore);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">تم تسليم الامتحان</h2>
        <p className="text-xl">درجتك: {score} من {assignment.questions.reduce((acc, q) => acc + q.points, 0)}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="sticky top-0 bg-white border-b p-4 mb-6 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold">{assignment.title}</h1>
        <div className={`text-2xl font-mono ${timeLeft < 60 ? 'text-red-600' : 'text-blue-600'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="space-y-6">
        {assignment.questions.map((q, idx) => (
          <div key={idx} className="bg-white p-6 rounded shadow border">
            <h3 className="font-bold mb-4">{idx + 1}. {q.text} ({q.points} درجات)</h3>
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleAnswer(idx, optIdx)}
                  className={`w-full text-right p-3 rounded border transition ${
                    answers[idx] === optIdx ? 'bg-blue-100 border-blue-500' : 'hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="fixed bottom-6 left-6 bg-green-600 text-white px-8 py-3 rounded shadow-lg hover:bg-green-700"
      >
        تسليم الامتحان
      </button>
    </div>
  );
}
