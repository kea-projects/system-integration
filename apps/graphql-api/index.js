import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";
import schema from "./src/schema/schema.js";
import db from "./src/config/connection.js";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

// Connect to database
db();

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(port, console.log(`Server running on port ${port}`));
