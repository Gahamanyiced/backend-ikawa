import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  name: String,
  details: String,
  date: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  picture: String,
  is_active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Event', EventSchema);
