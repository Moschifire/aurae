import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-stone-50 text-stone-900">
      <h1 className="text-6xl font-serif mb-4">AURAÉ</h1>
      <p className="text-lg tracking-widest uppercase mb-8">Beauty • Skin • Living</p>
      <Link href="/login" className="px-6 py-2 border border-stone-900 hover:bg-stone-900 hover:text-white transition">
        Admin Portal
      </Link>
    </div>
  );
}