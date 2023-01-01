import express from "express";
import { graphqlHTTP } from "express-graphql";
import { initDatabase } from "./database/setup.js";
import { schema } from "./schema.js";
import cors from "cors";
import { reloadOnFileChange } from "./middleware/reloader.js";
import { fixDbPermissions } from "./database/fixPermissions.js";

const app = express();
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));

initDatabase();
fixDbPermissions();

app.use("/graphql", reloadOnFileChange, graphqlHTTP({ schema: schema, graphiql: true }));

app.listen(5500, () => {
  console.log("[INFO]   GraphQL server running at http://localhost:5500.");
});
