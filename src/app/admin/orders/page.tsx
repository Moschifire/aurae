import { connectToDB } from "@/lib/db";
import Order from "@/models/Order";

export default async function AdminOrdersPage() {
  await connectToDB();
  const orders = await Order.find().sort({ createdAt: -1 });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif mb-8">Customer Orders</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Order Date</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Shipping Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map((order) => (
              <tr key={order._id} className="text-sm hover:bg-stone-50">
                <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4 font-bold">{order.customer.name} <br/> <span className="text-xs font-normal">{order.customer.phone}</span></td>
                <td className="p-4">
                  {order.items.map((item: any) => (
                    <div key={item.name}>{item.quantity}x {item.name}</div>
                  ))}
                </td>
                <td className="p-4 font-bold">₦{order.totalAmount.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-4 text-stone-500 text-xs">
                  {order.customer.address}, {order.customer.city}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}