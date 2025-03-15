import Job from '../../models/jobPostings.js'
import { getRedisClient, isRedisCachingEnabled } from '../../index.js'

// Cache TTL in seconds
const CACHE_TTL = 60 * 5; // 5 minutes

const getJobs = async (req, res) => {
    try {
        // Generate a cache key - could include query parameters if needed
        const cacheKey = 'all_jobs'
        
        // Check if Redis caching is enabled
        if (isRedisCachingEnabled()) {
            const redisClient = getRedisClient()
            
            try {
                // Try to get data from cache
                const cachedData = await redisClient.get(cacheKey)
                
                if (cachedData) {
                    console.log('Cache hit for', cacheKey)
                    return res.status(200).json({ 
                        success: true, 
                        data: JSON.parse(cachedData),
                        fromCache: true
                    })
                }
                
                console.log('Cache miss for', cacheKey)
            } catch (cacheError) {
                console.error('Redis cache error:', cacheError)
                // Continue to database query on cache error
            }
        }
        
        // If cache is disabled, cache miss, or cache error, fetch from database
        const job = await Job.find()
        
        // If Redis is enabled, store the result in cache
        if (isRedisCachingEnabled()) {
            const redisClient = getRedisClient()
            try {
                await redisClient.set(
                    cacheKey, 
                    JSON.stringify(job), 
                    'EX', 
                    CACHE_TTL
                )
                console.log('Cached data for', cacheKey)
            } catch (cacheError) {
                console.error('Failed to cache data:', cacheError)
                // Continue even if caching fails
            }
        }
        
        res.status(200).json({ success: true, data: job })
    } catch (error) {
        console.error('Error in getJobs controller:', error)
        res.status(404).json({ message: error.message })
    }
}

export {getJobs};