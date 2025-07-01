import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Mesh, MeshStandardMaterial } from 'three';

// Fallback component when no model is provided
const RotatingBox: React.FC<{ color: string }> = ({ color }) => {
  const meshRef = useRef<Mesh>();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// GLTF Model component
const Model: React.FC<{ path: string, scale?: number, position?: [number, number, number], rotation?: [number, number, number] }> = ({ 
  path, 
  scale = 1, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0] 
}) => {
  const { scene } = useGLTF(path);
  const modelRef = useRef<Mesh>();

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3;
    }
  });

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          if (mesh.material) {
            // Ensure materials are properly lit
            const material = mesh.material as MeshStandardMaterial;
            material.roughness = 0.5;
            material.metalness = 0.5;
          }
        }
      });
    }
  }, [scene]);

  return <primitive ref={modelRef} object={scene} scale={scale} position={position} rotation={rotation} />;
};

// OBJ Model component
const OBJModel: React.FC<{ path: string, scale?: number, position?: [number, number, number], rotation?: [number, number, number] }> = ({ 
  path, 
  scale = 1, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0] 
}) => {
  const obj = useLoader(OBJLoader, path);
  const modelRef = useRef<Mesh>();

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3;
    }
  });

  return <primitive ref={modelRef} object={obj} scale={scale} position={position} rotation={rotation} />;
};

// FBX Model component
const FBXModel: React.FC<{ path: string, scale?: number, position?: [number, number, number], rotation?: [number, number, number] }> = ({ 
  path, 
  scale = 1, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0] 
}) => {
  const fbx = useLoader(FBXLoader, path);
  const modelRef = useRef<Mesh>();

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3;
    }
  });

  return <primitive ref={modelRef} object={fbx} scale={scale} position={position} rotation={rotation} />;
};

interface ProductViewer3DProps {
  productColor?: string;
  className?: string;
  modelPath?: string;
  modelType?: 'gltf' | 'obj' | 'fbx';
  modelScale?: number;
  modelPosition?: [number, number, number];
  modelRotation?: [number, number, number];
  backgroundColor?: string;
  autoRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
}

export const ProductViewer3D: React.FC<ProductViewer3DProps> = ({ 
  productColor = '#3B82F6', 
  className = '',
  modelPath,
  modelType = 'gltf',
  modelScale = 1,
  modelPosition = [0, 0, 0],
  modelRotation = [0, 0, 0],
  backgroundColor = '#f9fafb',
  autoRotate = true,
  enableZoom = true,
  enablePan = false
}) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Determine which model component to render
  const renderModel = () => {
    if (!modelPath) {
      return <RotatingBox color={productColor} />;
    }

    try {
      switch (modelType) {
        case 'gltf':
          return (
            <Model 
              path={modelPath} 
              scale={modelScale} 
              position={modelPosition} 
              rotation={modelRotation} 
            />
          );
        case 'obj':
          return (
            <OBJModel 
              path={modelPath} 
              scale={modelScale} 
              position={modelPosition} 
              rotation={modelRotation} 
            />
          );
        case 'fbx':
          return (
            <FBXModel 
              path={modelPath} 
              scale={modelScale} 
              position={modelPosition} 
              rotation={modelRotation} 
            />
          );
        default:
          return <RotatingBox color={productColor} />;
      }
    } catch (error) {
      console.error('Error loading 3D model:', error);
      setLoadError('Failed to load 3D model');
      return <RotatingBox color={productColor} />;
    }
  };

  // Handle loading state
  const handleSceneLoaded = () => {
    setIsLoading(false);
  };

  return (
    <motion.div 
      className={`w-full h-96 rounded-lg overflow-hidden relative ${className}`}
      style={{ backgroundColor }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-700">Loading 3D model...</p>
          </div>
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-50 z-10">
          <div className="text-red-600 text-center p-4">
            <p className="font-semibold">{loadError}</p>
            <p className="text-sm mt-2">Displaying fallback model</p>
          </div>
        </div>
      )}

      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        onCreated={handleSceneLoaded}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={1} castShadow />
          
          {renderModel()}
          
          <Environment preset="city" />
          <OrbitControls 
            enablePan={enablePan}
            enableZoom={enableZoom}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
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

// Preload common models to improve performance
useGLTF.preload('/models/default_product.glb');

export default ProductViewer3D;