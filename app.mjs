import express from "express";
import bookRouter from "./routes/book.routes.mjs";
import authRouter from "./routes/auth.routes.mjs";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

async function init() {
  const app = express();
  const port = process.env.PORT || 4002;

  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Book API",
        version: "1.0.0",
        description: "RESTful API",
      },
servers: [
        { url: "https://your-render-url.onrender.com" }, // เปลี่ยนหลัง deploy
      ],
    },
    apis: ["./routes/*.mjs"],
  };

  const specs = swaggerJsdoc(options);

  app.use(express.json());
  app.use("/books", bookRouter);
  app.use("/auth", authRouter);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });
}

init();