import { randomBytes } from 'crypto'

export function generateRandomId() {
    const randomId = randomBytes(10).toString('hex');
    return randomId;
}

