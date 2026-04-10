'use client';

import { useEffect, useRef } from 'react';

export default function JitsiMeet({ roomName }: { roomName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).JitsiMeetExternalAPI) {
        new (window as any).JitsiMeetExternalAPI('meet.jit.si', {
          roomName: `afaq-${roomName}`,
          parentNode: containerRef.current,
          width: '100%',
          height: 600,
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [roomName]);

  return <div ref={containerRef} className="w-full h-[600px]" />;
}
