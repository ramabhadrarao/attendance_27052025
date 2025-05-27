import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance-system';

const fixPasswords = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      // Check if password is already hashed
      if (!user.password.startsWith('$2b$')) {
        console.log(`Fixing password for user: ${user.username}`);
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        await mongoose.connection.db.collection('users').updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        );
        
        console.log(`✅ Fixed password for ${user.username}`);
      } else {
        console.log(`✓ Password already hashed for ${user.username}`);
      }
    }

    console.log('\n🎉 Password fix completed!');
    
  } catch (error) {
    console.error('Error fixing passwords:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

fixPasswords();