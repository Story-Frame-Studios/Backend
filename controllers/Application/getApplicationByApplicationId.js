import applicationCollection from '../../models/applicationCollection.js';
import { getRedisClient, isRedisCachingEnabled } from '../../index.js';

// Cache TTL in seconds
const CACHE_TTL = 60 * 5; // 5 minutes

const getApplicationByApplicationId = async (req, res) => {
    const { applicationId } = req.params;  // Extract applicationId from URL parameters

    try {
        // Generate a cache key
        const cacheKey = `application:${applicationId}`;
        
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
                        application: JSON.parse(cachedData),
                        fromCache: true
                    });
                }
                
                console.log('Cache miss for', cacheKey);
            } catch (cacheError) {
                console.error('Redis cache error:', cacheError);
                // Continue to database query on cache error
            }
        }
        
        // If cache is disabled, cache miss, or cache error, fetch from database
        const application = await applicationCollection.findOne({ applicationId });

        if (!application) {
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
                    JSON.stringify(application), 
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
            application,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications.',
            error: error.message,
        });
    }
};

export default getApplicationByApplicationId;
