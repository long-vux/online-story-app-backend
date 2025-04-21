const Story = require("../models/Story");
const Chapter = require("../models/Chapter");
const Comment = require("../models/Comment");
const StoryFactory = require("../factories/StoryFactory");
const fs = require('fs');
const path = require('path');
const publisher = require('../services/publisher');
// 🟢 [POST] /api/stories   ---- (Tạo truyện (Admin only))
const createStory = async (req, res) => {
  try {
    const {
      genre, // string: "Action", "Romance", "Detective", "Horror"
      ...data
    } = req.body;

    // Nếu có thumbnail được upload
    if (req.file) {
      const tmpPath = req.file.path;
      const filename = req.file.filename;

      const destDir = path.join(__dirname, '..', 'uploads', 'thumbnails');
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

      const destPath = path.join(destDir, filename);
      fs.renameSync(tmpPath, destPath);

      // Gán đường dẫn thumbnail cho data
      data.thumbnail = filename;
    }

    // Tạo đối tượng truyện thông qua factory
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
    const story = await Story.findById(id)
    .populate('comments')
    .populate('ratings.userId', 'username')
    .populate({
      path: 'comments',
      populate: {
        path: 'userId',
        select: 'username'
      }
    })
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

// comment and rating
const createRating = async (req, res) => {
  const { rating } = req.body;
  const userId = req.user.userId; // Lấy từ token (authMiddleware)

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const story = await Story.findById(req.params.storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Kiểm tra nếu user đã đánh giá trước đó
    const existingRating = story.ratings.find(r => r.userId.toString() === userId);
    if (existingRating) {
      existingRating.rating = rating; // Cập nhật rating
    } else {
      story.ratings.push({ userId, rating });
    }

    await story.save();
    res.json({ message: 'Rating submitted', averageRating: story.averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

const createComment = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.userId;

  console.log('userid ', userId)

  if (!content) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  try {
    const story = await Story.findById(req.params.storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const comment = new Comment({
      storyId: req.params.storyId,
      userId,
      content,
    });

    await comment.save();
    story.comments.push(comment._id);
    await story.save();

    // Populate user info for the new comment
    const populatedComment = await Comment.findById(comment._id).populate('userId', 'username');
    res.json({ message: 'Comment added', comment: populatedComment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateComment = async (req, res) => {
  const { content } = req.body;

  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.content = content;
    await comment.save();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

const deleteComment = async (req, res) => {
  const userId = req.user.id;

  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    // Xóa comment khỏi story
    await Story.findByIdAndUpdate(req.params.storyId, {
      $pull: { comments: req.params.commentId },
    });

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

// [POST] /api/stories/:storyId/subscribe
const subscribeToStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.userId;

    // Gọi hàm subscribe từ publisher
    await publisher.subscribe(userId, storyId, () => {
      console.log(`User ${userId} subscribed to story ${storyId}`);
    });

    res.status(201).json({ message: 'Subscribed to the story successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while subscribing.', error: error.message });
  }
};

// [DELETE] /api/stories/:storyId/unsubscribe
const unsubscribeFromStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.userId;

    // Gọi hàm unsubscribe từ publisher
    await publisher.unsubscribe(userId, storyId);

    res.status(204).json({ message: 'Unsubscribed from the story successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while unsubscribing.', error: error.message });
  }
};

module.exports = {
  createStory,
  getStories,
  getStoryById,
  updateStory,
  deleteStory,
  getChaptersByStory,
  createRating,
  createComment,
  updateComment,
  deleteComment,
  subscribeToStory,
  unsubscribeFromStory,
};
