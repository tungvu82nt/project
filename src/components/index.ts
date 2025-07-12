/**
 * Central export file for all components
 * Organize exports by functional groups for easy maintenance
 */

// Layout Components
export { Header } from './Layout/Header';
export { default as Footer } from './Layout/Footer';
export { default as LanguageSelector } from './Layout/LanguageSelector';
export { UserMenu } from './Layout/UserMenu';

// Product Components
export { ProductCard } from './Product/ProductCard';
export { ProductViewer3D } from './Product/ProductViewer3D';

// Auth Components
export { LoginModal } from './Auth/LoginModal';

// Newsletter Components
export { NewsletterSection } from './Newsletter/NewsletterSection';

// Testimonials Components
export { TestimonialsSection } from './Testimonials/TestimonialsSection';

// Notification Components
export { NotificationSystem, useNotifications } from './Notifications/NotificationSystem';

// Email Components
export { OrderConfirmationEmail, OrderStatusUpdateEmail } from './Email/EmailTemplates';

// Database Demo Components
// export { default as DatabaseDemo } from './Database/DatabaseDemo';

// Re-export types if any components export types
export type { NotificationType } from './Notifications/NotificationSystem';