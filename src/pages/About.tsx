import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Clock, Award, Users, Globe, Heart, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const About: React.FC = () => {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: language === 'en' ? 'Quality Assurance' : language === 'vi' ? 'Đảm Bảo Chất Lượng' : '质量保证',
      description: language === 'en' 
        ? 'We ensure every product meets the highest standards of quality and reliability.'
        : language === 'vi'
        ? 'Chúng tôi đảm bảo mọi sản phẩm đều đạt tiêu chuẩn chất lượng và độ tin cậy cao nhất.'
        : '我们确保每个产品都符合最高的质量和可靠性标准。'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: language === 'en' ? 'Customer First' : language === 'vi' ? 'Khách Hàng Là Trên Hết' : '客户至上',
      description: language === 'en'
        ? 'Our customers are at the heart of everything we do. Your satisfaction is our priority.'
        : language === 'vi'
        ? 'Khách hàng là trung tâm của mọi hoạt động. Sự hài lòng của bạn là ưu tiên hàng đầu.'
        : '客户是我们所做一切的核心。您的满意是我们的优先考虑。'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: language === 'en' ? 'Global Reach' : language === 'vi' ? 'Phạm Vi Toàn Cầu' : '全球覆盖',
      description: language === 'en'
        ? 'Serving customers worldwide with fast and reliable shipping solutions.'
        : language === 'vi'
        ? 'Phục vụ khách hàng trên toàn thế giới với giải pháp vận chuyển nhanh và đáng tin cậy.'
        : '通过快速可靠的运输解决方案为全球客户提供服务。'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: language === 'en' ? 'Sustainability' : language === 'vi' ? 'Phát Triển Bền Vững' : '可持续发展',
      description: language === 'en'
        ? 'Committed to environmental responsibility and sustainable business practices.'
        : language === 'vi'
        ? 'Cam kết trách nhiệm môi trường và thực hành kinh doanh bền vững.'
        : '致力于环境责任和可持续的商业实践。'
    }
  ];

  const stats = [
    {
      number: '50K+',
      label: language === 'en' ? 'Happy Customers' : language === 'vi' ? 'Khách Hàng Hài Lòng' : '满意客户'
    },
    {
      number: '10K+',
      label: language === 'en' ? 'Products Sold' : language === 'vi' ? 'Sản Phẩm Đã Bán' : '已售产品'
    },
    {
      number: '25+',
      label: language === 'en' ? 'Countries Served' : language === 'vi' ? 'Quốc Gia Phục Vụ' : '服务国家'
    },
    {
      number: '99%',
      label: language === 'en' ? 'Customer Satisfaction' : language === 'vi' ? 'Hài Lòng Khách Hàng' : '客户满意度'
    }
  ];

  const getContent = () => {
    switch (language) {
      case 'vi':
        return {
          hero: {
            title: 'Về Yapee',
            subtitle: 'Dẫn đầu trong lĩnh vực công nghệ và điện tử cao cấp',
            description: 'Yapee là một công ty công nghệ hàng đầu chuyên cung cấp các sản phẩm điện tử và công nghệ cao cấp. Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng nhất với dịch vụ tuyệt vời.'
          },
          mission: {
            title: 'Sứ Mệnh Của Chúng Tôi',
            content: 'Sứ mệnh của Yapee là làm cho công nghệ trở nên dễ tiếp cận và có ý nghĩa đối với mọi người. Chúng tôi tin rằng công nghệ có thể cải thiện cuộc sống và chúng tôi nỗ lực để mang đến những sản phẩm tốt nhất cho khách hàng.'
          },
          vision: {
            title: 'Tầm Nhìn',
            content: 'Trở thành thương hiệu công nghệ được tin tưởng nhất trên toàn cầu, nơi khách hàng có thể tìm thấy những sản phẩm điện tử và công nghệ tiên tiến nhất với chất lượng đảm bảo.'
          },
          story: {
            title: 'Câu Chuyện Của Chúng Tôi',
            content: 'Được thành lập với tầm nhìn tạo ra sự khác biệt trong ngành công nghệ, Yapee đã phát triển từ một startup nhỏ thành một trong những thương hiệu công nghệ được tin tưởng nhất. Chúng tôi tự hào về hành trình không ngừng đổi mới và cam kết chất lượng.'
          }
        };
      case 'zh':
        return {
          hero: {
            title: '关于Yapee',
            subtitle: '高端技术和电子产品领域的领导者',
            description: 'Yapee是一家领先的技术公司，专门提供高端电子产品和技术产品。我们致力于为客户提供最优质的产品和卓越的服务。'
          },
          mission: {
            title: '我们的使命',
            content: 'Yapee的使命是让技术对每个人都变得易于接近和有意义。我们相信技术可以改善生活，我们努力为客户带来最好的产品。'
          },
          vision: {
            title: '愿景',
            content: '成为全球最受信赖的技术品牌，客户可以在这里找到最先进的电子产品和技术产品，质量有保证。'
          },
          story: {
            title: '我们的故事',
            content: 'Yapee成立时的愿景是在技术行业创造差异，已经从一个小型初创公司发展成为最受信赖的技术品牌之一。我们为持续创新和对质量的承诺感到自豪。'
          }
        };
      default:
        return {
          hero: {
            title: 'About Yapee',
            subtitle: 'Leading the way in premium technology and electronics',
            description: 'Yapee is a leading technology company specializing in premium electronics and technology products. We are committed to providing our customers with the highest quality products and exceptional service.'
          },
          mission: {
            title: 'Our Mission',
            content: 'Yapee\'s mission is to make technology accessible and meaningful for everyone. We believe that technology can improve lives, and we strive to bring the best products to our customers.'
          },
          vision: {
            title: 'Our Vision',
            content: 'To become the most trusted technology brand globally, where customers can find the most advanced electronics and technology products with guaranteed quality.'
          },
          story: {
            title: 'Our Story',
            content: 'Founded with a vision to make a difference in the technology industry, Yapee has grown from a small startup to one of the most trusted technology brands. We take pride in our journey of continuous innovation and commitment to quality.'
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
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {content.hero.subtitle}
            </p>
            <p className="text-lg max-w-3xl mx-auto text-blue-50">
              {content.hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {content.mission.title}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {content.mission.content}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {content.vision.title}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {content.vision.content}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {content.story.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {content.story.content}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Our Values' : language === 'vi' ? 'Giá Trị Của Chúng Tôi' : '我们的价值观'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'en' 
                ? 'These core values guide everything we do and shape our commitment to excellence.'
                : language === 'vi'
                ? 'Những giá trị cốt lõi này định hướng mọi hoạt động và định hình cam kết xuất sắc của chúng tôi.'
                : '这些核心价值观指导我们所做的一切，并塑造我们对卓越的承诺。'
              }
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6">
              {language === 'en' 
                ? 'Ready to Experience the Yapee Difference?'
                : language === 'vi'
                ? 'Sẵn Sàng Trải Nghiệm Sự Khác Biệt Của Yapee?'
                : '准备体验Yapee的不同之处？'
              }
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              {language === 'en'
                ? 'Discover our premium collection of technology products today.'
                : language === 'vi'
                ? 'Khám phá bộ sưu tập sản phẩm công nghệ cao cấp của chúng tôi ngay hôm nay.'
                : '立即探索我们的高端技术产品系列。'
              }
            </p>
            <motion.a
              href="/products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {language === 'en' ? 'Shop Now' : language === 'vi' ? 'Mua Ngay' : '立即购买'}
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};