const Group = require('../models/Group');
const User = require('../models/User');
const Message = require('../models/Message');

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Group name is required' });
    }

    // Create new group
    const newGroup = new Group({
      name,
      description,
      creator: userId,
      admins: [userId],
      members: [{ user: userId }]
    });

    await newGroup.save();

    // Populate user data for response
    const group = await Group.findById(newGroup._id)
      .populate('creator', 'name email')
      .populate('admins', 'name email')
      .populate('members.user', 'name email');

    res.status(201).json({
      success: true,
      data: group
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create group'
    });
  }
};

// Get all groups for a user
exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all groups where user is a member
    const groups = await Group.find({
      'members.user': userId
    })
      .populate('creator', 'name email')
      .populate('members.user', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: groups
    });
  } catch (error) {
    console.error('Get user groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve groups'
    });
  }
};

// Get a single group by ID
exports.getGroupById = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id;

    // Find the group
    const group = await Group.findById(groupId)
      .populate('creator', 'name email')
      .populate('admins', 'name email')
      .populate('members.user', 'name email');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if the user is a member of the group
    const isMember = group.members.some(member => 
      member.user._id.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    console.error('Get group by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve group'
    });
  }
};

// Update group information
exports.updateGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id;
    const { name, description } = req.body;

    // Find the group
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if the user is an admin
    const isAdmin = group.admins.some(admin => 
      admin.toString() === userId.toString()
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update group information'
      });
    }

    // Update group information
    if (name) group.name = name;
    if (description !== undefined) group.description = description;

    await group.save();

    // Fetch updated group with populated fields
    const updatedGroup = await Group.findById(groupId)
      .populate('creator', 'name email')
      .populate('admins', 'name email')
      .populate('members.user', 'name email');

    res.status(200).json({
      success: true,
      data: updatedGroup
    });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update group'
    });
  }
};

// Add a member to the group
exports.addMember = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id;
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: 'Member ID is required'
      });
    }

    // Find the group
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if the user is an admin
    const isAdmin = group.admins.some(admin => 
      admin.toString() === userId.toString()
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can add members'
      });
    }

    // Check if the member already exists
    const memberExists = group.members.some(member => 
      member.user.toString() === memberId.toString()
    );

    if (memberExists) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this group'
      });
    }

    // Check if user exists
    const memberUser = await User.findById(memberId);
    if (!memberUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add the member
    group.members.push({ user: memberId });
    await group.save();

    // Fetch updated group with populated fields
    const updatedGroup = await Group.findById(groupId)
      .populate('creator', 'name email')
      .populate('admins', 'name email')
      .populate('members.user', 'name email');

    res.status(200).json({
      success: true,
      data: updatedGroup
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add member'
    });
  }
};

// Remove a member from the group
exports.removeMember = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id;
    const memberId = req.params.memberId;

    // Find the group
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if the user is an admin
    const isAdmin = group.admins.some(admin => 
      admin.toString() === userId.toString()
    );

    if (!isAdmin && userId.toString() !== memberId) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can remove other members'
      });
    }

    // Remove the member
    group.members = group.members.filter(
      member => member.user.toString() !== memberId
    );

    // If removing admin, update admins list
    group.admins = group.admins.filter(
      admin => admin.toString() !== memberId
    );

    await group.save();

    // Fetch updated group with populated fields
    const updatedGroup = await Group.findById(groupId)
      .populate('creator', 'name email')
      .populate('admins', 'name email')
      .populate('members.user', 'name email');

    res.status(200).json({
      success: true,
      data: updatedGroup
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove member'
    });
  }
};

// Leave group
exports.leaveGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id;

    // Find the group
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Remove user from members
    group.members = group.members.filter(
      member => member.user.toString() !== userId.toString()
    );

    // Remove user from admins if they are an admin
    group.admins = group.admins.filter(
      admin => admin.toString() !== userId.toString()
    );

    await group.save();

    res.status(200).json({
      success: true,
      message: 'You have left the group'
    });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave group'
    });
  }
};

// Promote member to admin
exports.promoteToAdmin = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id;
    const { memberId } = req.body;

    // Find the group
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if the user is an admin
    const isAdmin = group.admins.some(admin => 
      admin.toString() === userId.toString()
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can promote members'
      });
    }

    // Check if the member exists
    const memberExists = group.members.some(member => 
      member.user.toString() === memberId
    );

    if (!memberExists) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in this group'
      });
    }

    // Check if already an admin
    const isAlreadyAdmin = group.admins.some(admin => 
      admin.toString() === memberId
    );

    if (isAlreadyAdmin) {
      return res.status(400).json({
        success: false,
        message: 'User is already an admin'
      });
    }

    // Add to admins
    group.admins.push(memberId);
    await group.save();

    // Fetch updated group with populated fields
    const updatedGroup = await Group.findById(groupId)
      .populate('creator', 'name email')
      .populate('admins', 'name email')
      .populate('members.user', 'name email');

    res.status(200).json({
      success: true,
      data: updatedGroup
    });
  } catch (error) {
    console.error('Promote to admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to promote member to admin'
    });
  }
};

// Delete a group
exports.deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id;

    // Find the group
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if the user is the creator
    if (group.creator.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the group creator can delete the group'
      });
    }

    // Delete all messages in the group
    await Message.deleteMany({ groupId });

    // Delete the group
    await Group.findByIdAndDelete(groupId);

    res.status(200).json({
      success: true,
      message: 'Group deleted successfully'
    });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete group'
    });
  }
};