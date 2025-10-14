import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto';

const HASH_ALGO = 'sha512';
const ITERATIONS = 200_000; //strong iteration count
const KEY_LENGTH = 64; //output length in bytes
const SALT_LENGTH = 16; //16 bytes = 128 bits

export function hashPassword(password: string): string {
    const salt = randomBytes(SALT_LENGTH).toString('hex'); // generate random salt
    const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, HASH_ALGO).toString('hex');
    // store both salt and hash together, separated by a $
    return `${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
    const [salt, originalHash] = stored.split('$');
    if (!salt || !originalHash) return false;

    const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, HASH_ALGO).toString('hex');

    const hashBuffer = Buffer.from(hash, 'hex');
    const originalBuffer = Buffer.from(originalHash, 'hex');

    if (hashBuffer.length !== originalBuffer.length) return false;

    return timingSafeEqual(hashBuffer, originalBuffer);
}
