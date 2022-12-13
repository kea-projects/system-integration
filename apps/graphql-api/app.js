import express from "express";
import { graphqlHTTP } from "express-graphql";
import {
  initDatabase,
  addDataToDatabase,
  dropAllTables,
} from "./databaseSetup.js";
import { schema } from "./schema.js";
import cors from "cors";

const app = express();
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));

// dropAllTables();
initDatabase();
// addDataToDatabase();

app.use("/graphql", graphqlHTTP({ schema: schema, graphiql: true }));

app.listen(5500, () => {
  console.log("GraphQL server running at http://localhost:5500.");
});
