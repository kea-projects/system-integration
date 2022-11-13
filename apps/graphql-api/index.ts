import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";
import schema from "./src/schema/schema";
import connectDB from "./src/config/db";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

// Connect to database
connectDB();

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(port, console.log(`Server running on port ${port}`));
