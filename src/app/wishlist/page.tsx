"use client";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-serif mb-10">Your Saved Pieces</h1>
      
      {wishlist.length === 0 ? (
        <p className="text-stone-500 italic">Your wishlist is empty. Explore Auraé collections to find something you love.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((item: any) => (
            <div key={item._id} className="group border-b border-stone-100 pb-6">
              <Link href={`/product/${item._id}`}>
                <div className="aspect-[3/4] relative bg-stone-100 mb-4 overflow-hidden">
                  <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                </div>
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-stone-500 text-xs mt-1">₦{item.price.toLocaleString()}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}