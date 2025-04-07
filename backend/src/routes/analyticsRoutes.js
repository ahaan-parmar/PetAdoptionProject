const express = require('express');
const router = express.Router();
const dbAggregations = require('../utils/dbAggregations');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/analytics/adoptions/category
 * @desc    Get adoption statistics by pet category
 * @access  Private (Admin/Shelter)
 */
router.get('/adoptions/category', auth, async (req, res) => {
  try {
    const result = await dbAggregations.getAdoptionsByCategory();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/analytics/adoptions/timeline
 * @desc    Get adoption timeline statistics
 * @access  Private (Admin/Shelter)
 */
router.get('/adoptions/timeline', auth, async (req, res) => {
  try {
    const months = req.query.months ? parseInt(req.query.months) : 6;
    const result = await dbAggregations.getAdoptionTimeline(months);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/analytics/shelters
 * @desc    Get shelter statistics
 * @access  Private (Admin only)
 */
router.get('/shelters', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied. Admin only.' 
      });
    }
    
    const result = await dbAggregations.getShelterStatistics();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/analytics/pets/search
 * @desc    Advanced pet search with aggregation
 * @access  Public
 */
router.get('/pets/search', async (req, res) => {
  try {
    const result = await dbAggregations.searchPets(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 