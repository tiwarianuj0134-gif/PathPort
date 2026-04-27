const Post = require('../models/Post');
const Connection = require('../models/Connection');

/** GET /api/posts/feed — posts from connections + own posts */
const getFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Get connected user IDs
    const connections = await Connection.find({
      $or: [{ requesterId: req.user._id }, { recipientId: req.user._id }],
      status: 'accepted',
    });
    const connectedIds = connections.map((c) =>
      c.requesterId.toString() === req.user._id.toString() ? c.recipientId : c.requesterId
    );
    connectedIds.push(req.user._id);

    const posts = await Post.find({
      $or: [
        { userId: { $in: connectedIds }, visibility: { $in: ['public', 'connections'] } },
        { visibility: 'public' },
      ],
    })
      .populate('userId', 'name avatarUrl headline')
      .populate('comments.userId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments({ visibility: 'public' });
    res.json({ posts, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
};

/** POST /api/posts */
const createPost = async (req, res, next) => {
  try {
    const { content, imageUrl, linkUrl, groupId, visibility } = req.body;
    const post = await Post.create({
      userId: req.user._id,
      content, imageUrl, linkUrl, groupId, visibility,
    });
    const populated = await Post.findById(post._id).populate('userId', 'name avatarUrl headline');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/posts/:id */
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, userId: req.user._id });
    if (!post) return res.status(404).json({ message: 'Post not found or not authorized.' });
    await post.deleteOne();
    res.json({ message: 'Post deleted.' });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/posts/:id/like — toggle like */
const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const alreadyLiked = post.likes.includes(req.user._id);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (err) {
    next(err);
  }
};

/** POST /api/posts/:id/comments */
const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    post.comments.push({ userId: req.user._id, content });
    await post.save();
    const updated = await Post.findById(post._id).populate('comments.userId', 'name avatarUrl');
    res.json(updated.comments);
  } catch (err) {
    next(err);
  }
};

/** GET /api/posts/user/:userId */
const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.params.userId, visibility: { $in: ['public', 'connections'] } })
      .populate('userId', 'name avatarUrl headline')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

module.exports = { getFeed, createPost, deletePost, toggleLike, addComment, getUserPosts };
