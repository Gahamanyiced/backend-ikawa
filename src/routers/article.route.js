import express from 'express';
import articleController from '../controllers/article.controller.js';
import { getArticleById } from '../middlewares/article.middleware.js';
import { protect, authorize } from '..//middlewares/auth.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('user'), articleController.getAllArticles)
  .post(protect, authorize('user'), articleController.createArticle);
router
  .route('/:id')
  .get(protect, authorize('user'), getArticleById, articleController.getArticle)
  .patch(
    protect,
    authorize('user'),
    getArticleById,
    articleController.updateArticle
  )
  .delete(
    protect,
    authorize('user'),
    getArticleById,
    articleController.deleteArticle
  );
router
  .route('/:id/photo')
  .patch(
    protect,
    authorize('user'),
    getArticleById,
    articleController.articlePhotoUpload
  );

export default router;
