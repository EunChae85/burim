
const jwt = require('jsonwebtoken');
const jose = require('jose');

async function test() {
    const secretStr = process.env.ADMIN_SECRET || 'fallback-secret-key';
    const payload = { role: 'admin' };

    // Sign with jsonwebtoken
    const token = jwt.sign(payload, secretStr, { expiresIn: '12h' });
    console.log('Token generated with jsonwebtoken:', token);

    // Verify with jose
    try {
        const secretUint8 = new TextEncoder().encode(secretStr);
        const { payload: verifiedPayload } = await jose.jwtVerify(token, secretUint8);
        console.log('Verified with jose! Payload:', verifiedPayload);
    } catch (err) {
        console.error('Failed to verify with jose:', err.message);
    }
}

test();
