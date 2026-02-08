"use client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteProductBtn({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh(); // Refreshes the list automatically
      }
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 transition">
      <Trash2 size={18} />
    </button>
  );
}