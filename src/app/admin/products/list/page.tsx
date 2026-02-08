import { connectToDB } from "@/lib/db";
import Product from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import { Edit } from "lucide-react";
import DeleteProductBtn from "@/components/DeleteProductBtn";

export default async function ProductListPage() {
    await connectToDB();
    const products = await Product.find({}).sort({ createdAt: -1 });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif">Inventory</h2>
                <span className="bg-stone-200 px-4 py-1 rounded-full text-sm">{products.length} Items</span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Product</th>
                            <th className="px-6 py-4 font-semibold">Category</th>
                            <th className="px-6 py-4 font-semibold">Price</th>
                            <th className="px-6 py-4 font-semibold">Stock</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <div className="w-12 h-12 relative rounded bg-gray-100 overflow-hidden">
                                        {product.images?.[0] && (
                                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                        )}
                                    </div>
                                    <span className="font-medium text-gray-900">{product.name}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                <td className="px-6 py-4 font-semibold text-gray-900">₦{product.price.toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                                <td className="px-6 py-4 flex gap-4">
                                    <Link href={`/admin/products/edit/${product._id.toString()}`} className="text-blue-500 hover:text-blue-700">
                                        <Edit size={18} />
                                    </Link>
                                    <DeleteProductBtn id={product._id.toString()} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}