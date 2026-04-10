'use client';

import { useEffect, useRef } from 'react';
import { useForcedRecording } from '@/hooks/useForcedRecording';
import { Session } from '@/types';

interface JitsiSessionProps {
  session: Session;
  userId: string;
  role: 'teacher' | 'student' | 'admin';
  isObserver?: boolean;
}

export function JitsiSession({ session, userId, role, isObserver = false }: JitsiSessionProps) {
  const jitsiContainer = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const { startRecording, stopRecording } = useForcedRecording(session.id, userId);

  useEffect(() => {
    const initJitsi = async () => {
      if (!jitsiContainer.current) return;

      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      const domain = process.env.JITSI_DOMAIN || 'meet.jit.si';
      const options = {
        roomName: `afaq-${session.room_name}`,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainer.current,
        userInfo: {
          displayName: isObserver ? 'Observer' : role === 'teacher' ? 'المعلم' : 'الطالب',
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: true,
          prejoinPageEnabled: false,
          disableRemoteMute: role !== 'admin',
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: isObserver
            ? []
            : [
                'microphone',
                'camera',
                'closedcaptions',
                'desktop',
                'fullscreen',
                'fodeviceselection',
                'hangup',
                'profile',
                'chat',
                'recording',
                'livestreaming',
                'etherpad',
                'sharedvideo',
                'settings',
                'raisehand',
                'videoquality',
                'filmstrip',
                'feedback',
                'stats',
                'shortcuts',
                'tileview',
                'select-background',
                'download',
                'help',
                'mute-everyone',
                'security',
              ].filter((btn) => {
                if (btn === 'recording' && role !== 'admin') return false;
                return true;
              }),
        },
      };

      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      if (role === 'teacher' && !isObserver) {
        apiRef.current.addListener('audioConferenceJoined', () => {
          startRecording();
        });
      }

      if (isObserver) {
        apiRef.current.addListener('videoConferenceJoined', () => {
          apiRef.current.executeCommand('toggleFilmStrip');
        });
      }
    };

    initJitsi();

    return () => {
      stopRecording();
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [session.room_name, role, isObserver, startRecording, stopRecording]);

  const muteParticipant = (participantId: string) => {
    if (apiRef.current && role === 'admin') {
      apiRef.current.executeCommand('toggleAudio', participantId);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={jitsiContainer} className="w-full h-full" />

      {role === 'admin' && !isObserver && (
        <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-lg z-50">
          <h3 className="font-bold mb-2">لوحة التحكم</h3>
          <button
            onClick={() => muteParticipant('teacher')}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            كتم المعلم
          </button>
          <button
            onClick={() => muteParticipant('student')}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            كتم الطالب
          </button>
        </div>
      )}
    </div>
  );
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}
