const Story = require('../models/Story');

class StoryRepository {
  async findById(id) {
    return await Story.findById(id);
  }

  async updateById(id, updateData) {
    return await Story.findByIdAndUpdate(id, updateData, { new: true });
  }

  async save(story) {
    return await story.save();
  }
}

module.exports = new StoryRepository();
