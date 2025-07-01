import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, CreditCard, Truck, FileText, Mail, Shield, Database, BarChart, Bell } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../api';

interface TabsProps {
  defaultValue: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ defaultValue, onValueChange, className, children }) => {
  return <div className={className}>{children}</div>;
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children }) => {
  return (
    <button className={className} data-value={value}>
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  return <div data-value={value}>{children}</div>;
};

interface SettingsFormProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

const SettingsForm: React.FC<SettingsFormProps> = ({
  title,
  description,
  children,
  onSubmit,
  isLoading = false
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <div className="space-y-4">
        {children}
      </div>
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export const SettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      storeName: 'Yapee',
      storeEmail: 'cskh@yapee.vn',
      storePhone: '+1 (555) 123-4567',
      storeAddress: '123 Main St, City, Country',
      defaultLanguage: 'en',
      defaultCurrency: 'USD',
      enableMaintenanceMode: false
    },
    payment: {
      enableCreditCards: true,
      enablePayPal: true,
      enableCryptoPayments: false,
      enableBankTransfer: true,
      paymentGateway: 'stripe',
      testMode: true,
      apiKey: '••••••••••••••••',
      secretKey: '••••••••••••••••'
    },
    shipping: {
      enableFreeShipping: true,
      freeShippingThreshold: 100,
      enableLocalPickup: true,
      enableInternationalShipping: true,
      defaultShippingMethod: 'standard',
      shippingOriginAddress: '123 Main St, City, Country'
    },
    tax: {
      enableTaxCalculation: true,
      taxRate: 10,
      enableVAT: false,
      vatNumber: '',
      taxIncludedInPrice: false
    },
    email: {
      smtpHost: 'smtp.example.com',
      smtpPort: 587,
      smtpUsername: 'user@example.com',
      smtpPassword: '••••••••••',
      senderEmail: 'noreply@yapee.vn',
      senderName: 'Yapee',
      enableEmailNotifications: true
    },
    security: {
      enableTwoFactorAuth: true,
      passwordExpiryDays: 90,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      enableCaptcha: true
    },
    backup: {
      enableAutomaticBackups: true,
      backupFrequency: 'daily',
      backupRetentionDays: 30,
      backupStorage: 'cloud'
    },
    performance: {
      enableCaching: true,
      cacheDuration: 60,
      enableImageOptimization: true,
      enableLazyLoading: true,
      enableMinification: true
    },
    notifications: {
      enablePushNotifications: true,
      enableEmailNotifications: true,
      enableSmsNotifications: false,
      notifyOnNewOrder: true,
      notifyOnLowStock: true,
      notifyOnCustomerRegistration: false
    }
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await api.settings.getSettings();
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.settings.updateSettings(settings);
      // Show success notification
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Show error notification
      alert('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  type SettingsSectionData = Record<string, unknown>; // hoặc định nghĩa chi tiết hơn nếu biết cấu trúc

  const updateSettings = (section: string, data: SettingsSectionData) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        ...data
      }
    }));
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('admin.settings')}</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your store settings</p>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex overflow-x-auto p-1 border-b border-gray-200 dark:border-gray-700">
            <TabsTrigger value="general" className="flex items-center px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center px-4 py-2">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center px-4 py-2">
              <Truck className="w-4 h-4 mr-2" />
              Shipping
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center px-4 py-2">
              <FileText className="w-4 h-4 mr-2" />
              Tax
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center px-4 py-2">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center px-4 py-2">
              <Database className="w-4 h-4 mr-2" />
              Backup
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center px-4 py-2">
              <BarChart className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center px-4 py-2">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="general">
              <SettingsForm
                title="General Settings"
                description="Configure your store's basic information and preferences."
                onSubmit={handleSubmit}
                isLoading={isLoading}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Store Name
                    </label>
                    <input
                      id="storeName"
                      type="text"
                      value={settings.general.storeName}
                      onChange={(e) => updateSettings('general', { storeName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Store Email
                    </label>
                    <input
                      id="storeEmail"
                      type="email"
                      value={settings.general.storeEmail}
                      onChange={(e) => updateSettings('general', { storeEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Store Phone
                    </label>
                    <input
                      id="storePhone"
                      type="text"
                      value={settings.general.storePhone}
                      onChange={(e) => updateSettings('general', { storePhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Store Address
                    </label>
                    <input
                      id="storeAddress"
                      type="text"
                      value={settings.general.storeAddress}
                      onChange={(e) => updateSettings('general', { storeAddress: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="defaultLanguage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Default Language
                    </label>
                    <select
                      id="defaultLanguage"
                      value={settings.general.defaultLanguage}
                      onChange={(e) => updateSettings('general', { defaultLanguage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="vi">Vietnamese</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Default Currency
                    </label>
                    <select
                      id="defaultCurrency"
                      value={settings.general.defaultCurrency}
                      onChange={(e) => updateSettings('general', { defaultCurrency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="VND">VND - Vietnamese Dong</option>
                      <option value="CNY">CNY - Chinese Yuan</option>
                    </select>
                  </div>

                  <div className="col-span-1 md:col-span-2 flex items-center space-x-2">
                    <input
                      id="enableMaintenanceMode"
                      type="checkbox"
                      checked={settings.general.enableMaintenanceMode}
                      onChange={(e) => updateSettings('general', { enableMaintenanceMode: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enableMaintenanceMode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Maintenance Mode
                    </label>
                  </div>
                </div>
              </SettingsForm>
            </TabsContent>

            <TabsContent value="payment">
              <SettingsForm
                title="Payment Settings"
                description="Configure your store's payment methods and gateways."
                onSubmit={handleSubmit}
                isLoading={isLoading}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      id="enableCreditCards"
                      type="checkbox"
                      checked={settings.payment.enableCreditCards}
                      onChange={(e) => updateSettings('payment', { enableCreditCards: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enableCreditCards" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Credit Card Payments
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="enablePayPal"
                      type="checkbox"
                      checked={settings.payment.enablePayPal}
                      onChange={(e) => updateSettings('payment', { enablePayPal: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enablePayPal" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable PayPal
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="enableBankTransfer"
                      type="checkbox"
                      checked={settings.payment.enableBankTransfer}
                      onChange={(e) => updateSettings('payment', { enableBankTransfer: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enableBankTransfer" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Bank Transfer
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="paymentGateway" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Payment Gateway
                    </label>
                    <select
                      id="paymentGateway"
                      value={settings.payment.paymentGateway}
                      onChange={(e) => updateSettings('payment', { paymentGateway: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="vnpay">VNPAY</option>
                      <option value="momo">MoMo</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="testMode"
                      type="checkbox"
                      checked={settings.payment.testMode}
                      onChange={(e) => updateSettings('payment', { testMode: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="testMode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Test Mode
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      API Key
                    </label>
                    <input
                      id="apiKey"
                      type="password"
                      value={settings.payment.apiKey}
                      onChange={(e) => updateSettings('payment', { apiKey: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Secret Key
                    </label>
                    <input
                      id="secretKey"
                      type="password"
                      value={settings.payment.secretKey}
                      onChange={(e) => updateSettings('payment', { secretKey: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </SettingsForm>
            </TabsContent>

            {/* Các tab khác tương tự */}
            <TabsContent value="shipping">
              <SettingsForm
                title="Shipping Settings"
                description="Configure your store's shipping methods and options."
                onSubmit={handleSubmit}
                isLoading={isLoading}
              >
                {/* Nội dung cài đặt vận chuyển */}
                <p className="text-gray-600">Shipping settings content will be implemented here.</p>
              </SettingsForm>
            </TabsContent>

            <TabsContent value="tax">
              <SettingsForm
                title="Tax Settings"
                description="Configure your store's tax rates and calculations."
                onSubmit={handleSubmit}
                isLoading={isLoading}
              >
                {/* Nội dung cài đặt thuế */}
                <p className="text-gray-600">Tax settings content will be implemented here.</p>
              </SettingsForm>
            </TabsContent>

            <TabsContent value="email">
              <SettingsForm
                title="Email Settings"
                description="Configure your store's email notifications and templates."
                onSubmit={handleSubmit}
                isLoading={isLoading}
              >
                {/* Nội dung cài đặt email */}
                <p className="text-gray-600">Email settings content will be implemented here.</p>
              </SettingsForm>
            </TabsContent>

            <TabsContent value="security">
              <SettingsForm
                title="Security Settings"
                description="Configure your store's security options and policies."
                onSubmit={handleSubmit}
                isLoading={isLoading}
              >
                {/* Nội dung cài đặt bảo mật */}
                <p className="text-gray-600">Security settings content will be implemented here.</p>
              </SettingsForm>
            </TabsContent>

            <TabsContent value="backup">
              <SettingsForm
                title="Backup Settings"
                description="Configure your store's backup schedule and options."
                onSubmit={handleSubmit}
                isLoading={isLoading}
              >
                {/* Nội dung cài đặt sao lưu */}
                <p className="text-gray-600">Backup settings content will be implemented here.</p>
              </SettingsForm>
            </TabsContent>

            <TabsContent value="performance">
              <SettingsForm
                title="Performance Settings"
                description="Configure your store's performance optimization options."
                onSubmit={handleSubmit}
                isLoading={isLoading}
              >
                {/* Nội dung cài đặt hiệu suất */}
                <p className="text-gray-600">Performance settings content will be implemented here.</p>
              </SettingsForm>
            </TabsContent>

            <TabsContent value="notifications">
              <SettingsForm
                title="Notification Settings"
                description="Configure your store's notification preferences."
                onSubmit={handleSubmit}
                isLoading={isLoading}
              >
                {/* Nội dung cài đặt thông báo */}
                <p className="text-gray-600">Notification settings content will be implemented here.</p>
              </SettingsForm>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;