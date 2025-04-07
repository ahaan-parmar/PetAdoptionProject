const Pet = require('../models/Pet');
const Adoption = require('../models/Adoption');
const User = require('../models/User');

/**
 * Database aggregation utilities for generating reports and statistics
 */
const dbAggregations = {
  /**
   * Get adoption statistics by pet category
   * @returns {Promise<Array>} Aggregated statistics
   */
  async getAdoptionsByCategory() {
    try {
      const result = await Pet.aggregate([
        // Look up adoptions for each pet
        {
          $lookup: {
            from: 'adoptions',
            localField: '_id',
            foreignField: 'pet',
            as: 'adoptionRecords'
          }
        },
        // Filter to only get pets with adoptions
        {
          $match: {
            'adoptionRecords.0': { $exists: true }
          }
        },
        // Group by category and count
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            averageAge: { 
              $avg: { 
                $cond: [
                  { $eq: [{ $substr: ['$age', -5, 5] }, 'years'] },
                  { $toInt: { $substr: ['$age', 0, 1] } },
                  { $divide: [{ $toInt: { $substr: ['$age', 0, 1] } }, 12] }
                ]
              }
            },
            pets: { $push: { name: '$name', breed: '$breed', status: '$adoptionStatus' } }
          }
        },
        // Format the output
        {
          $project: {
            _id: 0,
            category: '$_id',
            count: 1,
            averageAge: { $round: ['$averageAge', 1] },
            pets: { $slice: ['$pets', 5] }  // Limit to first 5 pets
          }
        },
        // Sort by count descending
        { $sort: { count: -1 } }
      ]);
      
      return result;
    } catch (error) {
      console.error('Error in adoption by category aggregation:', error);
      throw error;
    }
  },

  /**
   * Get adoption timeline statistics (monthly adoptions)
   * @returns {Promise<Array>} Monthly adoption statistics
   */
  async getAdoptionTimeline(months = 6) {
    try {
      const result = await Adoption.aggregate([
        // Only include approved adoptions
        {
          $match: {
            status: 'Approved'
          }
        },
        // Project date parts
        {
          $project: {
            year: { $year: '$approvalDate' },
            month: { $month: '$approvalDate' },
            pet: 1,
            user: 1
          }
        },
        // Group by year and month
        {
          $group: {
            _id: { year: '$year', month: '$month' },
            count: { $sum: 1 }
          }
        },
        // Format the output
        {
          $project: {
            _id: 0,
            year: '$_id.year',
            month: '$_id.month',
            count: 1,
            monthName: {
              $let: {
                vars: {
                  monthsInYear: [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ]
                },
                in: { $arrayElemAt: ['$$monthsInYear', { $subtract: ['$_id.month', 1] }] }
              }
            },
            dateLabel: {
              $concat: [
                { $toString: '$_id.month' },
                '/',
                { $toString: '$_id.year' }
              ]
            }
          }
        },
        // Sort by date
        { $sort: { year: -1, month: -1 } },
        // Limit to requested number of months
        { $limit: months }
      ]);
      
      return result.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error in adoption timeline aggregation:', error);
      throw error;
    }
  },

  /**
   * Get shelter statistics
   * @returns {Promise<Array>} Shelter statistics
   */
  async getShelterStatistics() {
    try {
      const result = await User.aggregate([
        // Only include shelter users
        {
          $match: {
            role: 'shelter'
          }
        },
        // Lookup pets from each shelter
        {
          $lookup: {
            from: 'pets',
            localField: '_id',
            foreignField: 'shelter',
            as: 'pets'
          }
        },
        // Calculate statistics
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            contact: 1,
            address: 1,
            totalPets: { $size: '$pets' },
            availablePets: {
              $size: {
                $filter: {
                  input: '$pets',
                  as: 'pet',
                  cond: { $eq: ['$$pet.adoptionStatus', 'Available'] }
                }
              }
            },
            pendingPets: {
              $size: {
                $filter: {
                  input: '$pets',
                  as: 'pet',
                  cond: { $eq: ['$$pet.adoptionStatus', 'Pending'] }
                }
              }
            },
            adoptedPets: {
              $size: {
                $filter: {
                  input: '$pets',
                  as: 'pet',
                  cond: { $eq: ['$$pet.adoptionStatus', 'Adopted'] }
                }
              }
            }
          }
        },
        // Sort by total pets descending
        { $sort: { totalPets: -1 } }
      ]);
      
      return result;
    } catch (error) {
      console.error('Error in shelter statistics aggregation:', error);
      throw error;
    }
  },

  /**
   * Search pets with advanced filtering and sorting
   * @param {Object} query Search parameters
   * @returns {Promise<Array>} Matching pets
   */
  async searchPets(query) {
    try {
      const {
        searchTerm,
        category,
        minAge,
        maxAge,
        gender,
        size,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        limit = 20,
        page = 1
      } = query;
      
      const skip = (page - 1) * limit;
      
      // Build match conditions
      const matchConditions = {};
      
      if (searchTerm) {
        matchConditions.$text = { $search: searchTerm };
      }
      
      if (category) {
        matchConditions.category = category;
      }
      
      if (gender) {
        matchConditions.gender = gender;
      }
      
      if (size) {
        matchConditions.size = size;
      }
      
      if (status) {
        matchConditions.adoptionStatus = status;
      }
      
      // Age filtering requires special handling since it's stored as a string
      // This is a simplified approach assuming age is stored as "X years" or "X months"
      
      const pipeline = [
        // Match basic conditions
        { $match: matchConditions },
        
        // Sort
        { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
        
        // Pagination
        { $skip: skip },
        { $limit: Number(limit) },
        
        // Lookup shelter information
        {
          $lookup: {
            from: 'users',
            localField: 'shelter',
            foreignField: '_id',
            as: 'shelterInfo'
          }
        },
        
        // Reshape the output
        {
          $project: {
            name: 1,
            breed: 1,
            age: 1,
            gender: 1,
            description: 1,
            image: 1,
            category: 1,
            size: 1,
            adoptionStatus: 1,
            createdAt: 1,
            'shelterInfo.name': 1,
            'shelterInfo.contact': 1
          }
        }
      ];
      
      const result = await Pet.aggregate(pipeline);
      
      return result;
    } catch (error) {
      console.error('Error in advanced pet search:', error);
      throw error;
    }
  }
};

module.exports = dbAggregations; 