import express from 'express';
import eventController from '../controllers/event.controller.js';
import { getEventById } from '../middlewares/event.middleware.js';
import { protect, authorize } from '..//middlewares/auth.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('user'), eventController.getAllEvents)
  .post(protect, authorize('user'), eventController.createEvent);
router
  .route('/:id')
  .get(protect, authorize('user'), getEventById, eventController.getEvent)
  .patch(
    protect,
    authorize('user'),
    getEventById,
    eventController.updateEvent
  )
  .delete(
    protect,
    authorize('user'),
    getEventById,
    eventController.deleteEvent
  );
  router.route('/:id/photo').patch(protect,authorize('user'),getEventById,eventController.eventPhotoUpload)

export default router;
