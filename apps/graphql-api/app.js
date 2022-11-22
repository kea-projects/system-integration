import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { initDatabase} from './databaseSetup.js'
import { schema } from './schema.js';

const app = express();

initDatabase();

app.use("/graphql", graphqlHTTP({ schema: schema, graphql: true}));

app.get("/products", )

app.listen(4000, () => {
    console.log("GraphQL server running at http://localhost:4000.");
});