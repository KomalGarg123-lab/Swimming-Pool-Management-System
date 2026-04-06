const mongoose = require('mongoose');

const entryLogSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyMember', required: true, index: true },
  scannedAt: { type: Date, default: Date.now },
  scannedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
}, { timestamps: true });

module.exports = mongoose.model('EntryLog', entryLogSchema);
