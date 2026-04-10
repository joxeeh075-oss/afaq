'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Session } from '@/types';
import { JitsiSession } from '@/components/jitsi/JitsiSession';
import { Video, MicOff } from 'lucide-react';

export default function MonitoringPage() {
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data } = await supabase
        .from('sessions')
        .select('*, teacher:users!teacher_id(*), student:users!student_id(*)')
        .eq('status', 'active');

      setActiveSessions((data as Session[]) || []);
    };

    const subscription = supabase
      .channel('active-sessions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sessions',
      }, fetchSessions)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">لوحة المراقبة المباشرة</h1>

      {activeSessions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">لا توجد جلسات نشطة حالياً</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="bg-white rounded-lg shadow p-4 border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold">{session.teacher?.full_name}</h3>
                  <p className="text-sm text-gray-600">{session.student?.full_name}</p>
                  <p className="text-xs text-gray-400">{session.room_name}</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">نشط</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSession(session)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
                >
                  <Video size={16} />
                  مراقبة صامتة
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-gray-100 py-1 rounded text-sm flex items-center justify-center gap-1">
                  <MicOff size={14} />
                  كتم المعلم
                </button>
                <button className="flex-1 bg-gray-100 py-1 rounded text-sm flex items-center justify-center gap-1">
                  <MicOff size={14} />
                  كتم الطالب
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSession && (
        <div className="fixed inset-0 bg-black/70 z-50 p-4">
          <div className="bg-white rounded-lg h-full overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3>وضع المراقبة: {selectedSession.teacher?.full_name} - {selectedSession.student?.full_name}</h3>
              <button
                onClick={() => setSelectedSession(null)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                إغلاق
              </button>
            </div>
            <div className="h-[calc(100%-80px)]">
              <JitsiSession session={selectedSession} userId="admin" role="admin" isObserver={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
