'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Question } from '@/types';
import type { Json } from '@/types/database';

export function AssignmentForm({ teacherId, agreementId }: { teacherId: string; agreementId: string }) {
  const [title, setTitle] = useState('');
  const [isExam, setIsExam] = useState(false);
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([
    { text: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 }]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('assignments').insert({
      teacher_id: teacherId,
      agreement_id: agreementId,
      title,
      questions: questions as unknown as Json,
      is_exam: isExam,
      exam_duration_minutes: isExam ? duration : null,
    });

    if (error) {
      alert('حدث خطأ أثناء إنشاء الواجب');
      return;
    }

    alert('تم الإنشاء بنجاح');
    setTitle('');
    setIsExam(false);
    setDuration(30);
    setQuestions([{ text: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 }]);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">إنشاء {isExam ? 'امتحان' : 'واجب'}</h2>

      <div className="mb-4">
        <label className="block mb-2">العنوان</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isExam} onChange={(e) => setIsExam(e.target.checked)} />
          امتحان (مؤقت)
        </label>
        {isExam && (
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            className="border p-2 w-24 rounded"
            min={5}
            max={180}
          />
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="border p-4 rounded bg-slate-50">
            <h4 className="font-bold mb-2">السؤال {idx + 1}</h4>
            <input
              type="text"
              placeholder="نص السؤال"
              value={q.text}
              onChange={(e) => updateQuestion(idx, 'text', e.target.value)}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <div className="grid grid-cols-2 gap-2 mb-3">
              {q.options.map((opt, optIdx) => (
                <input
                  key={optIdx}
                  type="text"
                  placeholder={`الخيار ${optIdx + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...q.options];
                    newOptions[optIdx] = e.target.value;
                    updateQuestion(idx, 'options', newOptions);
                  }}
                  className="p-2 border rounded"
                  required
                />
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={q.correctAnswer}
                onChange={(e) => updateQuestion(idx, 'correctAnswer', parseInt(e.target.value, 10))}
                className="border p-2 rounded flex-1"
              >
                {q.options.map((_, i) => (
                  <option key={i} value={i}>
                    الإجابة الصحيحة: {i + 1}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={q.points}
                onChange={(e) => updateQuestion(idx, 'points', parseInt(e.target.value, 10))}
                className="border p-2 w-28 rounded"
                placeholder="الدرجة"
                min={1}
                required
              />
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addQuestion} className="mt-4 w-full bg-slate-200 py-3 rounded hover:bg-slate-300">
        + إضافة سؤال
      </button>

      <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
        حفظ {isExam ? 'الامتحان' : 'الواجب'}
      </button>
    </form>
  );
}
