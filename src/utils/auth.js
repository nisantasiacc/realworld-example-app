import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


async function hashPassword(password) {
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw err;
    }
}

async function verifyPassword(password, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch
    } catch (err) {
        console.error('Error comparing password:', err);
        throw err;
    }
}

function generateJWT(user) {
    const payload = {
        id: user.id,
        username: user.username,
    }

    const secretKey = process.env.JWT_SECRET;
    const option = {
        expiresIn: '1h',
    };
    return jwt.sign(payload, secretKey, option);
}

export { hashPassword, verifyPassword, generateJWT };