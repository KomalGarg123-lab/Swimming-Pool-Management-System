const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  photo: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('FamilyMember', familyMemberSchema);
