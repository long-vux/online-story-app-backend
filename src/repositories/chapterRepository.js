// repositories/ChapterRepository.js
const Chapter = require('../models/Chapter');

class ChapterRepository {
  async findById(id) {
    return Chapter.findById(id);
  }

  async findOne(query) {
    return Chapter.findOne(query);
  }

  async find(query) {
    return Chapter.find(query); // Return the Mongoose query object
  }

  async findSorted(query, sortOptions, limit = null) {
    const queryBuilder = Chapter.find(query).sort(sortOptions);
    if (limit) {
      queryBuilder.limit(limit);
    }
    return queryBuilder.exec(); // Execute the query
  }

  async create(chapter) {
    return chapter.save();
  }

  async update(id, updateData) {
    return Chapter.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return Chapter.findByIdAndDelete(id);
  }

  async countDocuments(query) {
    return Chapter.countDocuments(query);
  }
}

module.exports = new ChapterRepository();
