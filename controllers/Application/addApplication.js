import applicationCollection from '../../models/applicationCollection.js';
import { v4 as uuidv4 } from 'uuid';
import upload from '../../config/multerConfig.js';
import cloudinary from '../../config/cloudinaryConfig.js'; // Assuming you have cloudinaryConfig for setup

const addApplication = async (req, res) => {
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: 'File upload failed.', error: err.message });
    }

    // Extract data from request
    const { jobId, candidateId, status, notes } = req.body;
    const resumeUrl = req.files['resume'] ? req.files['resume'][0].path : null; // Cloudinary URL
    const coverLetterText = req.body.coverLetter; // Cover letter as text if sent in body
    let coverLetterUrl = null; // Cloudinary URL for cover letter (if it's a file)

    // Handle the cover letter based on whether it's a file or text
    if (req.files['coverLetter']) {
      // If the cover letter is a file, upload to Cloudinary
      try {
        const coverLetterFile = req.files['coverLetter'][0];
        const coverLetterUpload = await cloudinary.uploader.upload(coverLetterFile.path, {
          resource_type: 'raw', // Use raw for non-image files like PDFs
          folder: 'job_applications', // You can specify folder
        });
        coverLetterUrl = coverLetterUpload.secure_url;
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Cover letter file upload failed.', error: error.message });
      }
    } else if (coverLetterText) {
      // If cover letter is in text format, use the text directly
      coverLetterUrl = coverLetterText;
    }

    if (!resumeUrl) {
      return res.status(400).json({ success: false, message: 'Resume upload failed.' });
    }

    try {
      // Check if an application already exists for the same jobId and candidateId
      const existingApplication = await applicationCollection.findOne({ jobId, candidateId });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: 'You have already applied for this job.',
        });
      }

      // Create and save application in MongoDB
      const newApplication = new applicationCollection({
        applicationId: uuidv4(),
        jobId,
        candidateId,
        resume: resumeUrl, // Store Cloudinary URL for resume
        coverLetter: coverLetterUrl, // Store text or Cloudinary URL for cover letter
        status: status || 'received',
        notes: notes || '',
      });

      const savedApplication = await newApplication.save();

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully!',
        application: savedApplication,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to submit application.',
        error: error.message,
      });
    }
  });
};

export default addApplication;
