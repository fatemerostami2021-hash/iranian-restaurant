import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB. Dropping old user indexes...');
    try {
      await mongoose.connection.db.collection('users').dropIndexes();
      console.log('✅ All old indexes dropped successfully!');
    } catch (err) {
      console.log('Indexes might have already been dropped or collection is empty.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
