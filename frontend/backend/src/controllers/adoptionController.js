const Adoption = require('../models/Adoption');
const Pet = require('../models/Pet');

// @desc    Submit adoption application
// @route   POST /api/adoptions
// @access  Private
exports.submitApplication = async (req, res) => {
  try {
    // Get pet information
    const pet = await Pet.findById(req.body.pet);
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }
    
    // Check if pet is available for adoption
    if (pet.adoptionStatus !== 'Available') {
      return res.status(400).json({
        success: false,
        error: 'This pet is not available for adoption'
      });
    }
    
    // Check if user already has pending application for this pet
    const existingApplication = await Adoption.findOne({
      pet: req.body.pet,
      user: req.user.id,
      status: 'Pending'
    });
    
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        error: 'You already have a pending application for this pet'
      });
    }
    
    // Create adoption application
    const adoption = await Adoption.create({
      ...req.body,
      user: req.user.id,
      shelter: pet.shelter
    });
    
    // Update pet status to Pending
    await Pet.findByIdAndUpdate(pet._id, { adoptionStatus: 'Pending' });
    
    res.status(201).json({
      success: true,
      data: adoption
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

// @desc    Get all adoption applications for a shelter
// @route   GET /api/adoptions/shelter
// @access  Private (Shelter & Admin Only)
exports.getShelterApplications = async (req, res) => {
  try {
    // Check if user is a shelter or admin
    if (req.user.role !== 'shelter' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access these applications'
      });
    }
    
    const { status, sort = '-createdAt', page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = { shelter: req.user.id };
    if (status) query.status = status;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Find applications
    const applications = await Adoption.find(query)
      .populate('pet', 'name breed age gender image')
      .populate('user', 'name email phone')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);
    
    // Get total count
    const total = await Adoption.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: applications.length,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalResults: total,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all user's adoption applications
// @route   GET /api/adoptions/user
// @access  Private
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Adoption.find({ user: req.user.id })
      .populate('pet', 'name breed age gender image')
      .populate('shelter', 'name shelterInfo');
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single adoption application
// @route   GET /api/adoptions/:id
// @access  Private (Owner, Target Shelter & Admin Only)
exports.getApplication = async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id)
      .populate('pet')
      .populate('user', 'name email phone address')
      .populate('shelter', 'name shelterInfo address phone email');
    
    if (!adoption) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    // Check if user is authorized to view this application
    if (
      adoption.user._id.toString() !== req.user.id &&
      adoption.shelter._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this application'
      });
    }
    
    res.status(200).json({
      success: true,
      data: adoption
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update adoption application status
// @route   PUT /api/adoptions/:id
// @access  Private (Target Shelter & Admin Only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;
    
    let adoption = await Adoption.findById(req.params.id);
    
    if (!adoption) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    // Check if user is authorized to update this application
    if (
      adoption.shelter.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this application'
      });
    }
    
    // Update application status
    adoption = await Adoption.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNotes,
        reviewedBy: req.user.id,
        reviewDate: Date.now()
      },
      { new: true }
    );
    
    // Update pet status if application is approved or rejected
    if (status === 'Approved') {
      await Pet.findByIdAndUpdate(adoption.pet, { adoptionStatus: 'Adopted' });
      
      // Set adoption date
      adoption = await Adoption.findByIdAndUpdate(
        req.params.id,
        { adoptionDate: Date.now() },
        { new: true }
      );
      
      // Reject other pending applications for this pet
      await Adoption.updateMany(
        {
          pet: adoption.pet,
          _id: { $ne: adoption._id },
          status: 'Pending'
        },
        {
          status: 'Rejected',
          reviewNotes: 'Another application for this pet has been approved',
          reviewedBy: req.user.id,
          reviewDate: Date.now()
        }
      );
    } else if (status === 'Rejected') {
      // If this was the last pending application, set pet status back to Available
      const pendingApplications = await Adoption.countDocuments({
        pet: adoption.pet,
        status: 'Pending'
      });
      
      if (pendingApplications === 0) {
        await Pet.findByIdAndUpdate(adoption.pet, { adoptionStatus: 'Available' });
      }
    }
    
    res.status(200).json({
      success: true,
      data: adoption
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Add/Update success story for adoption
// @route   PUT /api/adoptions/:id/success-story
// @access  Private (Adopter Only)
exports.addSuccessStory = async (req, res) => {
  try {
    const { title, description, images, isPublished = false } = req.body;
    
    let adoption = await Adoption.findById(req.params.id);
    
    if (!adoption) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    // Check if user is the adopter
    if (adoption.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Only the adopter can add a success story'
      });
    }
    
    // Check if adoption is completed
    if (adoption.status !== 'Completed') {
      return res.status(400).json({
        success: false,
        error: 'Success story can only be added for completed adoptions'
      });
    }
    
    // Update adoption with success story
    adoption = await Adoption.findByIdAndUpdate(
      req.params.id,
      {
        successStory: {
          title,
          description,
          images,
          isPublished
        }
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: adoption
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get published success stories
// @route   GET /api/adoptions/success-stories
// @access  Public
exports.getSuccessStories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Find adoptions with published success stories
    const stories = await Adoption.find({
      status: 'Completed',
      'successStory.isPublished': true
    })
      .populate('pet', 'name breed age image')
      .populate('user', 'name avatar')
      .populate('shelter', 'name shelterInfo')
      .select('adoptionDate successStory')
      .sort('-adoptionDate')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    // Get total count
    const total = await Adoption.countDocuments({
      status: 'Completed',
      'successStory.isPublished': true
    });
    
    res.status(200).json({
      success: true,
      count: stories.length,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: stories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 