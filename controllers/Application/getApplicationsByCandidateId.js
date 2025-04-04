import applicationCollection from '../../models/applicationCollection.js';
import mongoose from 'mongoose';
import jobPostings from '../../models/jobPostings.js';
import { getRedisClient, isRedisCachingEnabled } from '../../index.js';

// Cache TTL in seconds
const CACHE_TTL = 60 * 5; // 5 minutes

const getApplicationsByCandidateId = async (req, res) => {
    const { candidateId } = req.params;  // Extract candidateId from request body

    try {
        
        // Generate a cache key
        const cacheKey = `applications:candidate:${candidateId}`;
        
        // Check if Redis caching is enabled
        if (isRedisCachingEnabled()) {
            const redisClient = getRedisClient();
            
            try {
                // Try to get data from cache
                const cachedData = await redisClient.get(cacheKey);
                
                if (cachedData) {
                    console.log('Cache hit for', cacheKey);
                    return res.status(200).json({
                        success: true,
                        message: 'Applications retrieved successfully!',
                        applications: JSON.parse(cachedData),
                        fromCache: true
                    });
                }
                
                console.log('Cache miss for', cacheKey);
            } catch (cacheError) {
                console.error('Redis cache error:', cacheError);
                // Continue to database query on cache error
            }
        }

        // Find all applications for the given candidateId
        const applications = await applicationCollection.find({ candidateId });

        if (applications.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No applications found for this candidate.',
            });
        }

        // Loop through each application to fetch job details based on jobId
        const applicationsWithJobDetails = [];

        for (const application of applications) {
            const { jobId } = application;  // Extract jobId from application

            // Find the corresponding job from the jobPosting collection
            const job = await jobPostings.findOne({ jobId });
            if (job) {
                // Add job details to the application
                applicationsWithJobDetails.push({
                    ...application.toObject(), // Convert application to plain object
                    job, // Add job details
                });
            } else {
                // If no job found, just add the application (without job details)
                applicationsWithJobDetails.push({
                    ...application.toObject(),
                    job: null, // Indicating no job details found
                });
            }
        }
        
        // If Redis is enabled, store the result in cache
        if (isRedisCachingEnabled()) {
            const redisClient = getRedisClient();
            try {
                await redisClient.set(
                    cacheKey, 
                    JSON.stringify(applicationsWithJobDetails), 
                    'EX', 
                    CACHE_TTL
                );
                console.log('Cached data for', cacheKey);
            } catch (cacheError) {
                console.error('Failed to cache data:', cacheError);
                // Continue even if caching fails
            }
        }

        // Return the merged response with both applications and job details
        res.status(200).json({
            success: true,
            message: 'Applications retrieved successfully!',
            applications: applicationsWithJobDetails,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications.',
            error: error.message,
        });
    }
};

export default getApplicationsByCandidateId;
