import prisma from '../../config/db.js';
import { hashPassword, generateJWT, verifyPassword } from '../../utils/auth.js';

// Export functions at the end!
async function registerUser(req, res) {
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
                bio: newUser.bio,
                image: newUser.image,
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

async function loginUser(req, res) {
    try {
        if (!req.body.user) {
            return res.status(422).json({error: "User data is required"});
        }

        const {email, password} = req.body.user;
        const user = await prisma.user.findUnique({where: {email}});
        if (!user) {
            return res.status(401).json({error: "Invalid email or password"});
        }

        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({error: "Invalid email or password"});
        }

        const userResponse = {
            email,
            token: generateJWT(user),
            username: user.username,
            bio: user.bio,
            image: user.image,
        }

        return res.status(200).json({user: userResponse});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
}

export { registerUser, loginUser };