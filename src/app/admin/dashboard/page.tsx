import { connectToDB } from "@/lib/db";
import Product from "@/models/Product";
// Note: We'll create an Order model later, for now we'll use placeholder data

export default async function DashboardPage() {
  await connectToDB();
  const productCount = await Product.countDocuments();

  const stats = [
    { label: "Total Products", value: productCount, detail: "Across 4 categories" },
    { label: "Total Revenue", value: "₦0.00", detail: "Last 30 days" },
    { label: "Pending Orders", value: "0", detail: "Requires shipping" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-serif mb-8">Executive Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
            <p className="text-xs text-green-600 mt-2">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
        <p className="text-gray-400 font-serif italic">Sales Chart Coming Soon (Integrate Recharts later)</p>
      </div>
    </div>
  );
}