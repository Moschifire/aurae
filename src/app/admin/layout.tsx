import Link from "next/link";
import { LayoutDashboard, ShoppingBag, PlusCircle, LogOut, Package } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-serif font-bold tracking-tighter text-stone-800">AURAÉ ADMIN</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-stone-100 rounded-lg transition">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-stone-100 rounded-lg transition">
            <PlusCircle size={20} /> Add Product
          </Link>
          <Link href="/admin/products/list" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-stone-100 rounded-lg transition">
            <Package size={20} /> Inventory
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-stone-100 rounded-lg transition">
            <ShoppingBag size={20} /> Orders
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link href="/api/auth/signout" className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition">
            <LogOut size={20} /> Logout
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}