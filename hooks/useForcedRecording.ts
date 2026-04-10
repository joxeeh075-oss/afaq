'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useForcedRecording(sessionId: string, userId: string) {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadInterval = useRef<number | null>(null);

  const uploadChunk = async (blob: Blob) => {
    const fileName = `${sessionId}/${Date.now()}.webm`;

    const { data, error } = await supabase.storage
      .from('session-audios')
      .upload(fileName, blob);

    if (error) {
      console.error('Upload error:', error.message);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('session-audios')
      .getPublicUrl(fileName);

    await fetch('/api/recordings/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        file_url: urlData.publicUrl,
        file_name: fileName,
      }),
    });
  };

  const notifyAdmin = async (userId: string, sessionId: string, type: string) => {
    await supabase.from('session_recordings').insert({
      session_id: sessionId,
      file_url: '',
      transcript_text: `notify:${type}`,
      analysis_result: { message: `Failed ${type}` },
      alert_sent: false,
    });
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        if (audioChunks.current.length === 0) return;
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await uploadChunk(audioBlob);
        audioChunks.current = [];
      };

      mediaRecorder.current.start(1000);
      setIsRecording(true);

      uploadInterval.current = window.setInterval(() => {
        if (mediaRecorder.current?.state === 'recording') {
          mediaRecorder.current.stop();
          mediaRecorder.current.start();
        }
      }, 30000);
    } catch (err) {
      setError('فشل في الوصول للميكروفون');
      await notifyAdmin(userId, sessionId, 'recording_failed');
    }
  }, [sessionId, userId]);

  const stopRecording = useCallback(() => {
    if (uploadInterval.current) {
      window.clearInterval(uploadInterval.current);
    }
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
    setIsRecording(false);
  }, []);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return { startRecording, stopRecording, isRecording, error };
}
