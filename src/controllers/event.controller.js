import Event from '../database/models/Event.js';
import {
  getEvents,
  addEvent,
  updateEventService,
  deleteEventService,
} from '../services/event.service.js';
import cloudinary from 'cloudinary';
export class eventControllers {
  async getAllEvents(req, res) {
    try {
      const events = await getEvents();
      return res.status(200).json({
        count: events.length,
        events,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error while getting events',
        error: error.message,
      });
    }
  }
  async getEvent(req, res) {
    try {
      const event = req.event;
      return res.status(200).json({
        event,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error while getting event',
        error: error.message,
      });
    }
  }

  async createEvent(req, res) {
    try {
      const newEvent = await addEvent(req.body);
      return res.status(201).json({
        message: 'New event added',
        newEvent,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Unable to add new event',
        error: error.message,
      });
    }
  }
  async updateEvent(req, res) {
    try {
      const event = req.event;
      await updateEventService(req.body, event.id);
      return res.status(200).json({
        message: 'Event updated successfully',
        event: { id: event.id, ...req.body },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Unable to update an event',
        error: error.message,
      });
    }
  }
  async deleteEvent(req, res) {
    try {
      const event = req.event;
      await deleteEventService(event.id);
      return res.status(200).json({
        message: 'Event Deleted successfully',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Unable to delete an event',
        error: error.message,
      });
    }
  }
  async eventPhotoUpload(req, res) {
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
      await Event.findByIdAndUpdate(req.params.id, {
        picture: results.secure_url,
      });

      res.status(200).json({
        message: 'Document uploaded successfully',
        data: file.name,
      });
    });
  }
}

const eventController = new eventControllers();
export default eventController;
