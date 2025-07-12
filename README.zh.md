# 🛍️ Yapee - 完整电商应用程序

<div align="center">

![Yapee Logo](https://via.placeholder.com/200x80/3B82F6/FFFFFF?text=Yapee)

**现代化全功能电商平台，具有3D产品可视化、全面管理系统和企业级安全性。**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-blue.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🚀 在线演示](#) | [📖 文档](#documentation) | [🐛 报告错误](#) | [💡 功能请求](#)

**[English](README.md#english) | [Tiếng Việt](README.md#tiếng-việt) | [中文](#中文)**

</div>

---

## 中文

### 📋 目录

- [🌟 功能特性](#-功能特性)
- [🏗️ 架构](#️-架构)
- [🚀 快速开始](#-快速开始)
- [📦 安装](#-安装)
- [⚙️ 配置](#️-配置)
- [🔧 开发](#-开发)
- [🧪 测试](#-测试)
- [🚀 部署](#-部署)
- [📚 API文档](#-api文档)
- [🔒 安全](#-安全)
- [🎨 UI/UX设计](#-uiux设计)
- [📱 移动端支持](#-移动端支持)
- [🌐 国际化](#-国际化)
- [📊 分析与监控](#-分析与监控)
- [🤝 贡献](#-贡献)
- [📄 许可证](#-许可证)

### 🌟 功能特性

#### 🛒 **客户体验**
- **🎯 现代购物界面**: 直观的产品浏览，具有高级过滤和搜索功能
- **🔍 3D产品可视化**: 交互式3D模型，提供沉浸式产品查看体验
- **📱 响应式设计**: 在所有设备和屏幕尺寸上提供无缝体验
- **🛍️ 智能购物车**: 持久化购物车，具有数量管理和价格计算功能
- **💳 多种支付选项**: 支持VNPAY、MoMo、信用卡和银行转账
- **📦 订单跟踪**: 实时订单状态更新和物流跟踪
- **👤 用户账户**: 个人资料管理、订单历史和愿望清单功能
- **⭐ 评价与评分**: 客户反馈系统，提供详细的产品评价
- **🔔 实时通知**: 为所有用户操作和更新提供Toast通知

#### 🔧 **管理员管理**
- **📊 综合仪表板**: 实时分析，具有交互式图表和KPI
- **📦 产品管理**: 完整的CRUD操作，具有批量导入/导出功能
- **📋 订单处理**: 高级订单管理，具有状态跟踪和自动化功能
- **👥 客户管理**: 详细的客户档案，具有细分和沟通工具
- **💰 财务跟踪**: 收入分析、支付处理和财务报告
- **🎨 内容管理**: 动态内容编辑器，用于页面、横幅和促销材料
- **📈 营销工具**: 优惠券管理、邮件营销和促销系统
- **⚙️ 系统设置**: 平台各个方面的全面配置

#### 🛡️ **安全与性能**
- **🔐 企业级安全**: 多层安全，具有加密、CSRF保护和速率限制
- **🚀 优化性能**: 高级缓存、懒加载和代码分割
- **📱 渐进式Web应用**: 离线功能和类似应用的体验
- **🌐 多语言支持**: 英语、越南语和中文本地化
- **📊 高级分析**: 详细的商业智能和性能监控
- **🔄 CI/CD流水线**: 自动化测试、构建和部署流程

### 🏗️ 架构

#### **前端架构**
```
src/
├── components/          # 可重用的UI组件
│   ├── Auth/           # 认证组件
│   ├── Layout/         # 布局组件 (Header, Footer)
│   ├── Product/        # 产品相关组件
│   ├── Notifications/  # 通知系统
│   └── ...
├── pages/              # 页面组件
├── admin/              # 管理面板组件
├── hooks/              # 自定义React hooks
├── contexts/           # React contexts
├── utils/              # 工具函数
├── services/           # 业务逻辑服务
├── api/                # API集成
├── middleware/         # 安全和性能中间件
└── types/              # TypeScript类型定义
```

#### **技术栈**

##### **核心技术**
- **前端框架**: React 18.3.1 with TypeScript
- **构建工具**: Vite 5.4.2 用于快速开发和优化构建
- **样式**: Tailwind CSS 3.4.1 用于实用优先的样式
- **路由**: React Router DOM 6.8.1 用于客户端路由
- **状态管理**: React Context API with custom hooks

##### **UI与可视化**
- **3D图形**: Three.js with React Three Fiber 用于3D产品可视化
- **图表与分析**: Recharts 用于数据可视化
- **动画**: Framer Motion 用于流畅的动画和过渡
- **图标**: Lucide React 用于一致的图标

##### **开发与质量**
- **代码检查**: ESLint with TypeScript support
- **测试**: Vitest with React Testing Library
- **类型安全**: 完整的TypeScript实现
- **代码质量**: 自动化测试和质量检查

### 🚀 快速开始

#### **先决条件**
- Node.js 18.0.0 或更高版本
- npm 8.0.0 或更高版本
- 支持ES2020的现代Web浏览器

#### **1分钟设置**
```bash
# 克隆仓库
git clone https://github.com/your-username/yapee.git
cd yapee

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

🎉 **就是这样!** 打开 [http://localhost:5173](http://localhost:5173) 查看应用程序。

### 📦 安装

#### **开发环境**

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/yapee.git
   cd yapee
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   ```bash
   cp .env.example .env.local
   ```
   
   配置环境变量:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_ENCRYPTION_KEY=your-encryption-key-here
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

#### **生产构建**
```bash
# 生产构建
npm run build

# 预览生产构建
npm run preview
```

### ⚙️ 配置

#### **环境变量**

| 变量 | 描述 | 默认值 | 必需 |
|------|------|--------|------|
| `VITE_API_URL` | 后端API URL | `/api` | 否 |
| `VITE_ENCRYPTION_KEY` | 数据加密密钥 | `default-key` | 是 (生产环境) |
| `VITE_SUPABASE_URL` | Supabase项目URL | - | 是 (如果使用Supabase) |
| `VITE_SUPABASE_ANON_KEY` | Supabase匿名密钥 | - | 是 (如果使用Supabase) |

### 🔧 开发

#### **可用脚本**

| 脚本 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 运行ESLint |
| `npm run test` | 运行测试 |
| `npm run test:ui` | 运行带UI的测试 |
| `npm run test:coverage` | 运行带覆盖率的测试 |
| `npm run type-check` | TypeScript类型检查 |

### 🧪 测试

#### **测试策略**

##### **单元测试**
```bash
# 运行单元测试
npm run test

# 运行带覆盖率的测试
npm run test:coverage

# 运行特定测试文件
npm run test -- ProductCard.test.tsx
```

##### **集成测试**
```typescript
// 集成测试示例
import { renderWithProviders } from '../utils/testing';
import { ProductDetail } from '../pages/ProductDetail';

test('should display product information', async () => {
  const { getByText } = renderWithProviders(
    <ProductDetail />,
    { initialEntries: ['/product/1'] }
  );
  
  expect(getByText('Product Name')).toBeInTheDocument();
});
```

### 🚀 部署

#### **生产部署**

##### **构建优化**
```bash
# 带优化的生产构建
npm run build

# 分析包大小
npm run build -- --analyze
```

##### **部署选项**

1. **Netlify (推荐)**
   ```bash
   # 构建命令
   npm run build
   
   # 发布目录
   dist
   ```

2. **Vercel**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```

### 📚 API文档

#### **认证端点**

##### **POST /api/auth/login**
```typescript
// 请求
{
  email: string;
  password: string;
  twoFactorCode?: string;
}

// 响应
{
  user: User;
  token: string;
  refreshToken: string;
}
```

##### **POST /api/auth/register**
```typescript
// 请求
{
  name: string;
  email: string;
  password: string;
}

// 响应
{
  user: User;
  token: string;
}
```

### 🔒 安全

#### **安全功能**

##### **认证与授权**
- **JWT令牌**: 基于令牌的安全认证
- **2FA支持**: 双因素认证增强安全性
- **基于角色的访问**: 管理员和客户角色分离
- **会话管理**: 带超时的安全会话处理

##### **数据保护**
- **输入清理**: 对所有用户输入进行XSS保护
- **CSRF保护**: 跨站请求伪造防护
- **数据加密**: 使用AES加密敏感数据
- **速率限制**: API速率限制防止滥用

### 🎨 UI/UX设计

#### **设计系统**

##### **调色板**
```css
/* 主要颜色 */
--blue-600: #3B82F6;    /* 主要品牌颜色 */
--blue-700: #1D4ED8;    /* 主要悬停状态 */
--blue-50: #EFF6FF;     /* 浅色背景 */

/* 语义颜色 */
--green-600: #10B981;   /* 成功 */
--red-600: #EF4444;     /* 错误 */
--yellow-600: #F59E0B;  /* 警告 */
--gray-600: #6B7280;    /* 中性 */
```

##### **排版**
```css
/* 字体系列 */
font-family: system-ui, -apple-system, sans-serif;

/* 字体大小 */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
```

### 📱 移动端支持

#### **渐进式Web应用 (PWA)**

##### **功能**
- **离线支持**: 缓存关键资源以供离线浏览
- **类似应用的体验**: 具有流畅动画的原生应用感觉
- **推送通知**: 实时更新和促销消息
- **主屏幕安装**: 添加到主屏幕功能

### 🌐 国际化

#### **支持的语言**
- **英语 (en)**: 默认语言
- **越南语 (vi)**: 完整本地化支持
- **中文 (zh)**: 完整翻译

#### **实现**

##### **语言文件**
```typescript
// src/locales/zh.json
{
  "common": {
    "loading": "加载中...",
    "error": "发生错误",
    "success": "成功"
  },
  "products": {
    "title": "产品",
    "addToCart": "加入购物车",
    "outOfStock": "缺货"
  }
}
```

##### **使用方法**
```typescript
import { useLanguage } from './hooks/useLanguage';

function ProductCard() {
  const { t } = useLanguage();
  
  return (
    <button>{t('products.addToCart')}</button>
  );
}
```

### 📊 分析与监控

#### **业务分析**

##### **仪表板指标**
- **收入跟踪**: 实时收入监控
- **销售分析**: 产品性能和趋势
- **客户洞察**: 行为分析和细分
- **转化率**: 漏斗分析和优化

### 🤝 贡献

我们欢迎社区的贡献！以下是您可以帮助的方式：

#### **开始**

1. **Fork仓库**
   ```bash
   git fork https://github.com/your-username/yapee.git
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **进行更改**
   - 遵循编码标准
   - 为新功能添加测试
   - 更新文档

4. **提交Pull Request**
   ```bash
   git push origin feature/amazing-feature
   ```

### 📄 许可证

本项目根据MIT许可证授权 - 详情请参阅 [LICENSE](LICENSE) 文件。

---

<div align="center">

**⭐ 如果您觉得有用，请为此仓库加星！**

**由Yapee团队用❤️制作**

**[English](README.md#english) | [Tiếng Việt](README.md#tiếng-việt) | [中文](#中文)**

</div>