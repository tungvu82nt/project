import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Y</span>
              </div>
              <span className="text-xl font-bold">Yapee</span>
            </div>
            <p className="text-gray-400 mb-4">
              {t('footer.aboutUs')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">{t('nav.products')}</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">{t('footer.aboutUs')}</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">{t('footer.contactUs')}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('products.category')}</h3>
            <ul className="space-y-2">
              <li><Link to="/products?category=electronics" className="text-gray-400 hover:text-white transition-colors">{t('categories.electronics')}</Link></li>
              <li><Link to="/products?category=wearables" className="text-gray-400 hover:text-white transition-colors">{t('categories.wearables')}</Link></li>
              <li><Link to="/products?category=photography" className="text-gray-400 hover:text-white transition-colors">{t('categories.photography')}</Link></li>
              <li><Link to="/products?category=gaming" className="text-gray-400 hover:text-white transition-colors">{t('categories.gaming')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">74 đường số 13, Phường Bình Trị Đông B, quận Bình Tân, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">0333.938.014</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">cskh@yapee.vn</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;