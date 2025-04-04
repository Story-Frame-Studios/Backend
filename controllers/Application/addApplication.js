import applicationCollection from '../../models/applicationCollection.js';
import { v4 as uuidv4 } from 'uuid';
import upload from '../../config/multerConfig.js';
import cloudinary from '../../config/cloudinaryConfig.js';
import users from '../../models/users.js'; // Import the users model
import jobPostings from '../../models/jobPostings.js'; // Import the jobPostings model to fetch job details
import { sendEmail } from '../../service/emailService.js'; // Import the email service

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

      // Fetch candidate details
      const candidate = await users.findOne({ userId: candidateId });
      if (!candidate) {
        return res.status(404).json({ success: false, message: 'Candidate not found.' });
      }

      // Fetch job details to get the employerId
      const job = await jobPostings.findOne({ jobId });
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found.' });
      }

      // Fetch employer details using the employerId from the job posting
      const employer = await users.findOne({ userId: job.employerId });
      if (!employer) {
        return res.status(404).json({ success: false, message: 'Employer not found.' });
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

      // Send email to candidate
      sendEmail(
        candidate.email,
        "Application Submitted Successfully - Story Frame Studio",
        `<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
  Dear ${candidate.firstName},
</p>

<p style="font-family: Arial, sans-serif; color: #555; font-size: 16px;">
  Your application for the job has been successfully submitted. We will review your application and get back to you soon.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
  If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:storyframestudio01@gmail.com" style="color: #28a745;">storyframestudio01@gmail.com</a>.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
  Best regards, <br>
  Story Frame Studio Team
</p>`
      );

      // Send email to employer
      sendEmail(
        employer.email,
        "New Job Application Received - Story Frame Studio",
        `<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
  Dear ${employer.firstName},
</p>

<p style="font-family: Arial, sans-serif; color: #555; font-size: 16px;">
  A new job application has been received from ${candidate.firstName} ${candidate.lastName}. Please review the application at your earliest convenience.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
  If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:storyframestudio01@gmail.com" style="color: #28a745;">storyframestudio01@gmail.com</a>.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
  Best regards, <br>
  Story Frame Studio Team
</p>`
      );

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