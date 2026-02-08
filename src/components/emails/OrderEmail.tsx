import * as React from 'react';

export const OrderEmail = ({ order }: { order: any }) => (
  <div style={{ fontFamily: 'serif', color: '#333', padding: '20px', lineHeight: '1.5' }}>
    <h1 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>AURAÉ</h1>
    <p>Hi {order.customer.name},</p>
    <p>Thank you for your order! We are currently preparing your Auraé pieces for shipment.</p>
    
    <h3 style={{ marginTop: '30px' }}>Order Summary (#{order._id.toString().slice(-6)})</h3>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {order.items.map((item: any, index: number) => (
        <li key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #f9f9f9', paddingBottom: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>{item.quantity}x</span> {item.name} — ₦{item.price.toLocaleString()}
        </li>
      ))}
    </ul>
    
    <p style={{ fontSize: '18px' }}><strong>Total: ₦{order.totalAmount.toLocaleString()}</strong></p>
    
    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
      <p style={{ margin: '0 0 5px 0' }}><strong>Shipping To:</strong></p>
      <p style={{ margin: 0 }}>{order.customer.address}</p>
      <p style={{ margin: 0 }}>{order.customer.city}</p>
      <p style={{ margin: '5px 0 0 0' }}>{order.customer.phone}</p>
    </div>
    
    <p style={{ fontSize: '12px', color: '#999', marginTop: '40px', textAlign: 'center' }}>
      Questions? Just reply to this email. We're here to help. <br />
      &copy; {new Date().getFullYear()} Auraé Beauty
    </p>
  </div>
);