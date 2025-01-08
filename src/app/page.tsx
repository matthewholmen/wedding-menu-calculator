import MenuCalculator from './components/MenuCalculator';

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-black">Wedding Menu Calculator</h1>
        <MenuCalculator />
      </main>
    </div>
  );
}