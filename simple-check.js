const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const docs = await mongoose.connection.db
      .collection('projects')
      .distinct('category');
    console.log('Categories in DB:', docs);
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
