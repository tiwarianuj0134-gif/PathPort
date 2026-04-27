const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },
    linkUrl: { type: String, default: '' },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    visibility: { type: String, enum: ['public', 'connections', 'private'], default: 'public' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
