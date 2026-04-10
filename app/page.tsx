import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-white p-10 shadow-xl ring-1 ring-slate-200">
          <h1 className="text-4xl font-extrabold mb-4">منصة آفاق التعليمية</h1>
          <p className="text-slate-600 leading-7 mb-8">
            منصة متكاملة لإدارة الجلسات المباشرة، التسجيل الإجباري، الواجبات، الامتحانات ولوحة المراقبة للأدمن.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/dashboard/admin/monitoring" className="rounded-2xl bg-blue-600 px-5 py-4 text-white shadow hover:bg-blue-700 transition">
              لوحة المراقبة
            </Link>
            <Link href="/dashboard/teacher/sessions" className="rounded-2xl bg-emerald-600 px-5 py-4 text-white shadow hover:bg-emerald-700 transition">
              جلسات المعلم
            </Link>
            <Link href="/dashboard/student/sessions" className="rounded-2xl bg-amber-500 px-5 py-4 text-white shadow hover:bg-amber-600 transition">
              جلسات الطالب
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
