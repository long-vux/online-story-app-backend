import express from 'express';
import { verifyToken } from '../middleware/auth.js';  // Middleware xác thực user
import Subscription from '../models/Subscription.js';

const router = express.Router();

// Subscribe vào một câu chuyện
router.post('/:storyId/subscribe', verifyToken, async (req, res) => {
  const existingSubscription = await Subscription.findOne({
    user: req.user.id,
    story: req.params.storyId
  });

  if (existingSubscription) {
    return res.status(400).json({ message: "You are already subscribed to this story." });
  }

  // Thêm subscription mới
  const subscription = await Subscription.create({
    user: req.user.id,
    story: req.params.storyId
  });

  res.status(201).json({ message: 'Subscribed successfully!', subscription });
});

// Unsubscribe khỏi câu chuyện
router.delete('/:storyId/subscribe', verifyToken, async (req, res) => {
  const subscription = await Subscription.findOneAndDelete({
    user: req.user.id,
    story: req.params.storyId
  });

  if (!subscription) {
    return res.status(404).json({ message: "You are not subscribed to this story." });
  }

  res.status(204).json({ message: 'Unsubscribed successfully!' });
});

export default router;
