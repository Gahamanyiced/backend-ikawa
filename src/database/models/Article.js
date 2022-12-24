import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: String,
  author: String,
  picture: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: String,
  is_active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Article', ArticleSchema);
// module.exports = { article };
