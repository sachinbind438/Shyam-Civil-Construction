require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function checkCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const docs = await mongoose.connection.db
      .collection('projects')
      .distinct('category');
    
    console.log('Categories in DB:', docs);
    
    // Also check some sample documents
    const samples = await mongoose.connection.db
      .collection('projects')
      .find({})
      .limit(5)
      .toArray();
    
    console.log('\nSample documents:');
    samples.forEach((doc, i) => {
      console.log(`${i + 1}. title: "${doc.title}", category: "${doc.category}"`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkCategories();
