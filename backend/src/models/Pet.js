const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  breed: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'other']
  },
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large', 'Extra Large']
  },
  adoptionStatus: {
    type: String,
    required: true,
    enum: ['Available', 'Pending', 'Adopted'],
    default: 'Available'
  },
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add text indexing for search functionality
petSchema.index({ 
  name: 'text', 
  breed: 'text', 
  description: 'text',
  category: 'text'
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet; 