import { connectToDB } from "@/lib/db";
import Product from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  await connectToDB();
  const { category } = await params;

  // Map the URL (skin) to the DB category (AuraéSkin)
  const categoryMap: any = {
    skin: "AuraéSkin",
    beauty: "AuraéBeauty",
    adorn: "AuraéAdorn",
    living: "AuraéLiving",
  };

  const dbCategory = categoryMap[category];
  const products = await Product.find({ category: dbCategory });

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-serif mb-4">{dbCategory}</h1>
        <p className="text-stone-500 uppercase text-xs tracking-[0.2em] italic">Curated for your lifestyle</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product) => (
          <Link href={`/product/${product._id}`} key={product._id} className="group">
            <div className="aspect-[3/4] relative bg-stone-100 overflow-hidden mb-4">
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <button className="absolute bottom-4 left-4 right-4 bg-white/90 py-3 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                Quick Add
              </button>
            </div>
            <h3 className="text-sm font-medium">{product.name}</h3>
            <p className="text-stone-500 text-xs mt-1">₦{product.price.toLocaleString()}</p>
          </Link>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-20 border-t border-dashed border-stone-200">
          <p className="text-stone-400 font-serif italic">New items arriving soon to {dbCategory}.</p>
        </div>
      )}
    </div>
  );
}