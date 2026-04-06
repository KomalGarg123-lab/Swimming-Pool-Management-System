require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const User = require('../models/User');
const SubscriptionPlan = require('../models/SubscriptionPlan');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // Admins
  const admins = [
    { username: 'admin1', password: await bcrypt.hash('adminpass1', 10) },
    { username: 'admin2', password: await bcrypt.hash('adminpass2', 10) }
  ];
  await Admin.deleteMany({});
  await Admin.insertMany(admins.map(a => ({ ...a, role: 'admin' })));

  // Subscription Plans
  const plans = [
    { name: 'Monthly', durationDays: 30, pricing: 1000 },
    { name: 'Quarterly', durationDays: 90, pricing: 2500 },
    { name: 'Yearly', durationDays: 365, pricing: 9000 }
  ];
  await SubscriptionPlan.deleteMany({});
  await SubscriptionPlan.insertMany(plans);

  // Demo user
  await User.deleteMany({ email: 'demo@user.com' });
  await User.create({
    name: 'Demo User',
    email: 'demo@user.com',
    password: await bcrypt.hash('demopass', 10),
    role: 'user',
    familyMembers: []
  });

  console.log('Seed data inserted.');
  process.exit();
}

seed().catch(e => { console.error(e); process.exit(1); });
