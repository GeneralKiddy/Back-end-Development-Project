import express from "express";
import bookRouter from "./routes/book.routes.mjs";
import authRouter from "./routes/auth.routes.mjs";
import dotenv from "dotenv";

async function init() {
  dotenv.config();
  const app = express();
  const port = 4002;

  app.use(express.json());
  app.use('/books', bookRouter);
  app.use('/auth', authRouter);

  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

init();