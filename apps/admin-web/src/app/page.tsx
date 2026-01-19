export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-zinc-50">
      <div className="w-full max-w-lg rounded-xl border bg-white p-6">
        <h1 className="text-xl font-semibold">메뉴캐스트 관리자</h1>
        <p className="mt-1 text-sm text-gray-600">업로드, 플레이리스트, 배포를 관리하는 MVP CMS입니다.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a className="rounded-md bg-black px-3 py-2 text-sm text-white" href="/login">로그인</a>
          <a className="rounded-md border px-3 py-2 text-sm" href="/dashboard">대시보드</a>
        </div>
      </div>
    </main>
  );
}
