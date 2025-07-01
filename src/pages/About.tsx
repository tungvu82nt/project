import React from 'react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Giới thiệu về Yapee
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 opacity-90"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Chào mừng Quý khách đến với Yapee! Sứ mệnh của chúng tôi là cung cấp các sản phẩm chất lượng cao với giá cả phải chăng, mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.h2 
              className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Giá trị cốt lõi
            </motion.h2>
            <motion.div 
              className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <ul>
                <li><b>Chất lượng:</b> Không thỏa hiệp về chất lượng. Từ khâu lựa chọn sản phẩm đến quy trình bảo quản và vận chuyển, chất lượng luôn là ưu tiên hàng đầu.</li>
                <li><b>Giá cả hợp lý:</b> Cam kết mang đến mức giá cạnh tranh và hợp lý nhất có thể, giúp Quý khách tiết kiệm chi phí mà vẫn sở hữu được sản phẩm ưng ý.</li>
                <li><b>Khách hàng là trọng tâm:</b> Mọi quyết định và hành động của Yapee đều hướng đến sự hài lòng của khách hàng. Chúng tôi lắng nghe, thấu hiểu và nỗ lực đáp ứng nhu cầu của bạn một cách tốt nhất.</li>
                <li><b>Đáng tin cậy:</b> Xây dựng niềm tin bằng sự minh bạch trong thông tin, sự chuẩn xác trong giao dịch và sự đảm bảo trong cam kết về sản phẩm và dịch vụ.</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cam kết và tầm nhìn */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Cam kết & Tầm nhìn
          </motion.h2>
          <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 mx-auto">
            <ul>
              <li>Trải nghiệm mua sắm trực tuyến liền mạch, an toàn và tiện lợi.</li>
              <li>Kiểm soát chặt chẽ chất lượng sản phẩm, đảm bảo hàng hóa đến tay khách hàng đúng như mô tả.</li>
              <li>Cung cấp thông tin sản phẩm rõ ràng, minh bạch.</li>
              <li>Giao hàng nhanh chóng và đáng tin cậy.</li>
              <li>Bảo vệ tuyệt đối thông tin cá nhân của khách hàng.</li>
              <li>Luôn lắng nghe và tiếp thu phản hồi để không ngừng cải thiện chất lượng dịch vụ.</li>
            </ul>
            <p><b>Tầm nhìn:</b> Trở thành thương hiệu mua sắm trực tuyến được yêu thích và tin cậy hàng đầu tại Việt Nam, là lựa chọn ưu tiên của mọi gia đình khi tìm kiếm các sản phẩm chất lượng với giá cả phải chăng.</p>
          </div>
        </div>
      </section>

      {/* Thông tin liên hệ */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Thông tin liên hệ
          </motion.h2>
          <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 mx-auto">
            <ul>
              <li><b>Tên cửa hàng:</b> Yapee</li>
              <li><b>Địa chỉ:</b> 74 đường số 13, Phường Bình Trị Đông B, quận Bình Tân, TP. Hồ Chí Minh</li>
              <li><b>Hotline:</b> 0333.938.014 (8h00 - 19h00, Thứ Hai - Chủ Nhật)</li>
              <li><b>Email:</b> cskh@yapee.vn</li>
              <li><b>Facebook:</b> [Link Fanpage Facebook chính thức của Yapee]</li>
              <li><b>Zalo:</b> Tìm kiếm Yapee qua số Hotline trên Zalo</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Chính sách bảo mật & FAQ */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Chính sách & Hỏi đáp
          </motion.h2>
          <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 mx-auto">
            <ul>
              <li><b>Chính sách bảo mật:</b> Yapee cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của khách hàng, tuân thủ nghiêm ngặt các quy định pháp luật Việt Nam.</li>
              <li><b>Chính sách đổi trả:</b> Linh hoạt, minh bạch, hỗ trợ khách hàng đổi trả hàng hóa theo quy định rõ ràng.</li>
              <li><b>Điều khoản sử dụng:</b> Vui lòng đọc kỹ các điều khoản khi sử dụng website Yapee.</li>
              <li><b>FAQ:</b> Xem chi tiết tại trang Câu hỏi thường gặp hoặc liên hệ trực tiếp với bộ phận CSKH.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;