export const validateCreateBookData = (req, res, next) => {
    if (!req.body.user_id) { return res.status(400).json({ message: "Please specify User ID" }) }
    if (!req.body.title) { return res.status(400).json({ message: "Please specify Title" }) }
    if (!req.body.author) { return res.status(400).json({ message: "Please specify Author" }) }
    if (!req.body.publisher) { return res.status(400).json({ message: "Please specify Publisher" }) } 

    next ()
}
