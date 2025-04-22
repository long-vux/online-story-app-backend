// repositories/CommentRepository.js
const Comment = require('../models/Comment');
const Story = require('../models/Story');

class CommentRepository {
    // Tạo mới một bình luận
    async createComment(storyId, userId, content) {
        const comment = new Comment({
            storyId,
            userId,
            content,
        });

        await comment.save();

        // Cập nhật bình luận vào truyện
        const story = await Story.findById(storyId);
        if (story) {
            story.comments.push(comment._id);
            await story.save();
        }

        // Trả về bình luận đã được thêm vào
        return comment;
    }

    // Cập nhật bình luận theo ID
    async updateComment(commentId, content) {
        const comment = await Comment.findById(commentId);
        if (!comment) return null;

        comment.content = content;
        await comment.save();
        return comment;
    }

    // Xóa bình luận theo ID
    async deleteComment(commentId, storyId) {
        const comment = await Comment.findById(commentId);
        if (!comment) return null;

        await Comment.findByIdAndDelete(commentId);

        // Xóa bình luận khỏi truyện
        await Story.findByIdAndUpdate(storyId, {
            $pull: { comments: commentId },
        });

        return true;
    }

    // Lấy bình luận và populate thông tin người dùng
    async getPopulatedComment(commentId) {
        return await Comment.findById(commentId).populate('userId', 'username');
    }
}

module.exports = new CommentRepository();
