const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const auth = require("../middleware/authMiddleware");

// Apply auth middleware to all routes
router.use(auth);

// Group management routes
router.post('/', groupController.createGroup);
router.get('/', groupController.getUserGroups);
router.get('/:groupId', groupController.getGroupById);
router.put('/:groupId', groupController.updateGroup);
router.delete('/:groupId', groupController.deleteGroup);

// Member management routes
router.post('/:groupId/members', groupController.addMember);
router.delete('/:groupId/members/:memberId', groupController.removeMember);
router.post('/:groupId/leave', groupController.leaveGroup);
router.post('/:groupId/admins', groupController.promoteToAdmin);

module.exports = router;