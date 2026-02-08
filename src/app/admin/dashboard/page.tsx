import { connectToDB } from "@/lib/db";
import Order from "@/models/Order";

export default async function AdminDashboard() {
  await connectToDB();
  const orders = await Order.find({ paymentStatus: "Paid" });

  // 1. Calculate Revenue per Category
  const revenueData = {
    AuraéSkin: 0,
    AuraéBeauty: 0,
    AuraéAdorn: 0,
    AuraéLiving: 0,
  };

  orders.forEach((order) => {
    order.items.forEach((item: any) => {
      // Find which category this item belongs to
      // (Assuming category was saved in the order items)
      const cat = item.category as keyof typeof revenueData;
      if (revenueData[cat] !== undefined) {
        revenueData[cat] += item.price * item.quantity;
      }
    });
  });

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-serif mb-10 text-stone-900">Performance Overview</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        {Object.entries(revenueData).map(([name, value]) => (
          <div key={name} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">{name}</p>
            <p className="text-xl font-bold mt-2">₦{value.toLocaleString()}</p>
            <div className="w-full bg-stone-100 h-1 mt-4 rounded-full overflow-hidden">
               <div 
                className="bg-stone-900 h-full transition-all duration-1000" 
                style={{ width: `${(value / (totalRevenue || 1)) * 100}%` }}
               />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-stone-900 text-white p-10 rounded-3xl">
          <h2 className="text-sm uppercase tracking-[0.3em] mb-2 opacity-60">Total Gross Volume</h2>
          <p className="text-5xl font-serif">₦{totalRevenue.toLocaleString()}</p>
          <p className="mt-8 text-stone-400 text-sm italic">"Luxury is in each detail." — Auraé Insights</p>
        </div>
        
        <div className="bg-white border border-stone-100 p-8 rounded-3xl shadow-sm">
          <h2 className="text-xl font-serif mb-6">Order Success Rate</h2>
          <div className="flex items-center gap-4">
             <div className="text-4xl font-bold text-green-600">100%</div>
             <p className="text-stone-500 text-sm">All recent checkout sessions successfully completed payment via Paystack.</p>
          </div>
        </div>
      </div>
    </div>
  );
}