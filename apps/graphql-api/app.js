import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { initDatabase, addDataToDatabase, dropAllTables } from './databaseSetup.js'
import { schema } from './schema.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const database = await open({ filename: 'database.db', driver: sqlite3.Database });

const app = express();

// dropAllTables();
initDatabase();
// addDataToDatabase();

app.use("/graphql", graphqlHTTP({ schema: schema, graphiql: true}));

app.listen(5500, () => {
    console.log("GraphQL server running at http://localhost:5500.");
});