import Article from '../database/models/Article.js';
export const getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findOne({
      _id: req.params.id,
      is_active: true,
    });
    if (!article) {
      return res.status(404).json({
        message: 'Article  not found',
      });
    }
    req.article = article;
    next();
  } catch (error) {
    return res.status(404).json({
      message: 'Article not found',
      error: error.message,
    });
  }
};
