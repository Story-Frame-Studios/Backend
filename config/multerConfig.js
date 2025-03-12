import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig.js'; // Import Cloudinary config

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'job_applications', // Folder name in Cloudinary
    resource_type: 'raw', // Accept all file types (including PDFs)
    allowed_formats: ['pdf'], // Ensure only PDFs are uploaded
    public_id: (req, file) => `resume-${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage });

export default upload;
