import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Contact: React.FC = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getContent = () => {
    switch (language) {
      case 'vi':
        return {
          hero: {
            title: 'Liên Hệ Với Chúng Tôi',
            subtitle: 'Chúng tôi luôn sẵn sàng hỗ trợ bạn'
          },
          form: {
            title: 'Gửi Tin Nhắn',
            name: 'Họ và Tên',
            email: 'Email',
            subject: 'Chủ Đề',
            message: 'Tin Nhắn',
            send: 'Gửi Tin Nhắn',
            sending: 'Đang Gửi...',
            success: 'Cảm ơn bạn! Tin nhắn đã được gửi thành công.'
          },
          info: {
            address: {
              title: 'Địa Chỉ',
              value: '74 đường số 13, Phường Bình Trị Đông B, quận Bình Tân, TP.HCM'
            },
            phone: {
              title: 'Điện Thoại',
              value: '0333.938.014'
            },
            email: {
              title: 'Email',
              value: 'cskh@yapee.vn'
            },
            hours: {
              title: 'Giờ Làm Việc',
              value: 'Thứ 2 - Thứ 6: 8:00 - 18:00\nThứ 7: 9:00 - 17:00\nChủ Nhật: Nghỉ'
            }
          },
          support: {
            title: 'Hỗ Trợ Khách Hàng',
            description: 'Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giúp đỡ bạn với mọi thắc mắc về sản phẩm, đơn hàng hoặc dịch vụ.',
            chat: 'Chat Trực Tuyến',
            chatDesc: 'Nhận hỗ trợ ngay lập tức'
          }
        };
      case 'zh':
        return {
          hero: {
            title: '联系我们',
            subtitle: '我们随时准备为您提供帮助'
          },
          form: {
            title: '发送消息',
            name: '姓名',
            email: '邮箱',
            subject: '主题',
            message: '消息',
            send: '发送消息',
            sending: '发送中...',
            success: '谢谢您！消息已成功发送。'
          },
          info: {
            address: {
              title: '地址',
              value: '74 đường số 13, Phường Bình Trị Đông B, quận Bình Tân, TP.HCM'
            },
            phone: {
              title: '电话',
              value: '0333.938.014'
            },
            email: {
              title: '邮箱',
              value: 'cskh@yapee.vn'
            },
            hours: {
              title: '工作时间',
              value: '周一至周五：8:00 - 18:00\n周六：9:00 - 17:00\n周日：休息'
            }
          },
          support: {
            title: '客户支持',
            description: '我们的客户支持团队随时准备帮助您解决有关产品、订单或服务的任何问题。',
            chat: '在线聊天',
            chatDesc: '获得即时支持'
          }
        };
      default:
        return {
          hero: {
            title: 'Contact Us',
            subtitle: 'We\'re here to help you'
          },
          form: {
            title: 'Send Message',
            name: 'Full Name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message',
            send: 'Send Message',
            sending: 'Sending...',
            success: 'Thank you! Your message has been sent successfully.'
          },
          info: {
            address: {
              title: 'Address',
              value: '74 đường số 13, Phường Bình Trị Đông B, quận Bình Tân, TP.HCM'
            },
            phone: {
              title: 'Phone',
              value: '0333.938.014'
            },
            email: {
              title: 'Email',
              value: 'cskh@yapee.vn'
            },
            hours: {
              title: 'Business Hours',
              value: 'Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 5:00 PM\nSunday: Closed'
            }
          },
          support: {
            title: 'Customer Support',
            description: 'Our customer support team is always ready to help you with any questions about products, orders, or services.',
            chat: 'Live Chat',
            chatDesc: 'Get instant support'
          }
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {content.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              {content.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center p-6 bg-gray-50 rounded-lg"
            >
              <div className="text-blue-600 mb-4 flex justify-center">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {content.info.address.title}
              </h3>
              <p className="text-gray-600 whitespace-pre-line">
                {content.info.address.value}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6 bg-gray-50 rounded-lg"
            >
              <div className="text-blue-600 mb-4 flex justify-center">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {content.info.phone.title}
              </h3>
              <p className="text-gray-600">
                {content.info.phone.value}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6 bg-gray-50 rounded-lg"
            >
              <div className="text-blue-600 mb-4 flex justify-center">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {content.info.email.title}
              </h3>
              <p className="text-gray-600">
                {content.info.email.value}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6 bg-gray-50 rounded-lg"
            >
              <div className="text-blue-600 mb-4 flex justify-center">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {content.info.hours.title}
              </h3>
              <p className="text-gray-600 whitespace-pre-line text-sm">
                {content.info.hours.value}
              </p>
            </motion.div>
          </div>

          {/* Contact Form and Support */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {content.form.title}
              </h2>
              
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
                >
                  {content.form.success}
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {content.form.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {content.form.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {content.form.subject}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {content.form.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {content.form.sending}
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      {content.form.send}
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Customer Support */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="bg-blue-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {content.support.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {content.support.description}
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {content.support.chat}
                </motion.button>
                <p className="text-sm text-gray-500 text-center mt-2">
                  {content.support.chatDesc}
                </p>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">
                    {language === 'en' ? 'Interactive Map' : language === 'vi' ? 'Bản Đồ Tương Tác' : '互动地图'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};