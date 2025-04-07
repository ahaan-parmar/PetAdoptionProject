const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References a user with 'shelter' role
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  applicationDetails: {
    residenceType: {
      type: String,
      enum: ['House', 'Apartment', 'Condo', 'Other'],
      required: true
    },
    hasChildren: {
      type: Boolean,
      required: true
    },
    hasOtherPets: {
      type: Boolean,
      required: true
    },
    otherPetDetails: String,
    workSchedule: String,
    reasonForAdopting: {
      type: String,
      required: true
    },
    additionalInfo: String
  },
  // Track approval/rejection
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Shelter staff member
  },
  reviewDate: Date,
  reviewNotes: String,
  // For completed adoptions
  adoptionDate: Date,
  successStory: {
    title: String,
    description: String,
    images: [String],
    isPublished: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

const Adoption = mongoose.model('Adoption', adoptionSchema);

module.exports = Adoption; 