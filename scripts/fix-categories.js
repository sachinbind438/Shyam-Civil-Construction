require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI!;

const categoryFixes = {
  "Interior Design": "Interior",
  "Residential Design": "Residential", 
  "Commercial Design": "Commercial",
  "interior": "Interior",
  "residential": "Residential",
  "commercial": "Commercial",
  "renovation": "Commercial",
  "exterior": "Commercial",
  "other": "Commercial",
};

async function fixCategories() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    
    const projects = await mongoose.connection.db
      .collection('projects')
      .find({})
      .toArray();
    
    let fixed = 0;
    
    for (const project of projects) {
      const correctCategory = categoryFixes[project.category];
      if (correctCategory && correctCategory !== project.category) {
        await mongoose.connection.db
          .collection('projects')
          .updateOne(
            { _id: project._id },
            { $set: { category: correctCategory } }
          );
        
        console.log(`✅ Fixed: "${project.title}" → ${project.category} → ${correctCategory}`);
        fixed++;
      }
    }
    
    console.log(fixed ? `\n🎉 Fixed ${fixed} projects!` : "\n✨ All categories correct!");
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

fixCategories();
