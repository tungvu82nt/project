import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Headphones, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/Product/ProductCard';
import { NewsletterSection } from '../components/Newsletter/NewsletterSection';
import { TestimonialsSection } from '../components/Testimonials/TestimonialsSection';
import { products } from '../data/products';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  onAddToCart: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ onAddToCart }) => {
  const { t } = useLanguage();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Discover 
                <span className="text-blue-300"> Premium</span> Electronics
              </h1>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Experience the future of technology with our curated collection of premium electronics, 
                designed to elevate your digital lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  {t('nav.products')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors"
                >
                  {t('common.about')}
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative z-10">
                <img
                  src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Premium Electronics"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-30 rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose EliteStore?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing you with the best shopping experience and premium quality products.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Premium Quality',
                description: 'Only the finest products from trusted brands make it to our collection.'
              },
              {
                icon: Truck,
                title: 'Fast Shipping',
                description: 'Free delivery on orders over $100. Express shipping available nationwide.'
              },
              {
                icon: Headphones,
                title: '24/7 Support',
                description: 'Our expert team is here to help you with any questions or concerns.'
              },
              {
                icon: Award,
                title: 'Warranty',
                description: 'All products come with comprehensive warranty and satisfaction guarantee.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('products.featured')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our handpicked selection of premium electronics and accessories.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors group"
            >
              {t('nav.products')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
};