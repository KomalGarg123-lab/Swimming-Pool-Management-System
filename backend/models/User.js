const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user'], default: 'user' },
  familyMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FamilyMember' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
