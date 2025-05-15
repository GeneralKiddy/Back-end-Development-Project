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