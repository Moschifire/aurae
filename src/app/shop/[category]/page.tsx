import { connectToDB } from "@/lib/db";
import Product from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

// 1. Define the unique content for each branch
const categoryDetails: Record<string, { title: string; dbName: string; desc: string }> = {
  skin: {
    title: "AuraéSkin",
    dbName: "AuraéSkin",
    desc: "Scientific precision meets botanical soul. High-performance skincare for a radiant tomorrow."
  },
  beauty: {
    title: "AuraéBeauty",
    dbName: "AuraéBeauty",
    desc: "Effortless color and texture designed for the modern minimalist. Beauty that breathes."
  },
  adorn: {
    title: "AuraéAdorn",
    dbName: "AuraéAdorn",
    desc: "Curated jewelry, glasses, and accessories. The final touch to a perfectly composed look."
  },
  living: {
    title: "AuraéLiving",
    dbName: "AuraéLiving",
    desc: "Transform your space into a sanctuary with our curated home essentials and scents."
  },
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  // Capitalize first letter
  const title = category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `Auraé${title}`,
    description: `Shop the latest in Auraé${title}. Curated pieces for your lifestyle.`
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  // 2. Await params (Required in Next.js 15)
  const { category } = await params;
  const info = categoryDetails[category];

  // If the category in the URL is invalid (e.g., /shop/shoes), handle gracefully
  if (!info) {
    return (
      <div className="pt-40 text-center font-serif italic text-stone-500">
        Collection not found.
      </div>
    );
  }

  // 3. Fetch data from MongoDB
  await connectToDB();
  const products = await Product.find({ category: info.dbName }).sort({ createdAt: -1 });

  return (
    <div className="max-w-7xl mx-auto py-20 px-6 min-h-screen">
      {/* Responsive Header */}
      <header className="mb-12 md:mb-20">
        <h1 className="text-4xl md:text-7xl font-serif mb-4">{info.title}</h1>
        <p className="text-stone-500 text-sm md:text-xl font-light max-w-2xl">{info.desc}</p>

        {/* Horizontal Quick-Switch for Mobile */}
        <div className="flex md:hidden overflow-x-auto gap-4 mt-8 no-scrollbar pb-2">
          {Object.keys(categoryDetails).map((key) => (
            <Link
              key={key}
              href={`/shop/${key}`}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] uppercase tracking-widest border ${category === key ? 'bg-black text-white border-black' : 'border-stone-200 text-stone-500'}`}
            >
              {key}
            </Link>
          ))}
        </div>
      </header>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <Link
              href={`/product/${product._id}`}
              key={product._id.toString()}
              className="group block"
            >
              {/* Product Image Container */}
              <div className="aspect-[3/4] relative bg-stone-50 overflow-hidden mb-6 rounded-sm border border-stone-100/50">
                <Image
                  src={product.images[0] || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Subtle Hover Action */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <div className="bg-white/90 px-6 py-3 text-[10px] uppercase tracking-widest opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 shadow-sm font-bold">
                    <ShoppingBag size={12} /> View Details
                  </div>
                </div>
              </div>

              {/* Product Meta */}
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-stone-500 text-xs font-light tracking-wide uppercase">
                  {info.title}
                </p>
                <p className="text-stone-900 text-sm font-semibold pt-1">
                  ₦{product.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-40 border-t border-stone-100">
          <p className="text-stone-400 font-serif italic text-lg mb-4">
            New items arriving soon to {info.title}.
          </p>
          <Link href="/" className="text-[10px] uppercase tracking-widest border-b border-stone-900 pb-1 font-bold">
            Explore other Collections
          </Link>
        </div>
      )}
    </div>
  );
}