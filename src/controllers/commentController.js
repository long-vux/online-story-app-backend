// controllers/CommentController.js
const CommentRepository = require('../repositories/commentRepository');
const StoryRepository = require('../repositories/storyRespository');
const Story = require('../models/Story');

const createComment = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.userId; 

  if (!content) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  try {
    const story = await StoryRepository.findById(req.params.storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const newComment = await CommentRepository.createComment(req.params.storyId, userId, content);

    // Populate user info for the new comment
    const populatedComment = await CommentRepository.getPopulatedComment(newComment._id);

    res.json({ message: 'Comment added', comment: populatedComment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateComment = async (req, res) => {
  const { content } = req.body;

  try {
    const updatedComment = await CommentRepository.updateComment(req.params.commentId, content);
    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment updated', comment: updatedComment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteComment = async (req, res) => {
  try {
    const isDeleted = await CommentRepository.deleteComment(req.params.commentId, req.params.storyId);
    if (!isDeleted) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment
};
