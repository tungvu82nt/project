import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import supabase from '../services/supabaseClient';

interface ProductDetailProps {
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
}

const tabList = [
  { key: 'description', label: 'Mô tả sản phẩm' },
  { key: 'specs', label: 'Thông số kỹ thuật' },
  { key: 'reviews', label: 'Đánh giá' },
  { key: 'qa', label: 'Hỏi đáp' },
];

export const ProductDetail: React.FC<ProductDetailProps> = ({ onAddToCart }) => {
  const { productId } = useParams<{ productId: string }>();
  const { t, language, formatCurrency } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      if (error || !data) {
        setError(t('productDetail.productNotFound'));
        setProduct(null);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };
    if (productId) fetchProduct();
  }, [productId, t]);

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || t('productDetail.productNotFound')}</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-700">
            ← {t('productDetail.backToProducts')}
          </Link>
        </div>
      </div>
    );
  }

  // Lấy dữ liệu theo ngôn ngữ
  const getName = () => product.nameTranslations?.[language] || product.name;
  const getDesc = () => product.descriptionTranslations?.[language] || product.description;
  const getColors = () => product.colorsTranslations?.[language] || product.colors;
  const getSizes = () => product.sizesTranslations?.[language] || product.sizes;
  const getSpecs = () => product.specificationsTranslations?.[language] || product.specifications;

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Gallery ảnh */}
        <div className="w-full lg:w-2/5">
          <div className="border rounded-lg bg-white p-4 flex flex-col items-center">
            <img
              src={product.images[selectedImage]}
              alt={getName()}
              className="w-full h-96 object-contain rounded-lg mb-4 bg-gray-50"
            />
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img
                  key={img}
                  src={img}
                  alt={getName() + '-' + idx}
                  className={`w-16 h-16 object-cover rounded border cursor-pointer ${selectedImage === idx ? 'border-blue-500' : 'border-gray-200'}`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Thông tin sản phẩm */}
        <div className="w-full lg:w-3/5">
          <div className="bg-white border rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-2">{getName()}</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400 flex items-center">
                <Star className="w-5 h-5" fill="#facc15" />
                <span className="ml-1 font-semibold text-gray-800">{product.rating}</span>
              </span>
              <span className="text-gray-500 text-sm">({product.reviews} đánh giá)</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded">Còn hàng</span>
            </div>
            <div className="mb-4 text-gray-600 text-sm">Mã SP: <span className="font-mono">{product.id}</span></div>
            <div className="mb-4 text-lg text-gray-700">{getDesc()}</div>
            <div className="mb-4 flex items-center gap-4">
              <span className="text-3xl font-bold text-red-600">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg line-through text-gray-400">{formatCurrency(product.originalPrice)}</span>
              )}
              {product.originalPrice && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-semibold">
                  -{Math.round(100 - (product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>
            {/* Lựa chọn màu sắc */}
            {getColors().length > 0 && (
              <div className="mb-4">
                <div className="font-medium mb-1">Màu sắc:</div>
                <div className="flex gap-2">
                  {getColors().map(color => (
                    <button
                      key={color}
                      className={`px-3 py-1 rounded border ${selectedColor === color ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} text-sm`}
                      onClick={() => setSelectedColor(color)}
                      type="button"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Lựa chọn size */}
            {getSizes().length > 0 && (
              <div className="mb-4">
                <div className="font-medium mb-1">Kích thước:</div>
                <div className="flex gap-2">
                  {getSizes().map(size => (
                    <button
                      key={size}
                      className={`px-3 py-1 rounded border ${selectedSize === size ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} text-sm`}
                      onClick={() => setSelectedSize(size)}
                      type="button"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Số lượng */}
            <div className="mb-4 flex items-center gap-2">
              <span className="font-medium">Số lượng:</span>
              <button type="button" className="w-8 h-8 border rounded text-lg" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <input type="number" min={1} value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} className="w-14 text-center border rounded" />
              <button type="button" className="w-8 h-8 border rounded text-lg" onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            {/* Nút thao tác */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button onClick={handleAddToCart} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded text-lg flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ hàng
              </button>
              <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded text-lg flex items-center justify-center gap-2">
                Mua ngay
              </button>
              <button className="flex items-center justify-center px-4 py-3 border rounded text-gray-600 hover:bg-gray-100">
                <Heart className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center px-4 py-3 border rounded text-gray-600 hover:bg-gray-100">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            {/* Dịch vụ/Ưu đãi */}
            <div className="flex flex-wrap gap-4 text-sm mb-2">
              <span className="flex items-center gap-1 text-green-600"><Truck className="w-4 h-4" /> Giao hàng nhanh</span>
              <span className="flex items-center gap-1 text-blue-600"><Shield className="w-4 h-4" /> Bảo hành chính hãng</span>
              <span className="flex items-center gap-1 text-yellow-600"><RotateCcw className="w-4 h-4" /> Đổi trả 7 ngày</span>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs mô tả/thông số/đánh giá/hỏi đáp */}
      <div className="mt-8 bg-white border rounded-lg p-6">
        <div className="flex gap-4 border-b mb-4">
          {tabList.map(tab => (
            <button
              key={tab.key}
              className={`py-2 px-4 font-medium ${activeTab === tab.key ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Nội dung tab */}
        {activeTab === 'description' && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h2>
            <div className="text-gray-700 whitespace-pre-line">{getDesc()}</div>
          </div>
        )}
        {activeTab === 'specs' && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Thông số kỹ thuật</h2>
            <table className="min-w-full text-sm">
              <tbody>
                {Object.entries(getSpecs()).map(([key, value]) => (
                  <tr key={key}>
                    <td className="py-1 pr-4 text-gray-600 font-medium whitespace-nowrap">{key}</td>
                    <td className="py-1 text-gray-800">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Đánh giá sản phẩm</h2>
            <div className="text-gray-500 italic">Chức năng đánh giá sẽ sớm ra mắt.</div>
          </div>
        )}
        {activeTab === 'qa' && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Hỏi đáp</h2>
            <div className="text-gray-500 italic">Chức năng hỏi đáp sẽ sớm ra mắt.</div>
          </div>
        )}
      </div>
    </div>
  );
};