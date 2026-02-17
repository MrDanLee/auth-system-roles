const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateRole, deactivateUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('admin'), getUsers);
router.get('/:id', authenticate, getUser);
router.put('/:id/role', authenticate, authorize('admin'), updateRole);
router.delete('/:id', authenticate, authorize('admin'), deactivateUser);

module.exports = router;