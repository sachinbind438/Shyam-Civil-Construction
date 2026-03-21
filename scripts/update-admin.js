const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
async function connectDB() {
  try {
    const MONGODB_URI = 'mongodb+srv://bindsachin438:S%40chinbind438@projects.3sctlpu.mongodb.net/shyamcivilconstruction?retryWrites=true&w=majority&appName=projects';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Admin schema
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "Admin" },
  role: { type: String, default: "admin", enum: ["admin", "superadmin"] }
}, { timestamps: true });

// Password hashing middleware
AdminSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function updateAdminCredentials() {
  try {
    await connectDB();
    
    // Update existing admin or create new one
    const admin = await Admin.findOneAndUpdate(
      { email: 'shyam@civil.com' },
      { 
        email: 'shyam@civil.com',
        password: 'Shyam@2025', // Will be hashed automatically
        name: 'Shyam Admin',
        role: 'admin'
      },
      { upsert: true, new: true }
    );
    
    console.log('Admin credentials updated successfully!');
    console.log('New Email: shyam@civil.com');
    console.log('New Password: Shyam@2025');
    
    // Delete old admin if it exists
    await Admin.deleteOne({ email: 'shyam@shyamcivil.com' });
    console.log('Old admin account removed');
    
  } catch (error) {
    console.error('Error updating admin:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

updateAdminCredentials();
