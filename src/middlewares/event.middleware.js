import Event from '../database/models/Event.js';
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      is_active: true,
    });
    if (!event) {
      return res.status(404).json({
        message: 'Event  not found',
      });
    }
    req.event = event;
    next();
  } catch (error) {
    return res.status(404).json({
      message: 'Event not found',
      error: error.message,
    });
  }
};
