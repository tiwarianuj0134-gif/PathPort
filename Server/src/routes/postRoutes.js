const express = require('express');
const { getFeed, createPost, deletePost, toggleLike, addComment, getUserPosts } = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/feed', protect, getFeed);
router.get('/user/:userId', getUserPosts);
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);

module.exports = router;
