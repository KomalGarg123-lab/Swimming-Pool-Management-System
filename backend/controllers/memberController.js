const FamilyMember = require('../models/FamilyMember');
const User = require('../models/User');

// Standard response
const sendRes = (res, success, message, data = {}) => {
  res.json({ success, message, data });
};

// POST /api/members - Add family member (with photo upload)
exports.addMember = async (req, res) => {
  try {
    const { name, dob, gender } = req.body;
    if (!name || !dob || !gender || !req.file) return sendRes(res, false, 'All fields required');
    // Build full URL for photo
    const photo = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
    const member = await FamilyMember.create({
      userId: req.user.id,
      name,
      dob,
      gender,
      photo
    });
    // Add to user's familyMembers array
    await User.findByIdAndUpdate(req.user.id, { $push: { familyMembers: member._id } });
    sendRes(res, true, 'Family member added', { member });
  } catch (err) {
    sendRes(res, false, 'Add member failed', { error: err.message });
  }
};

// GET /api/members - List family members
exports.getMembers = async (req, res) => {
  try {
    const members = await FamilyMember.find({ userId: req.user.id });
    sendRes(res, true, 'Family members fetched', { members });
  } catch (err) {
    sendRes(res, false, 'Fetch members failed', { error: err.message });
  }
};
