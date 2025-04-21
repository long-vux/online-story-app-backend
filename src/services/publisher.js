const Story = require('../models/Story');

// services/publisher.js
class publisher {
  constructor() {
    this.subscribers = new Map(); // Lưu trữ theo storyId: {userId: callback}
    this.io = null; // Socket.IO instance
  }

  setIO(io) {
    this.io = io; // Set the Socket.IO instance
  }

  async subscribe(userId, storyId, callback) {
    const story = await Story.findById(storyId);
    if (!story) throw new Error('Story not found');

    // Kiểm tra nếu user đã subscribe
    if (!story.subscribers.includes(userId)) {
      story.subscribers.push(userId); // Thêm user vào danh sách subscribers
      await story.save();
    }

    // Lưu vào bộ nhớ để push realtime
    if (!this.subscribers.has(storyId)) {
      this.subscribers.set(storyId, new Map());
    }
    this.subscribers.get(storyId).set(userId, callback);
  }

  // Xóa subscriber
  async unsubscribe(userId, storyId) {
    const story = await Story.findById(storyId);
    if (!story) throw new Error('Story not found');

    // Xóa user khỏi danh sách subscribers
    story.subscribers = story.subscribers.filter(subscriber => subscriber.toString() !== userId.toString());
    await story.save();

    if (this.subscribers.has(storyId)) {
      this.subscribers.get(storyId).delete(userId);
    }
  }

  async notify(storyId, savedNotification) {
    try {
      // Lấy thông tin story từ database
      const story = await Story.findById(storyId).select('subscribers');

      if (!story || !story.subscribers || story.subscribers.length === 0) {
        console.log(`No subscribers found for story ${storyId}`);
        return;
      }

      // Gửi thông báo đến tất cả subscribers
      story.subscribers.forEach((userId) => {
        if (this.io) {
          // Emit socket event đến từng subscriber
          this.io.to(userId.toString()).emit('new-chapter', savedNotification);
          console.log(`📢 Notify user ${userId} about new chapter:`, savedNotification);
        } else {
          console.error('Socket.IO instance is not set!');
        }
      });
    } catch (error) {
      console.error('Error in notify:', error);
    }
  }
}

module.exports = new publisher();