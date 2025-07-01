import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../components/Product/ProductCard';
import { Product } from '../types';
import { CartContext } from '../contexts/CartContext';

// Mock dữ liệu sản phẩm mẫu
const mockProduct: Product = {
  id: 'prod-001',
  name: 'Sản phẩm kiểm thử',
  description: 'Mô tả sản phẩm kiểm thử',
  price: 1299000,
  discountPrice: 999000,
  images: ['/images/test-product.jpg'],
  category: 'electronics',
  stock: 10,
  colors: ['red', 'blue'],
  sizes: ['M', 'L'],
  featured: true
};

// Mock context giỏ hàng
const mockAddToCart = jest.fn();

describe('ProductCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders product information correctly', () => {
    render(
      <CartContext.Provider value={{ addToCart: mockAddToCart, items: [] }}>
        <ProductCard product={mockProduct} />
      </CartContext.Provider>
    );

    // Kiểm tra tên sản phẩm
    expect(screen.getByText('Sản phẩm kiểm thử')).toBeInTheDocument();

    // Kiểm tra giá gốc và giá giảm
    expect(screen.getByText('1.299.000 ₫')).toBeInTheDocument();
    expect(screen.getByText('999.000 ₫')).toBeInTheDocument();

    // Kiểm tra hình ảnh sản phẩm
    const productImage = screen.getByAltText('Sản phẩm kiểm thử');
    expect(productImage).toHaveAttribute('src', '/images/test-product.jpg');
  });

  test('calls addToCart when Add to Cart button is clicked', () => {
    render(
      <CartContext.Provider value={{ addToCart: mockAddToCart, items: [] }}>
        <ProductCard product={mockProduct} />
      </CartContext.Provider>
    );

    // Nhấn nút thêm vào giỏ hàng
    const addButton = screen.getByRole('button', { name: /thêm vào giỏ/i });
    fireEvent.click(addButton);

    // Kiểm tra xem hàm addToCart đã được gọi với đúng tham số
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(expect.objectContaining({
      id: 'prod-001',
      quantity: 1
    }));
  });

  test('shows out of stock message when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };

    render(
      <CartContext.Provider value={{ addToCart: mockAddToCart, items: [] }}>
        <ProductCard product={outOfStockProduct} />
      </CartContext.Provider>
    );

    // Kiểm tra thông báo hết hàng
    expect(screen.getByText('Hết hàng')).toBeInTheDocument();

    // Kiểm tra nút thêm vào giỏ hàng bị vô hiệu hóa
    const addButton = screen.getByRole('button', { name: /thêm vào giỏ/i });
    expect(addButton).toBeDisabled();
  });

  test('displays discount badge when discountPrice is available', () => {
    render(
      <CartContext.Provider value={{ addToCart: mockAddToCart, items: [] }}>
        <ProductCard product={mockProduct} />
      </CartContext.Provider>
    );

    // Kiểm tra hiển thị badge giảm giá
    const discountBadge = screen.getByText('-23%');
    expect(discountBadge).toBeInTheDocument();
  });
});