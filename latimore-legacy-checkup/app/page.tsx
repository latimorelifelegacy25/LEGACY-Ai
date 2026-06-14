import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#2C3E50] px-4 text-white">
      <section className="max-w-xl rounded-3xl bg-white p-8 text-center text-[#2C3E50] shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#C49A6C]">
          Latimore Life & Legacy LLC
        </p>
        <h1 className="mt-3 text-4xl font-bold">Free Legacy Protection Checkup</h1>
        <p className="mt-4 text-slate-600">
          Protecting Today. Securing Tomorrow. #TheBeatGoesOn
        </p>
        <Link
          href="/education"
          className="mt-8 inline-flex rounded-2xl bg-[#C49A6C] px-6 py-4 font-bold text-white"
        >
          Start My Checkup
        </Link>
      </section>
    </main>
  );
}
