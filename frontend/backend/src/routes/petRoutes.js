const express = require('express');
const router = express.Router();
const {
  getPets,
  getPet,
  createPet,
  updatePet,
  deletePet
} = require('../controllers/petController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getPets);
router.get('/:id', getPet);

// Protected routes
router.post('/', protect, authorize('shelter', 'admin'), createPet);
router.put('/:id', protect, authorize('shelter', 'admin'), updatePet);
router.delete('/:id', protect, authorize('shelter', 'admin'), deletePet);

module.exports = router; 