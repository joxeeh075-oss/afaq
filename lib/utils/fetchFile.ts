export async function fetchFile(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('فشل في تحميل الملف');
  }
  return response.arrayBuffer();
}
