export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">لوحة تحكم الأدمن</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-2">المستخدمين</h2>
          <p className="text-gray-600">إدارة المعلمين والطلاب</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-2">الجلسات</h2>
          <p className="text-gray-600">مراقبة الجلسات المباشرة</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-2">التقارير</h2>
          <p className="text-gray-600">تقارير Gemini والمخالفات</p>
        </div>
      </div>
    </div>
  );
}
