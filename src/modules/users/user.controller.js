import prisma from '../../config/db.js';
import { hashPassword, generateJWT } from '../../utils/auth.js';

export async function registerUser(req, res) {
    try {
        if (!req.body.user) {
            return res.status(422).json({error: "User data is required"});
        }

        const {username, email, password, bio, image} = req.body.user;
        if (!username || !email || !password) {
            return res.status(422).json({error: "Username, email, and password are required"});
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                bio,
                image,
            },
        });

        const token = generateJWT(newUser);
        const userResponse = {
            user: {
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio || null,
                image: newUser.image || null,
                token: token,
            }
        }

        return res.status(201).json(userResponse);

    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(422).json({error: "User with this email or username already exists"});
        }
        return res.status(500).json({error: err.message});
    }
}