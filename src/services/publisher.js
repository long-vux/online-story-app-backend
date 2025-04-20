const Subscription = require('../models/Subscription');

// services/publisher.js
class publisher {
  constructor() {
    this.subscribers = new Map(); // Lưu trữ theo storyId: {userId: callback}
  }

  async subscribe(userId, storyId, callback) {
    await Subscription.create({ userId, storyId });

    // Lưu vào bộ nhớ để push realtime
    if (!this.subscribers.has(storyId)) {
      this.subscribers.set(storyId, new Map());
    }
    this.subscribers.get(storyId).set(userId, callback);
  }

  // Xóa subscriber
  async unsubscribe(userId, storyId) {
    await Subscription.deleteOne({ userId, storyId });

    if (this.subscribers.has(storyId)) {
      this.subscribers.get(storyId).delete(userId);
    }
  }

  async notify(storyId, chapter) {
    // Lấy từ database để đảm bảo không bỏ sót subscriber
    const dbSubscribers = await Subscription.find({ storyId });

    // Thông báo đến tất cả subscribers
    dbSubscribers.forEach(sub => {
      if (this.subscribers.has(storyId) &&
        this.subscribers.get(storyId).has(sub.userId)) {
        // Gọi callback nếu user đang online
        this.subscribers.get(storyId).get(sub.userId)(chapter);
      }
      // Có thể tích hợp gửi email/push notification ở đây
    });
  }
}

export default new publisher(); // Singleton pattern