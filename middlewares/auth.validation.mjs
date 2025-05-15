export const validateRegisterData = (req, res, next) => {
    if (!req.body.username) { return res.status(400).json({ message: "Username is required" }) }
    if (!req.body.password) { return res.status(400).json({ message: "Password is required" }) }
    if (!req.body.firstName) { return res.status(400).json({ message: "First Name is required" }) }
    if (!req.body.lastName) { return res.status(400).json({ message: "Last Name is required" }) } 

    next ()
};

export const validateLoginData = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) { return res.status(400).json({ message: "Username and password are required" }) }

    next ()
};
