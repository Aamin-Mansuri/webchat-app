const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { getDashboardStats, getAllUsersAdmin, deleteUserAdmin } = require('../controllers/adminController');

// All routes require authentication AND Admin role
router.use(isAuthenticated, isAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsersAdmin);
router.delete('/user/:id', deleteUserAdmin);

module.exports = router;