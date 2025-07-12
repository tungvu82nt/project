import React from 'react';

interface EmailTemplateProps {
  customerName: string;
  orderNumber: string;
  orderTotal: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: string;
}

export const OrderConfirmationEmail: React.FC<EmailTemplateProps> = ({
  customerName,
  orderNumber,
  orderTotal,
  orderItems,
  shippingAddress
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#3B82F6', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', margin: '0', fontSize: '24px' }}>Yapee</h1>
      </div>

      {/* Content */}
      <div style={{ padding: '30px', backgroundColor: '#ffffff' }}>
        <h2 style={{ color: '#1F2937', marginBottom: '20px' }}>
          Thank you for your order, {customerName}!
        </h2>
        
        <p style={{ color: '#6B7280', fontSize: '16px', lineHeight: '1.6' }}>
          We've received your order and are preparing it for shipment. 
          You'll receive another email when your order has been shipped.
        </p>

        {/* Order Details */}
        <div style={{ 
          backgroundColor: '#F9FAFB', 
          padding: '20px', 
          borderRadius: '8px', 
          margin: '20px 0' 
        }}>
          <h3 style={{ color: '#1F2937', marginTop: '0' }}>Order Details</h3>
          <p style={{ margin: '5px 0', color: '#6B7280' }}>
            <strong>Order Number:</strong> {orderNumber}
          </p>
          <p style={{ margin: '5px 0', color: '#6B7280' }}>
            <strong>Order Total:</strong> ${orderTotal}
          </p>
        </div>

        {/* Order Items */}
        <div style={{ margin: '20px 0' }}>
          <h3 style={{ color: '#1F2937' }}>Items Ordered</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F3F4F6' }}>
                <th style={{ padding: '10px', textAlign: 'left', color: '#374151' }}>Item</th>
                <th style={{ padding: '10px', textAlign: 'center', color: '#374151' }}>Qty</th>
                <th style={{ padding: '10px', textAlign: 'right', color: '#374151' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '10px', color: '#1F2937' }}>{item.name}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#6B7280' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#1F2937' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Shipping Address */}
        <div style={{ margin: '20px 0' }}>
          <h3 style={{ color: '#1F2937' }}>Shipping Address</h3>
          <p style={{ color: '#6B7280', lineHeight: '1.6' }}>
            {shippingAddress}
          </p>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a 
            href="#" 
            style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '6px',
              display: 'inline-block',
              fontWeight: 'bold'
            }}
          >
            Track Your Order
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        backgroundColor: '#F9FAFB', 
        padding: '20px', 
        textAlign: 'center',
        borderTop: '1px solid #E5E7EB'
      }}>
        <p style={{ color: '#6B7280', fontSize: '14px', margin: '0' }}>
          Questions? Contact us at cskh@yapee.vn or 0333.938.014
        </p>
        <p style={{ color: '#9CA3AF', fontSize: '12px', margin: '10px 0 0 0' }}>
          © 2024 Yapee. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export const OrderStatusUpdateEmail: React.FC<{
  customerName: string;
  orderNumber: string;
  status: string;
  trackingNumber?: string;
}> = ({ customerName, orderNumber, status, trackingNumber }) => {
  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Your order is being processed and will be shipped soon.';
      case 'shipped':
        return 'Great news! Your order has been shipped and is on its way to you.';
      case 'delivered':
        return 'Your order has been delivered. We hope you enjoy your purchase!';
      default:
        return `Your order status has been updated to: ${status}`;
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#3B82F6', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', margin: '0', fontSize: '24px' }}>Yapee</h1>
      </div>

      {/* Content */}
      <div style={{ padding: '30px', backgroundColor: '#ffffff' }}>
        <h2 style={{ color: '#1F2937', marginBottom: '20px' }}>
          Order Update for {customerName}
        </h2>
        
        <p style={{ color: '#6B7280', fontSize: '16px', lineHeight: '1.6' }}>
          {getStatusMessage(status)}
        </p>

        {/* Order Details */}
        <div style={{ 
          backgroundColor: '#F9FAFB', 
          padding: '20px', 
          borderRadius: '8px', 
          margin: '20px 0' 
        }}>
          <h3 style={{ color: '#1F2937', marginTop: '0' }}>Order Information</h3>
          <p style={{ margin: '5px 0', color: '#6B7280' }}>
            <strong>Order Number:</strong> {orderNumber}
          </p>
          <p style={{ margin: '5px 0', color: '#6B7280' }}>
            <strong>Status:</strong> {status.charAt(0).toUpperCase() + status.slice(1)}
          </p>
          {trackingNumber && (
            <p style={{ margin: '5px 0', color: '#6B7280' }}>
              <strong>Tracking Number:</strong> {trackingNumber}
            </p>
          )}
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a 
            href="#" 
            style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '6px',
              display: 'inline-block',
              fontWeight: 'bold'
            }}
          >
            View Order Details
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        backgroundColor: '#F9FAFB', 
        padding: '20px', 
        textAlign: 'center',
        borderTop: '1px solid #E5E7EB'
      }}>
        <p style={{ color: '#6B7280', fontSize: '14px', margin: '0' }}>
            Questions? Contact us at cskh@yapee.vn or 0333.938.014
          </p>
        <p style={{ color: '#9CA3AF', fontSize: '12px', margin: '10px 0 0 0' }}>
          © 2024 Yapee. All rights reserved.
        </p>
      </div>
    </div>
  );
};