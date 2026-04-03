import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
