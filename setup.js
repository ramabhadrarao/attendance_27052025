#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up Student Attendance Management System...\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📄 Creating .env file from .env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully');
    console.log('⚠️  Please update the JWT_SECRET in .env file before running the application\n');
  } else {
    console.log('❌ .env.example file not found. Please create .env manually.\n');
  }
}

// Check Node.js version
console.log('🔍 Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.log('❌ Node.js version 16 or higher is required');
  console.log(`   Current version: ${nodeVersion}`);
  process.exit(1);
}
console.log(`✅ Node.js version: ${nodeVersion}\n`);

// Check if MongoDB is running
console.log('🔍 Checking MongoDB connection...');
try {
  execSync('mongosh --eval "db.runCommand({ping: 1})" --quiet', { stdio: 'pipe' });
  console.log('✅ MongoDB is accessible\n');
} catch (error) {
  console.log('⚠️  MongoDB connection check failed');
  console.log('   Make sure MongoDB is installed and running');
  console.log('   MongoDB installation guide: https://docs.mongodb.com/manual/installation/\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully\n');
} catch (error) {
  console.log('❌ Failed to install dependencies');
  console.log('   Please run "npm install" manually\n');
  process.exit(1);
}

// Seed database
console.log('🌱 Seeding database...');
try {
  execSync('npm run seed', { stdio: 'inherit' });
  console.log('✅ Database seeded successfully\n');
} catch (error) {
  console.log('❌ Failed to seed database');
  console.log('   Please ensure MongoDB is running and run "npm run seed" manually\n');
}

// Create directories if they don't exist
const directories = [
  'logs',
  'uploads',
  'temp'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

console.log('\n🎉 Setup completed successfully!\n');
console.log('📋 Next steps:');
console.log('   1. Update JWT_SECRET in .env file (important for security)');
console.log('   2. Start the application: npm run dev:full');
console.log('   3. Open your browser and go to: http://localhost:5173');
console.log('\n🔑 Login Credentials:');
console.log('   Students: student1/password123, student2/password123, etc.');
console.log('   Faculty: faculty1/password123, faculty2/password123, etc.');
console.log('   HOD: hod1/password123');
console.log('\n📚 Documentation: README.md');
console.log('🐛 Issues: Check console logs and ensure MongoDB is running');
console.log('\n✨ Happy coding!');