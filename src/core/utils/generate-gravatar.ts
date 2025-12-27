import { normalizeEmail } from './normalize-email';
import { createHash } from 'crypto';

export function generateGravatar(email: string): string {
  const normalized = normalizeEmail(email);

  return createHash('md5').update(normalized).digest('hex');
}
