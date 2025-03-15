import applicationCollection from '../../models/applicationCollection.js';
import { getRedisClient, isRedisCachingEnabled } from '../../index.js';

// Cache TTL in seconds
const CACHE_TTL = 60 * 5; // 5 minutes

const getApplicationsByJobId = async (req, res) => {
    const { jobId } = req.body;  // Extract jobId from request body

    try {
        // Generate a cache key
        const cacheKey = `applications:job:${jobId}`;
        
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
        
        // Find all applications for the given jobId
        const applications = await applicationCollection.find({ jobId });

        if (applications.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No applications found for this job.',
            });
        }
        
        // If Redis is enabled, store the result in cache
        if (isRedisCachingEnabled()) {
            const redisClient = getRedisClient();
            try {
                await redisClient.set(
                    cacheKey, 
                    JSON.stringify(applications), 
                    'EX', 
                    CACHE_TTL
                );
                console.log('Cached data for', cacheKey);
            } catch (cacheError) {
                console.error('Failed to cache data:', cacheError);
                // Continue even if caching fails
            }
        }

        res.status(200).json({
            success: true,
            message: 'Applications retrieved successfully!',
            applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications.',
            error: error.message,
        });
    }
};

export default getApplicationsByJobId;
