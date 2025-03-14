const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "KFC";

module.exports = {
    users: async () => {
        return await prisma.user.findMany();
    },
    currentUser: async (_, req) => {
        console.log(_)
        try {
            const token = req.cookies.authToken;

            if (!token) {
                throw new Error("Not authenticated");
            }

            const decoded = jwt.verify(token, SECRET_KEY);
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

            if (!user) {
                throw new Error("User not found");
            }

            return user;
        } catch (error) {
            console.error("Error fetching current user:", error.message);
            return null;
        }
    },

    register: async ({ username, email, password }, { res }) => {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            throw new Error("Email already registered.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const rememberToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: "30d" });

        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword, remember_token: rememberToken},
        });

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });

        res.cookie("authToken", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        return { user };
    },

    login: async ({ email, password }, { res }) => {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new Error("User not found.");
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error("Invalid password.");
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });

        res.cookie("authToken", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        return { user };
    }
};