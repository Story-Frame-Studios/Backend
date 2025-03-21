import { getRedisClient, isRedisCachingEnabled } from '../index.js';

/**
 * Invalidates cache keys matching a pattern
 * @param {string} pattern - Redis key pattern to invalidate (e.g., "application:*")
 */
export const invalidateCache = async (pattern) => {
  if (!isRedisCachingEnabled()) {
    return;
  }
  
  try {
    const redisClient = getRedisClient();
    
    // Find all keys matching the pattern
    const keys = await redisClient.keys(pattern);
    
    if (keys.length > 0) {
      // Delete all matching keys
      await redisClient.del(...keys);
      console.log(`Invalidated ${keys.length} cache keys matching pattern: ${pattern}`);
    }
  } catch (error) {
    console.error('Error invalidating cache:', error);
    // Continue even if cache invalidation fails
  }
};

/**
 * Invalidates specific application-related caches
 * @param {string} applicationId - Optional application ID
 * @param {string} candidateId - Optional candidate ID
 * @param {string} jobId - Optional job ID
 */
export const invalidateApplicationCache = async ({ applicationId, candidateId, jobId }) => {
  const patterns = [];
  
  // Add specific patterns based on provided IDs
  if (applicationId) {
    patterns.push(`application:${applicationId}`);
  }
  
  if (candidateId) {
    patterns.push(`applications:candidate:${candidateId}`);
  }
  
  if (jobId) {
    patterns.push(`applications:job:${jobId}`);
  }
  
  // If no specific IDs provided, invalidate all application-related caches
  if (patterns.length === 0) {
    patterns.push('application:*', 'applications:*');
  }
  
  // Invalidate each pattern
  for (const pattern of patterns) {
    await invalidateCache(pattern);
  }
}; 