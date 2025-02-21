import crypto from 'crypto';
export function generateRandomPassword(length = 12) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }
  