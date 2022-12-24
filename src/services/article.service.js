import Article from '../database/models/Article.js';

export const getArticles = async () => {
  const articles = await Article.find({ is_active: true });
  return articles;
};
export const addArticle = async (article) => {
  return await Article.create(article);
};
export const updateArticleService = async (update, article) => {
  const updateArticle = await Article.findByIdAndUpdate(article, update, {
    new: true,
  });

  return updateArticle;
};
export const deleteArticleService = async (article) => {
  const deleteArticle = await Article.findByIdAndUpdate(article, {
    new: true,
    is_active: false,
  });

  return deleteArticle;
};
