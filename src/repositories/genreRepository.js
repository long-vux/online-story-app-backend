// repositories/GenreRepository.js
const Genre = require('../models/Genre');

class GenreRepository {
  // Find all genres
  async findAll() {
    return Genre.find();
  }

  // Find genre by ID
  async findById(id) {
    return Genre.findById(id);
  }

  // Find genre by name
  async findOne(query) {
    return Genre.findOne(query);
  }

  // Create a new genre
  async create(genreData) {
    const genre = new Genre(genreData);
    return genre.save();
  }

  // Update a genre by ID
  async updateById(id, updateData) {
    return Genre.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Delete a genre by ID
  async deleteById(id) {
    return Genre.findByIdAndDelete(id);
  }
}

module.exports = new GenreRepository();
