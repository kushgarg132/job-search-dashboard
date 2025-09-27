#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up Job Search Dashboard...\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...')
  const envContent = `# MongoDB Atlas Connection String
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-search-dashboard?retryWrites=true&w=majority

# Next.js Environment
NODE_ENV=development
`
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Created .env.local file')
  console.log('⚠️  Please update the MONGODB_URI with your actual MongoDB Atlas connection string\n')
} else {
  console.log('✅ .env.local file already exists\n')
}

console.log('📦 Installing dependencies...')
console.log('Run: npm install\n')

console.log('🌱 To seed the database with sample data:')
console.log('Visit: http://localhost:3000/api/seed\n')

console.log('🚀 To start the development server:')
console.log('Run: npm run dev\n')

console.log('📚 For more information, see the README.md file')
console.log('🎉 Setup complete!')
