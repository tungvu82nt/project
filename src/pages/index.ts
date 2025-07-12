/**
 * Central export file for all pages
 * Organize page exports in logical order
 */

// Main Pages
export { Home } from './Home';
export { Products } from './Products';
export { ProductDetail } from './ProductDetail';
export { Cart } from './Cart';
export { Checkout } from './Checkout';

// Information Pages
export { About } from './About';
export { Contact } from './Contact';

// Page types and interfaces
export interface PageProps {
  className?: string;
}

export interface ProductPageProps extends PageProps {
  categoryFilter?: string;
  searchQuery?: string;
}

export interface ProductDetailProps extends PageProps {
  productId?: string;
}