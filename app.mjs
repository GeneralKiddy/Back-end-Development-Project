import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4002;

app.use(express.json());

app.post("/books", async (req, res) => {
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
                1,
                newbook.title,
                newbook.author,
                newbook.publisher,
                newbook.created_at,
                newbook.updated_at,
                newbook.published_at,
            ]
        );
        return res.status(201).json({ "message": "Created book sucessfully" })
    }
    catch { res.status(500).json({ "message": "Server could not create book because database connection" }) }
});

app.get("/books", async (req, res) => {
  try {
    const results = await connectionPool.query(`select * from books`);
    return res.status(200).json({ "data": results.rows });
  }
  catch { res.status(500).json({ "message": "Server could not read book because database connection" }) }
});

app.get("/books/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const results = await connectionPool.query(`select * from books where book_id = $1`, [bookId]);
    return res.status(200).json({ "data": results.rows[0] });
  }
  catch { res.status(500).json({ "message": "Server could not read book because database connection" }) }
});

app.put("/books/:bookId", async (req, res) => {
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
    return res.status(200).json({ "message": "Updated book sucessfully" })
  }
  catch { res.status(500).json({ "message": "Server could not update book because database connection" }) }
});

app.delete("/books/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    await connectionPool.query(
      `delete from books where book_id = $1`, [bookId]
    );
    return res.status(200).json({ "message": "Deleted book sucessfully" })
  }
  catch { res.status(500).json({ "message": "Server could not delete book because database connection" }) }
});

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});