import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface IProject extends Document {
  title: string;
  slug: string;
  category: string;
  description: string;
  location: string;
  year: number;
  coverImage: string;
  gallery: string[];
  video?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['residential', 'commercial', 'renovation', 'interior', 'exterior', 'other']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be at least 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the distant future']
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required'],
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/res\.cloudinary\.com/.test(v);
      },
      message: 'Cover image must be a valid Cloudinary URL'
    }
  },
  gallery: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/res\.cloudinary\.com/.test(v);
      },
      message: 'Gallery images must be valid Cloudinary URLs'
    }
  }],
  video: {
    type: String,
    validate: {
      validator: function(v: string) {
        if (!v) return true;
        return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|res\.cloudinary\.com)/.test(v);
      },
      message: 'Video must be a valid YouTube or Cloudinary URL'
    }
  }
}, {
  timestamps: true
});

// Generate slug from title before saving
ProjectSchema.pre('save', async function() {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title as string, {
      lower: true,
      strict: true,
      trim: true
    });
    
    // Ensure slug is unique
    const Project = mongoose.model('Project');
    const existingProject = await Project.findOne({ slug: this.slug }) as IProject;
    if (existingProject && existingProject._id.toString() !== this._id.toString()) {
      this.slug = `${this.slug}-${Date.now()}`;
    }
  }
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
