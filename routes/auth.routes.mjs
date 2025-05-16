/**
 * @swagger
 * tags:
 *  name: Users
 *  description: The user managing API
 * /auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: the username of the user's account
 *               password:
 *                 type: string
 *                 description: the password of the user's account
 *               firstName:
 *                 type: string
 *                 description: the first name of the user
 *               lastName:
 *                 type: string
 *                 description: the last name of the user
 *     responses:
 *       201:
 *        description: User has been created successfully
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                  type: string
 *                  example: User has been created successfully
 *                userId:
 *                  type: integer
 *                  description: The auto-generated id of the user
 *       400:
 *         description: Username, Password, First Name, or Last Name is required
 *       500:
 *         description: Server could not create user because of internal server error
 * /auth/login:
 *   post:
 *     summary: Log in the user's account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: the username of the user's account
 *               password:
 *                 type: string
 *                 description: the password of the user's account
 *     responses:
 *      200:
 *          description: login successfully
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: login successfully
 *                          token:
 *                              type: string
 *                              description: The code that enables authorized access to a computer system
 *      400:
 *         description: Username and password are required
 *      500:
 *         description: Internal server error
*/
import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateLoginData, validateRegisterData } from "../middlewares/auth.validation.mjs";

const authRouter = Router();

authRouter.post("/register", [validateRegisterData], async (req, res) => {
    try {
        const user = {
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const result = await connectionPool.query(
            `insert into users (username, password, firstname, lastname)
            values ($1, $2, $3, $4) returning user_id`,
            [
                user.username, 
                user.password, 
                user.firstName, 
                user.lastName,
            ]
        );
        return res.status(201).json({ 
            message: "User has been created successfully",
            userId: result.rows[0].user_id
         });
    }
    catch { res.status(500).json({ message: "Server could not create user because of internal server error" }) }
    });

authRouter.post("/login", [validateLoginData], async (req, res) => {
    try{
        const { username, password } = req.body;
        
        const result = await connectionPool.query(
            `select * from users where username = $1`, [username]
        );
        const user = result.rows[0];
        if (!user) { return res.status(404).json({ message: "user not found" }) };

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) { return res.status(401).json({ message: "Invalid password" }) };

        const token = jwt.sign(
            {
                id: user.user_id,
                firstName: user.firstName,
                lastName: user.lastName
            },
            process.env.SECRET_KEY,
            { expiresIn: '900000' }
        );

        return res.status(200).json({
            message: "login successfully",
            token: token
        });
    }
    catch { res.status(500).json({ message: "Internal server error" }) }
});

export default authRouter;