import { connectToDB } from "@/lib/db";
import Product from "@/models/Product";
import Image from "next/image";
import { ShieldCheck, Truck } from "lucide-react";
import ProductActions from "@/components/ProductActions"; // Add this import

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  await connectToDB();
  const { id } = await params;
  const product = await Product.findById(id);

  if (!product) return <div className="pt-40 text-center">Product not found</div>;

  // Convert MongoDB doc to a plain JavaScript object for the Client Component
  const plainProduct = JSON.parse(JSON.stringify(product));

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

            {/* Action Buttons Component */}
            <ProductActions product={plainProduct} />

            <div className="mt-4 opacity-70 scale-90 origin-left">
              {/* Trustpilot Mini Widget */}
              <div className="trustpilot-widget" data-locale="en-US" data-template-id="5419631f13dc042864d11139" data-businessunit-id="YOUR_ID" data-style-height="24px" data-style-width="100%" data-theme="light">
                <a href="https://www.trustpilot.com/review/aurae.com" target="_blank" rel="noopener">Trustpilot</a>
              </div>
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