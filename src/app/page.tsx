import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const collections = [
    { name: "AuraéSkin", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000", href: "/shop/skin" },
    { name: "AuraéBeauty", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000", href: "/shop/beauty" }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <Image 
          src="https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2000" 
          alt="Hero" fill className="object-cover transition-transform duration-1000 hover:scale-105"
        />
        <div className="relative z-20 text-center text-white space-y-6">
          <h1 className="text-7xl md:text-9xl font-serif tracking-tighter">Radiance Redefined.</h1>
          <p className="text-sm tracking-[0.3em] uppercase">Ethical • Minimalist • Timeless</p>
          <div className="pt-4">
            <Link href="/shop/skin" className="bg-white text-black px-10 py-4 text-xs uppercase tracking-widest hover:bg-stone-100 transition">
              Explore Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections Grid */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-serif">The Auraé Essentials</h2>
          <Link href="/shop/skin" className="border-b border-black text-xs uppercase tracking-widest pb-1">View All</Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          {collections.map((col) => (
            <Link key={col.name} href={col.href} className="group overflow-hidden relative aspect-[4/5]">
              <Image src={col.img} alt={col.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all" />
              <div className="absolute bottom-10 left-10 text-white">
                <h3 className="text-3xl font-serif mb-2">{col.name}</h3>
                <span className="text-xs uppercase tracking-widest border-b border-white">Shop Now</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}