# 📋 Coding Standards - Yapee E-commerce Project

## 🎯 Mục tiêu
Đảm bảo tính nhất quán, dễ đọc và dễ bảo trì cho toàn bộ dự án.

## 📦 Export/Import Conventions

### 1. Default Export Rules
**Sử dụng default export cho:**
- React Components chính (Pages, Layouts)
- Services chính (DatabaseService, DeploymentService)
- Utility classes hoặc main functions

```typescript
// ✅ ĐÚNG - Default export cho React component
export default function HomePage() {
  return <div>Home</div>;
}

// ✅ ĐÚNG - Default export cho service
class DatabaseService {
  // implementation
}
export default DatabaseService;
```

### 2. Named Export Rules
**Sử dụng named export cho:**
- Multiple utilities trong cùng file
- Types và interfaces
- Constants và enums
- Hook functions
- Multiple services trong index files

```typescript
// ✅ ĐÚNG - Named exports cho utilities
export const formatCurrency = (amount: number) => { };
export const formatDate = (date: Date) => { };

// ✅ ĐÚNG - Named exports cho types
export interface Product {
  id: string;
  name: string;
}

// ✅ ĐÚNG - Named exports cho hooks
export const useCart = () => { };
export const useAuth = () => { };
```

### 3. Import Conventions

```typescript
// ✅ ĐÚNG - Import order
// 1. React và third-party libraries
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// 2. Internal types
import { Product, User } from '../types';

// 3. Internal services và utilities
import { productService } from '../services';
import { formatCurrency } from '../utils';

// 4. Internal components
import { ProductCard } from '../components/Product/ProductCard';
import { useLanguage } from '../contexts/LanguageContext';
```

### 4. Index Files Pattern

```typescript
// ✅ ĐÚNG - services/index.ts
// Re-export với consistent naming
export { default as DatabaseService } from './DatabaseService';
export { productService, ProductService } from './ProductService';
export { orderService, OrderService } from './OrderService';

// Export types
export type { CreateUserData, UpdateUserData } from './UserService';
export type { Product, Order, User } from '../types';
```

## 🔧 TypeScript Configuration

### Strict Mode Settings
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## 📝 ESLint Rules

### Import/Export Rules
```javascript
rules: {
  // Enforce consistent import order
  'import/order': ['error', {
    'groups': [
      'builtin',
      'external',
      'internal',
      'parent',
      'sibling',
      'index'
    ],
    'newlines-between': 'always'
  }],
  
  // Prefer default export for single export
  'import/prefer-default-export': 'warn',
  
  // No default export for multiple exports
  'import/no-default-export': 'off',
  
  // Consistent export style
  'import/group-exports': 'error'
}
```

## 🏗️ File Organization

### Component Structure
```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx          // default export
│   │   ├── Footer.tsx          // default export
│   │   └── index.ts            // re-exports
│   ├── Product/
│   │   ├── ProductCard.tsx     // default export
│   │   ├── ProductViewer3D.tsx // default export
│   │   └── index.ts            // re-exports
│   └── index.ts                // main re-exports
```

### Service Structure
```
src/
├── services/
│   ├── DatabaseService.ts      // default export
│   ├── ProductService.ts       // named export + class
│   ├── OrderService.ts         // named export + class
│   └── index.ts                // re-exports all
```

## ✅ Best Practices

1. **Consistency First**: Luôn tuân thủ pattern đã định
2. **Clear Naming**: Tên file và export phải rõ ràng
3. **Single Responsibility**: Mỗi file chỉ nên có một mục đích chính
4. **Type Safety**: Luôn export types cùng với implementation
5. **Documentation**: Comment cho các export phức tạp

## 🚫 Anti-patterns

```typescript
// ❌ SAI - Mixed export styles
export default function Component() { }
export const utils = { };

// ❌ SAI - Unclear naming
export { ProductService as PS };

// ❌ SAI - Deep import paths
import { ProductCard } from '../../../components/Product/ProductCard';

// ✅ ĐÚNG - Use index files
import { ProductCard } from '../components';
```

## 🔄 Migration Strategy

1. **Phase 1**: Cập nhật ESLint rules
2. **Phase 2**: Standardize service exports
3. **Phase 3**: Organize component exports
4. **Phase 4**: Update import statements
5. **Phase 5**: Add index files where needed

---

*Tài liệu này sẽ được cập nhật khi có thay đổi trong dự án.*