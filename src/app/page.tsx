import Game from '@/components/Game';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gradient-to-b from-sky-400 to-sky-200">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">Slappy Bird</h1>
        <Game />
      </div>
    </main>
  );
}
