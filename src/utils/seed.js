/* eslint-disable */
import 'dotenv/config';
import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo client Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Số lượng bản ghi mẫu
const SEED_COUNT = 20;

// Hàm tạo dữ liệu user
async function createUsers() {
  const users = [];
  
  for (let i = 0; i < SEED_COUNT; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    const user = {
      email: faker.internet.email({ firstName, lastName }),
      password: faker.internet.password(),
      full_name: `${firstName} ${lastName}`,
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country()
    };
    
    users.push(user);
  }
  
  // Insert batch vào database
  const { data, error } = await supabase
    .from('users')
    .insert(users)
    .select();
    
  if (error) console.error('Error seeding users:', error);
  else console.log(`Seeded ${data.length} users`);
}

// Hàm tạo dữ liệu category
async function createCategories() {
  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Toys']
    .map(name => ({
      name,
      description: faker.lorem.paragraph(),
      image_url: faker.image.urlLoremFlickr({ category: name })
    }));
  
  const { data, error } = await supabase
    .from('categories')
    .insert(categories)
    .select();
    
  if (error) console.error('Error seeding categories:', error);
  else console.log(`Seeded ${data.length} categories`);
}

// Main function
async function main() {
  console.log('Starting seed process...');
  await createUsers();
  await createCategories();
  console.log('Seed completed');
}

main();
