/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - user_id
 *         - title
 *         - author
 *         - publisher
 *       properties:
 *         user_id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         title:
 *           type: string
 *           description: The title of the book
 *         author:
 *           type: string
 *           description: The author of the book 
 *         publisher:
 *           type: string
 *           description: The publisher of the book
 *       example:
 *         user_id: 1
 *         title: My book
 *         author: Sam Smith
 *         publisher: New York Times
 * tags:
 *   name: Books
 *   description: The book managing API
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Created book successfully
 *       400:
 *         description: Please specify User ID, Title, Author, or Publisher
 *       500:
 *         description: Server could not create book because of internal server error
 *   get:
 *     summary: List all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *          application/json:
 *            schema:
 *             type: array
 *             items:
 *              type: object
 *              properties:
 *                book_id:
 *                  type: integer
 *                  description: The book id
 *                title:
 *                  type: string
 *                  description: The title of the book
 *                author:
 *                  type: string
 *                  description: The author of the book 
 *                publisher:
 *                  type: string
 *                  description: The publisher of the book
 *                created_at:
 *                  type: string
 *                  format: date-time
 *                  description: The date and time that the book is created in the user's account
 *                updated_at:
 *                  type: string
 *                  format: date-time
 *                  description: The date and time that the book is updated most recently in the user's account
 *       500:
 *         description: Server could not read book because of internal server error
 * /books/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: book_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book responded by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                book_id:
 *                  type: integer
 *                  description: The book id
 *                  example: 11
 *                title:
 *                  type: string
 *                  description: The title of the book
 *                  example: A Night to Remember
 *                author:
 *                  type: string
 *                  description: The author of the book 
 *                  example: Kaylani Kenzie
 *                publisher:
 *                  type: string
 *                  description: The publisher of the book
 *                  example: Macmillan Publishers
 *                created_at:
 *                  type: string
 *                  format: date-time
 *                  description: The date and time that the book is created in the user's account
 *                  example: 2025-05-15 12:29:49.893+07
 *                updated_at:
 *                  type: string
 *                  format: date-time
 *                  description: The date and time that the book is updated most recently in the user's account
 *                  example: 2025-05-16 15:39:46.031+07
 *       500:
 *         description: Server could not read book because of internal server error
 *   put:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: book_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: false
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: The title of the book
 *                example: Lickety Split
 *              author:
 *                type: string
 *                description: The author of the book 
 *                example: Winifred Graham
 *              publisher:
 *                type: string
 *                description: The publisher of the book
 *                example: Scholastic 
 *    responses:
 *      200:
 *        description: Updated book successfully
 *      500:
 *        description: Server could not update book because of internal server error
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: book_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: Deleted book successfully
 *       500:
 *         description: Server could not delete book because of internal server error
 */
import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreateBookData } from "../middlewares/book.validation.mjs";
import { protect } from "../middlewares/protect.mjs";

const bookRouter = Router();

bookRouter.use(protect);

bookRouter.post("/", [validateCreateBookData], async (req, res) => {
    try {
        const newbook = {
            ...req.body,
            created_at: new Date(),
            updated_at: new Date(),
        };
        await connectionPool.query(
            `insert into books (user_id, title, author, publisher, created_at, updated_at)
            values ($1, $2, $3, $4, $5, $6)`, 
            [
                newbook.user_id,
                newbook.title,
                newbook.author,
                newbook.publisher,
                newbook.created_at,
                newbook.updated_at,
            ]
        );
        return res.status(201).json({ message: "Created book successfully" })
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
    return res.status(200).json({ message: "Updated book successfully" })
  }
  catch { res.status(500).json({ message: "Server could not update book because of internal server error" }) }
});

bookRouter.delete("/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    await connectionPool.query(
      `delete from books where book_id = $1`, [bookId]
    );
    return res.status(200).json({ message: "Deleted book successfully" })
  }
  catch { res.status(500).json({ message: "Server could not delete book because of internal server error" }) }
});

export default bookRouter;