export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-black text-white">
      <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">메뉴캐스트 플레이어</h1>
        <p className="mt-1 text-sm text-white/70">디바이스 등록 후 배포된 콘텐츠를 재생합니다. (오프라인 캐시 지원)</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black" href="/register">등록</a>
          <a className="rounded-xl border border-white/20 px-4 py-2 text-sm" href="/play">재생</a>
        </div>
      </div>
    </main>
  );
}
