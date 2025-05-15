import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreateBookData } from "../middlewares/book.validation.mjs";

const bookRouter = Router();

bookRouter.post("/", [validateCreateBookData], async (req, res) => {
    try {
        const newbook = {
            ...req.body,
            created_at: new Date(),
            updated_at: new Date(),
            published_at: new Date(),
        };
        await connectionPool.query(
            `insert into books (user_id, title, author, publisher, created_at, updated_at, published_at)
            values ($1, $2, $3, $4, $5, $6, $7)`, 
            [
                newbook.user_id,
                newbook.title,
                newbook.author,
                newbook.publisher,
                newbook.created_at,
                newbook.updated_at,
                newbook.published_at,
            ]
        );
        return res.status(201).json({ message: "Created book sucessfully" })
    }
    catch { res.status(500).json({ message: "Server could not create book because of internal server error" }) }
});

bookRouter.get("/", async (req, res) => {
  try {
    const result = await connectionPool.query(`select * from books`);
    return res.status(200).json({ data: result.rows });
  }
  catch { res.status(500).json({ message: "Server could not read book because of internal server error" }) }
});

bookRouter.get("/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const result = await connectionPool.query(`select * from books where book_id = $1`, [bookId]);
    return res.status(200).json({ data: result.rows[0] });
  }
  catch { res.status(500).json({ message: "Server could not read book because of internal server error" }) }
});

bookRouter.put("/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const updatedbook = { ...req.body, updated_at: new Date() };
    await connectionPool.query(
      `update books set
        title = $2,
        author = $3,
        publisher = $4, 
        updated_at = $5
      where book_id = $1`,
      [
        bookId,
        updatedbook.title,
        updatedbook.author,
        updatedbook.publisher,
        updatedbook.updated_at,
      ]
    );
    return res.status(200).json({ message: "Updated book sucessfully" })
  }
  catch { res.status(500).json({ message: "Server could not update book because of internal server error" }) }
});

bookRouter.delete("/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    await connectionPool.query(
      `delete from books where book_id = $1`, [bookId]
    );
    return res.status(200).json({ message: "Deleted book sucessfully" })
  }
  catch { res.status(500).json({ message: "Server could not delete book because of internal server error" }) }
});

export default bookRouter;