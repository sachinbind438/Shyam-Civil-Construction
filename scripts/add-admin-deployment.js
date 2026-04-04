// Add admin user for deployment
const fs = require('fs')
const path = require('path')

// Load environment variables manually
const envPath = path.join(__dirname, '../.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

const envVars = {}
envContent.split('\n').forEach(line => {
  if (line.includes('=') && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=')
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

async function addAdmin() {
  try {
    // Connect to MongoDB
    const mongoose = require('mongoose')
    await mongoose.connect(envVars.MONGODB_URI)

    // Admin model
    const AdminSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, default: 'Admin' },
      role: { type: String, default: 'admin' },
      lastLogin: { type: Date },
    }, { timestamps: true })

    // Add pre-save hook for password hashing
    const bcrypt = require('bcryptjs')
    AdminSchema.pre('save', async function(next) {
      if (!this.isModified('password')) return next()
      const salt = await bcrypt.genSalt(12)
      this.password = await bcrypt.hash(this.password, salt)
      next()
    })

    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'shyamcivil@gmail.com' })
    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      await mongoose.disconnect()
      return
    }

    // Create admin user
    const admin = new Admin({
      email: 'shyamcivil@gmail.com',
      password: 'Shyam@93245',
      name: 'Shyam Civil Admin',
      role: 'admin'
    })

    await admin.save()
    console.log('✅ Admin user created successfully')
    console.log('Email: shyamcivil@gmail.com')
    console.log('Password: Shyam@93245')

    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

addAdmin()
