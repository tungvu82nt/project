// Script to initialize admin user in localStorage
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Simple password hashing function (matches the one in security.ts)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'salt').digest('hex');
}

// Create admin user data
const adminUser = {
  id: 1,
  email: 'admin@yapee.vn',
  password: hashPassword('admin123'),
  firstName: 'Admin',
  lastName: 'User',
  phone: '+1234567890',
  role: 'admin',
  isActive: true,
  isEmailVerified: true,
  preferences: {
    language: 'en',
    currency: 'USD',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  },
  addresses: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastLoginAt: null
};

// Initialize localStorage data
const localStorageData = {
  db_users: JSON.stringify([adminUser]),
  db_products: JSON.stringify([]),
  db_orders: JSON.stringify([]),
  db_categories: JSON.stringify([]),
  db_reviews: JSON.stringify([]),
  db_settings: JSON.stringify([])
};

console.log('Admin user created with:');
console.log('Email: admin@elitestore.com');
console.log('Password: admin123');
console.log('Hashed password:', adminUser.password);
console.log('\nLocalStorage data initialized:');
console.log(JSON.stringify(localStorageData, null, 2));

// Save to a JSON file that can be imported
fs.writeFileSync('localStorage-init.json', JSON.stringify(localStorageData, null, 2));
console.log('\nData saved to localStorage-init.json');
console.log('You can manually set this data in browser localStorage or import it in your app.');