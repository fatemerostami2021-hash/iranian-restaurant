import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  position: { 
    type: String, 
    required: true
  },
  experience: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'rejected', 'hired'], 
    default: 'pending' 
  }
}, { timestamps: true });

export default mongoose.model('JobApplication', jobApplicationSchema);
