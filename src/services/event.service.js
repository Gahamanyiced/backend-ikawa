import Event from '../database/models/Event.js'

export const getEvents = async () => {
  const events = await Event.find({ is_active: true });
  return events;
};
export const addEvent = async (event) => {
  return await Event.create(event);
};
export const updateEventService = async (update, event) => {
  const updateEvent = await Event.findByIdAndUpdate(event, update, {
    new: true,
  });

  return updateEvent;
};
export const deleteEventService = async (event) => {
  
  const deleteEvent = await Event.findByIdAndUpdate(event, {
    new: true,
    is_active: false,
  });

  return deleteEvent;
};
