"use client";
import { useEffect, useState, use } from "react"; // Added 'use'
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Unwrap the params properly for Next.js 15
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // 2. Fetch data with error handling
  useEffect(() => {
    async function getProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        
        if (data && !data.error) {
          setFormData(data);
          // Only set image if it exists in the array
          if (data.images && data.images.length > 0) {
            setImageUrl(data.images[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    getProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, images: [imageUrl] }),
    });
    if (res.ok) {
      alert("Product updated!");
      router.push("/admin/products/list");
      router.refresh();
    }
  };

  // 3. Proper Loading UI
  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-900"></div>
      <p className="ml-4 font-serif italic text-stone-600">Retrieving Auraé product details...</p>
    </div>
  );

  if (!formData) return <p className="p-10 text-red-500">Product not found.</p>;

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h2 className="text-3xl font-serif mb-8 text-stone-800">Edit {formData.name}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-stone-100">
        <div>
          <label className="text-xs uppercase tracking-widest text-stone-500 mb-2 block font-semibold">Product Name</label>
          <input 
            className="w-full p-3 border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-stone-400 transition" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-stone-500 mb-2 block font-semibold">Description</label>
          <textarea 
            rows={4}
            className="w-full p-3 border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-stone-400 transition" 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-stone-500 mb-2 block font-semibold">Category</label>
            <select 
              className="w-full p-3 border border-stone-200 rounded-lg"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="AuraéSkin">AuraéSkin</option>
              <option value="AuraéBeauty">AuraéBeauty</option>
              <option value="AuraéAdorn">AuraéAdorn</option>
              <option value="AuraéLiving">AuraéLiving</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-stone-500 mb-2 block font-semibold">Price (₦)</label>
            <input className="w-full p-3 border border-stone-200 rounded-lg" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-stone-500 mb-2 block font-semibold">Visual Representation</label>
          <CldUploadWidget uploadPreset="aurae_uploads" onSuccess={(result: any) => setImageUrl(result.info.secure_url)}>
            {({ open }) => (
              <div 
                onClick={() => open()} 
                className="cursor-pointer border-2 border-dashed border-stone-200 rounded-xl p-8 text-center hover:bg-stone-50 transition"
              >
                {imageUrl ? (
                  <div className="relative w-32 h-32 mx-auto">
                    <img src={imageUrl} alt="preview" className="rounded-lg object-cover w-full h-full" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition rounded-lg">
                      <span className="text-white text-xs font-bold">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-stone-400">Click to upload new image</p>
                )}
              </div>
            )}
          </CldUploadWidget>
        </div>

        <button className="w-full bg-stone-900 text-white py-4 rounded-lg font-bold hover:bg-stone-800 transition shadow-lg">
          Update Collection
        </button>
      </form>
    </div>
  );
}