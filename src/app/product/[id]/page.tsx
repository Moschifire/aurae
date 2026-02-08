import { connectToDB } from "@/lib/db";
import Product from "@/models/Product";
import Image from "next/image";
import { Heart, ShoppingBag, ShieldCheck, Truck } from "lucide-react";

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  await connectToDB();
  const { id } = await params;
  const product = await Product.findById(id);

  if (!product) return <div className="pt-40 text-center">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left: Image Gallery */}
        <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden rounded-sm">
          <Image 
            src={product.images[0]} 
            alt={product.name} 
            fill 
            className="object-cover"
            priority
          />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <p className="text-stone-400 uppercase text-xs tracking-widest mb-2">{product.category}</p>
          <h1 className="text-4xl font-serif mb-4 text-stone-900">{product.name}</h1>
          <p className="text-2xl mb-8 font-light">₦{product.price.toLocaleString()}</p>
          
          <div className="border-t border-stone-100 pt-8 mb-8">
            <p className="text-stone-600 leading-relaxed mb-8">{product.description}</p>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mb-10">
              <button className="flex-1 bg-stone-900 text-white py-4 rounded-full flex items-center justify-center gap-2 hover:bg-stone-800 transition">
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button className="w-14 h-14 border border-stone-200 rounded-full flex items-center justify-center hover:bg-stone-50 transition text-stone-600">
                <Heart size={20} />
              </button>
            </div>

            {/* Trust Markers */}
            <div className="space-y-4 pt-6 border-t border-stone-100">
              <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-stone-500">
                <Truck size={16} /> Fast shipping within Nigeria
              </div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-stone-500">
                <ShieldCheck size={16} /> 100% Authentic Auraé Guaranteed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}