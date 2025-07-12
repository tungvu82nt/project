import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

export const NewsletterSection: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubscribed(true);
    setIsLoading(false);
    setEmail('');
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with Latest Deals
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Subscribe to our newsletter and be the first to know about new products, 
              exclusive offers, and special promotions.
            </p>

            {isSubscribed ? (
              <motion.div
                className="flex items-center justify-center space-x-2 text-green-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="h-6 w-6" />
                <span className="text-lg font-medium">Thank you for subscribing!</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer.enterEmail')}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Subscribing...' : t('footer.subscribe')}
                </motion.button>
              </form>
            )}

            <p className="text-blue-200 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
