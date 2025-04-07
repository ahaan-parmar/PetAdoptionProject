const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getShelterApplications,
  getUserApplications,
  getApplication,
  updateApplicationStatus,
  addSuccessStory,
  getSuccessStories
} = require('../controllers/adoptionController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/success-stories', getSuccessStories);

// Protected routes
router.post('/', protect, submitApplication);
router.get('/shelter', protect, authorize('shelter', 'admin'), getShelterApplications);
router.get('/user', protect, getUserApplications);
router.get('/:id', protect, getApplication);
router.put('/:id', protect, authorize('shelter', 'admin'), updateApplicationStatus);
router.put('/:id/success-story', protect, addSuccessStory);

module.exports = router; 