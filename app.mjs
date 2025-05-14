import express from "express";
import bookRouter from "./routes/book.routes.mjs";

const app = express();
const port = 4002;

app.use(express.json());
app.use('/books', bookRouter);

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});