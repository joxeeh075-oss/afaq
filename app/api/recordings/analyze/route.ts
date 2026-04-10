import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createServerClient } from '@/lib/supabase/client';
import { fetchFile } from '@/lib/utils/fetchFile';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { session_id, file_url, file_name } = await req.json();
    const supabase = createServerClient();

    const { data: bannedWords } = await supabase.from('banned_words').select('word');
    const bannedList = bannedWords?.map((w) => w.word) || [];

    const audioBuffer = await fetchFile(file_url);
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'audio/webm',
          data: base64Audio,
        },
      },
      {
        text: `حلل هذا الصوت واكتب النص الكامل الموجود فيه. ثم ابحث عن أي من هذه الكلمات الممنوعة: ${bannedList.join(', ')}. أعد النتيجة بالصيغة التالية: {"transcript": "النص الكامل", "violations": ["الكلمات المخالفة الموجودة"]}`,
      },
    ]);

    const response = await result.response;
    const analysis = JSON.parse(response.text());

    await supabase.from('session_recordings').insert({
      session_id,
      file_url: file_name,
      transcript_text: analysis.transcript,
      analysis_result: analysis,
    });

    if (analysis.violations?.length > 0) {
      await sendWhatsAppAlert(session_id, analysis.violations);
      await supabase.from('session_recordings').update({ alert_sent: true }).eq('session_id', session_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}

async function sendWhatsAppAlert(sessionId: string, violations: string[]) {
  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

  await client.messages.create({
    body: `⚠️ تنبيه أمني\nجلسة: ${sessionId}\nكلمات مخالفة: ${violations.join(', ')}`,
    from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER,
    to: 'whatsapp:' + process.env.ADMIN_WHATSAPP_NUMBER,
  });
}
