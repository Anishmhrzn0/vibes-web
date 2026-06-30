// webvibes/scripts/check-user.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { User } from '../app/lib/models/User';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const user = await User.findOne({ email: 'exosamvnepal@gmail.com' });
  console.log(user);
  process.exit(0);
}

run();