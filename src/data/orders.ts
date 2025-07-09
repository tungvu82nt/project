import { Order } from '../types';

export const orders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    items: [],
    total: 299,
    status: 'delivered',
    createdAt: '2024-01-15T10:30:00Z',
    shippingAddress: '123 Main St, New York, NY 10001'
  },
  {
    id: 'ORD-002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    items: [],
    total: 249,
    status: 'shipped',
    createdAt: '2024-01-16T14:20:00Z',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90210'
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Davis',
    customerEmail: 'mike@example.com',
    items: [],
    total: 899,
    status: 'processing',
    createdAt: '2024-01-17T09:15:00Z',
    shippingAddress: '789 Pine St, Chicago, IL 60601'
  }
];