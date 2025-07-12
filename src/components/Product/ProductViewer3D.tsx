import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const RotatingBox: React.FC<{ color: string }> = ({ color }) => {
  const meshRef = useRef<any>();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Box ref={meshRef} args={[2, 2, 2]}>
      <meshStandardMaterial color={color} />
    </Box>
  );
};

interface ProductViewer3DProps {
  productColor?: string;
  className?: string;
}

export const ProductViewer3D: React.FC<ProductViewer3DProps> = ({ 
  productColor = '#3B82F6', 
  className = '' 
}) => {
  const { t } = useLanguage();

  return (
    <motion.div 
      className={`w-full h-96 bg-gray-50 rounded-lg overflow-hidden relative ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <RotatingBox color={productColor} />
          <Environment preset="city" />
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={8}
          />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        {t('productDetail.dragToRotate')}
      </div>
    </motion.div>
  );
};
