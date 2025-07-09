import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    nameTranslations: {
      en: 'Premium Wireless Headphones',
      vi: 'Tai Nghe Không Dây Cao Cấp',
      zh: '高端无线耳机'
    },
    price: 299,
    originalPrice: 399,
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    descriptionTranslations: {
      en: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
      vi: 'Tai nghe không dây chất lượng cao với khử tiếng ồn và chất lượng âm thanh cao cấp.',
      zh: '高品质无线耳机，具有降噪功能和优质音质。'
    },
    category: 'Electronics',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    colors: ['Black', 'White', 'Blue'],
    colorsTranslations: {
      en: ['Black', 'White', 'Blue'],
      vi: ['Đen', 'Trắng', 'Xanh'],
      zh: ['黑色', '白色', '蓝色']
    },
    sizes: ['One Size'],
    sizesTranslations: {
      en: ['One Size'],
      vi: ['Một kích thước'],
      zh: ['均码']
    },
    rating: 4.8,
    reviews: 156,
    inStock: true,
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Premium leather cushions',
      'Bluetooth 5.0 connectivity'
    ],
    featuresTranslations: {
      en: [
        'Active Noise Cancellation',
        '30-hour battery life',
        'Premium leather cushions',
        'Bluetooth 5.0 connectivity'
      ],
      vi: [
        'Khử tiếng ồn chủ động',
        'Thời lượng pin 30 giờ',
        'Đệm da cao cấp',
        'Kết nối Bluetooth 5.0'
      ],
      zh: [
        '主动降噪',
        '30小时电池续航',
        '高级皮革缓冲垫',
        'Bluetooth 5.0连接'
      ]
    },
    specifications: {
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      'Impedance': '32Ω',
      'Weight': '280g',
      'Connectivity': 'Bluetooth 5.0, 3.5mm jack'
    },
    specificationsTranslations: {
      en: {
        'Driver Size': '40mm',
        'Frequency Response': '20Hz - 20kHz',
        'Impedance': '32Ω',
        'Weight': '280g',
        'Connectivity': 'Bluetooth 5.0, 3.5mm jack'
      },
      vi: {
        'Kích thước driver': '40mm',
        'Đáp ứng tần số': '20Hz - 20kHz',
        'Trở kháng': '32Ω',
        'Trọng lượng': '280g',
        'Kết nối': 'Bluetooth 5.0, jack 3.5mm'
      },
      zh: {
        '驱动器尺寸': '40mm',
        '频率响应': '20Hz - 20kHz',
        '阻抗': '32Ω',
        '重量': '280g',
        '连接方式': 'Bluetooth 5.0, 3.5mm接口'
      }
    }
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    nameTranslations: {
      en: 'Smart Fitness Watch',
      vi: 'Đồng Hồ Thể Dục Thông Minh',
      zh: '智能健身手表'
    },
    price: 249,
    description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
    descriptionTranslations: {
      en: 'Advanced fitness tracking with heart rate monitoring and GPS.',
      vi: 'Theo dõi thể dục tiên tiến với giám sát nhịp tim và GPS.',
      zh: '先进的健身追踪，具有心率监测和GPS功能。'
    },
    category: 'Wearables',
    images: [
      'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    colors: ['Black', 'Silver', 'Rose Gold'],
    colorsTranslations: {
      en: ['Black', 'Silver', 'Rose Gold'],
      vi: ['Đen', 'Bạc', 'Vàng hồng'],
      zh: ['黑色', '银色', '玫瑰金']
    },
    sizes: ['38mm', '42mm'],
    sizesTranslations: {
      en: ['38mm', '42mm'],
      vi: ['38mm', '42mm'],
      zh: ['38mm', '42mm']
    },
    rating: 4.6,
    reviews: 89,
    inStock: true,
    features: [
      'Heart Rate Monitoring',
      'GPS Tracking',
      'Water Resistant',
      '7-day battery life'
    ],
    featuresTranslations: {
      en: [
        'Heart Rate Monitoring',
        'GPS Tracking',
        'Water Resistant',
        '7-day battery life'
      ],
      vi: [
        'Giám sát nhịp tim',
        'Theo dõi GPS',
        'Chống nước',
        'Thời lượng pin 7 ngày'
      ],
      zh: [
        '心率监测',
        'GPS追踪',
        '防水',
        '7天电池续航'
      ]
    },
    specifications: {
      'Display': '1.4" AMOLED',
      'Battery': '7 days typical use',
      'Water Rating': '5ATM',
      'Sensors': 'Heart Rate, GPS, Accelerometer'
    },
    specificationsTranslations: {
      en: {
        'Display': '1.4" AMOLED',
        'Battery': '7 days typical use',
        'Water Rating': '5ATM',
        'Sensors': 'Heart Rate, GPS, Accelerometer'
      },
      vi: {
        'Màn hình': '1.4" AMOLED',
        'Pin': '7 ngày sử dụng thông thường',
        'Chống nước': '5ATM',
        'Cảm biến': 'Nhịp tim, GPS, Gia tốc kế'
      },
      zh: {
        '显示屏': '1.4" AMOLED',
        '电池': '典型使用7天',
        '防水等级': '5ATM',
        '传感器': '心率、GPS、加速度计'
      }
    }
  },
  {
    id: '3',
    name: 'Professional Camera Lens',
    nameTranslations: {
      en: 'Professional Camera Lens',
      vi: 'Ống Kính Máy Ảnh Chuyên Nghiệp',
      zh: '专业相机镜头'
    },
    price: 899,
    description: 'High-performance telephoto lens for professional photography.',
    descriptionTranslations: {
      en: 'High-performance telephoto lens for professional photography.',
      vi: 'Ống kính tele hiệu suất cao cho nhiếp ảnh chuyên nghiệp.',
      zh: '专业摄影用高性能长焦镜头。'
    },
    category: 'Photography',
    images: [
      'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    colors: ['Black'],
    colorsTranslations: {
      en: ['Black'],
      vi: ['Đen'],
      zh: ['黑色']
    },
    sizes: ['70-200mm'],
    sizesTranslations: {
      en: ['70-200mm'],
      vi: ['70-200mm'],
      zh: ['70-200mm']
    },
    rating: 4.9,
    reviews: 67,
    inStock: true,
    features: [
      'Image Stabilization',
      'Weather Sealed',
      'Fast Autofocus',
      'Professional Build Quality'
    ],
    featuresTranslations: {
      en: [
        'Image Stabilization',
        'Weather Sealed',
        'Fast Autofocus',
        'Professional Build Quality'
      ],
      vi: [
        'Chống rung hình ảnh',
        'Chống thời tiết',
        'Lấy nét tự động nhanh',
        'Chất lượng xây dựng chuyên nghiệp'
      ],
      zh: [
        '图像稳定',
        '防风雨密封',
        '快速自动对焦',
        '专业制造质量'
      ]
    },
    specifications: {
      'Focal Length': '70-200mm',
      'Max Aperture': 'f/2.8',
      'Min Focus Distance': '1.2m',
      'Weight': '1.48kg',
      'Mount': 'Canon EF'
    },
    specificationsTranslations: {
      en: {
        'Focal Length': '70-200mm',
        'Max Aperture': 'f/2.8',
        'Min Focus Distance': '1.2m',
        'Weight': '1.48kg',
        'Mount': 'Canon EF'
      },
      vi: {
        'Tiêu cự': '70-200mm',
        'Khẩu độ tối đa': 'f/2.8',
        'Khoảng cách lấy nét tối thiểu': '1.2m',
        'Trọng lượng': '1.48kg',
        'Ngàm': 'Canon EF'
      },
      zh: {
        '焦距': '70-200mm',
        '最大光圈': 'f/2.8',
        '最近对焦距离': '1.2m',
        '重量': '1.48kg',
        '卡口': 'Canon EF'
      }
    }
  },
  {
    id: '4',
    name: 'Gaming Mechanical Keyboard',
    nameTranslations: {
      en: 'Gaming Mechanical Keyboard',
      vi: 'Bàn Phím Cơ Gaming',
      zh: '游戏机械键盘'
    },
    price: 159,
    description: 'RGB mechanical keyboard with custom switches for gaming.',
    descriptionTranslations: {
      en: 'RGB mechanical keyboard with custom switches for gaming.',
      vi: 'Bàn phím cơ RGB với switch tùy chỉnh cho gaming.',
      zh: '带有自定义轴体的RGB机械键盘，专为游戏设计。'
    },
    category: 'Gaming',
    images: [
      'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    colors: ['Black', 'White'],
    colorsTranslations: {
      en: ['Black', 'White'],
      vi: ['Đen', 'Trắng'],
      zh: ['黑色', '白色']
    },
    sizes: ['Full Size', 'Compact'],
    sizesTranslations: {
      en: ['Full Size', 'Compact'],
      vi: ['Kích thước đầy đủ', 'Nhỏ gọn'],
      zh: ['全尺寸', '紧凑型']
    },
    rating: 4.7,
    reviews: 203,
    inStock: true,
    features: [
      'RGB Backlighting',
      'Mechanical Switches',
      'Programmable Keys',
      'Anti-Ghosting'
    ],
    featuresTranslations: {
      en: [
        'RGB Backlighting',
        'Mechanical Switches',
        'Programmable Keys',
        'Anti-Ghosting'
      ],
      vi: [
        'Đèn nền RGB',
        'Switch cơ',
        'Phím có thể lập trình',
        'Chống ghosting'
      ],
      zh: [
        'RGB背光',
        '机械轴体',
        '可编程按键',
        '防冲突'
      ]
    },
    specifications: {
      'Switch Type': 'Cherry MX Red',
      'Key Layout': '104 Keys',
      'Connectivity': 'USB-C',
      'Polling Rate': '1000Hz'
    },
    specificationsTranslations: {
      en: {
        'Switch Type': 'Cherry MX Red',
        'Key Layout': '104 Keys',
        'Connectivity': 'USB-C',
        'Polling Rate': '1000Hz'
      },
      vi: {
        'Loại switch': 'Cherry MX Red',
        'Bố cục phím': '104 phím',
        'Kết nối': 'USB-C',
        'Tần số polling': '1000Hz'
      },
      zh: {
        '轴体类型': 'Cherry MX Red',
        '按键布局': '104键',
        '连接方式': 'USB-C',
        '轮询率': '1000Hz'
      }
    }
  }
];