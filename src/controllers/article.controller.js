import Article from '../database/models/Article.js';
import {
  getArticles,
  addArticle,
  updateArticleService,
  deleteArticleService,
} from '../services/article.service.js';
import cloudinary from 'cloudinary';
export class articleControllers {
  async getAllArticles(req, res) {
    try {
      const articles = await getArticles();
      return res.status(200).json({
        count: articles.length,
        articles,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error while getting articles',
        error: error.message,
      });
    }
  }
  async getArticle(req, res) {
    try {
      const article = req.article;
      return res.status(200).json({
        article,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error while getting article',
        error: error.message,
      });
    }
  }

  async createArticle(req, res) {
    try {
      const newArticle = await addArticle(req.body);
      return res.status(201).json({
        message: 'New Article added',
        newArticle,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Unable to add new article',
        error: error.message,
      });
    }
  }
  async updateArticle(req, res) {
    try {
      const article = req.article;
      await updateArticleService(req.body, article.id);
      return res.status(200).json({
        message: 'Article updated successfully',
        article: { id: article.id, ...req.body },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Unable to update an article',
        error: error.message,
      });
    }
  }
  async deleteArticle(req, res) {
    try {
      const article = req.article;
      await deleteArticleService(article.id);
      return res.status(200).json({
        message: 'Article deleted successfully',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Unable to delete an article',
        error: error.message,
      });
    }
  }
  async articlePhotoUpload(req, res) {
    if (!req.files) {
      res.status(400).json({
        message: 'Please upload a file',
      });
    }
    const file = req.files.file;

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      res.status(400).json({
        message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} `,
      });
    }
    cloudinary.uploader.upload(file.tempFilePath, async (results, err) => {
      if (err) {
        return res.status(500).json({
          message: 'Problem with uploading the image',
          error: err,
        });
      }
      await Article.findByIdAndUpdate(req.params.id, {
        picture: results.secure_url,
      });

      res.status(200).json({
        message: 'Document uploaded successfully',
        data: file.name,
      });
    });
  }
}

const articleController = new articleControllers();
export default articleController;
