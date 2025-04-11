const Story = require("../models/Story");
const Genre = require("../models/Genre");
const Chapter = require("../models/Chapter");
const StoryFactory = require("../factories/StoryFactory");

// 🟢 [POST] /api/stories   ---- (Tạo truyện (Admin only))
const createStory = async (req, res) => {
  try {
    const {
      genre, // string: "Action", "Romance", "Detective", "Horror"
      ...data 
    } = req.body;

    // Sử dụng StoryFactory để tạo đối tượng truyện
    const storyInstance = StoryFactory.createStory(genre, data);
    const newStory = new Story(storyInstance);
    await newStory.save();

    res.status(201).json({ message: "Truyện đã được tạo thành công!", story: newStory });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 🟢 [GET] /api/stories ----- (Lấy danh sách truyện)
const getStories = async (req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 🟢 [GET] /api/stories/:id ---- (Lấy truyện theo ID)
const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);

    if (!story) return res.status(404).json({ message: "Truyện không tồn tại!" });

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 🟢 [PUT] /api/stories/:id -------- Cập nhật truyện (Admin only)
const updateStory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title, 
      description, 
      author, 
      genre, 
      number_of_chapters, 
      status 
    } = req.body;


    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Truyện không tồn tại!" });

    story.title = title || story.title;
    story.description = description || story.description;
    story.author = author || story.author;
    story.genre = genre || story.genre;
    story.number_of_chapters = number_of_chapters || story.number_of_chapters;
    story.status = status || story.status;

    await story.save();
    res.json({ message: "Cập nhật truyện thành công!", story });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 🟢 [DELETE] /api/stories/:id --------- Xóa truyện (Admin only)
const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Invalid story ID!" });
    }

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Truyện không tồn tại!" });
    }
    
    // Then delete the story
    const deletedStory = await Story.findByIdAndDelete(id);
    if (!deletedStory) {
      return res.status(404).json({ message: "Truyện không tồn tại!" });
    }

    res.json({ message: "Xóa truyện thành công!" });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

const getChaptersByStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: "Truyện không tồn tại!" });
    
    const response = await Chapter.find({ story_id: storyId }).populate('story_id', 'title');    
    
    res.json(response);
  }
  catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
}

module.exports = { createStory, getStories, getStoryById, updateStory, deleteStory, getChaptersByStory };
