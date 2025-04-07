const Pet = require('../models/Pet');

// @desc    Get all pets
// @route   GET /api/pets
// @access  Public
exports.getPets = async (req, res) => {
  try {
    const { category, status, search, gender, size, page = 1, limit = 12 } = req.query;
    
    // Build query
    const query = {};
    
    if (category) query.category = category;
    if (status) query.adoptionStatus = status;
    if (gender) query.gender = gender;
    if (size) query.size = size;
    
    // Text search if search query provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Find pets based on the query
    const pets = await Pet.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate('shelter', 'name shelterInfo');
    
    // Get total count of pets matching the query
    const total = await Pet.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: pets.length,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalResults: total,
      data: pets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Public
exports.getPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('shelter', 'name shelterInfo address phone email');
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: pet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private (Shelter & Admin Only)
exports.createPet = async (req, res) => {
  try {
    // Add user (shelter) to req.body
    req.body.shelter = req.user.id;
    
    // Check if user is a shelter or admin
    if (req.user.role !== 'shelter' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only shelters can add pets'
      });
    }
    
    const pet = await Pet.create(req.body);
    
    res.status(201).json({
      success: true,
      data: pet
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private (Owner Shelter & Admin Only)
exports.updatePet = async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }
    
    // Check if user is pet owner (shelter) or admin
    if (pet.shelter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this pet'
      });
    }
    
    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: pet
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private (Owner Shelter & Admin Only)
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }
    
    // Check if user is pet owner (shelter) or admin
    if (pet.shelter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this pet'
      });
    }
    
    await pet.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 