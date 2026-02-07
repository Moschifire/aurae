"use client";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "AuraéSkin", // Default
    stock: "",
  });
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({ ...formData, images: [imageUrl] }),
    });
    if (res.ok) alert("Product added successfully!");
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          className="w-full p-2 border" placeholder="Product Name" 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <textarea 
          className="w-full p-2 border" placeholder="Description"
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
        
        <select 
          className="w-full p-2 border"
          onChange={(e) => setFormData({...formData, category: e.target.value})}
        >
          <option value="AuraéSkin">AuraéSkin (Skincare)</option>
          <option value="AuraéBeauty">AuraéBeauty (Makeup)</option>
          <option value="AuraéAdorn">AuraéAdorn (Accessories)</option>
          <option value="AuraéLiving">AuraéLiving (Home)</option>
        </select>

        <div className="flex gap-4">
          <input className="w-1/2 p-2 border" placeholder="Price" type="number" onChange={(e) => setFormData({...formData, price: e.target.value})} />
          <input className="w-1/2 p-2 border" placeholder="Stock" type="number" onChange={(e) => setFormData({...formData, stock: e.target.value})} />
        </div>

        {/* Image Upload Widget */}
        <CldUploadWidget 
          uploadPreset="aurae_uploads" 
          onSuccess={(result: any) => setImageUrl(result.info.secure_url)}
        >
          {({ open }) => (
            <button type="button" onClick={() => open()} className="bg-gray-200 p-2 rounded w-full">
              {imageUrl ? "Image Uploaded ✅" : "Upload Product Image"}
            </button>
          )}
        </CldUploadWidget>

        <button className="w-full bg-black text-white p-3 rounded">Publish Product</button>
      </form>
    </div>
  );
}