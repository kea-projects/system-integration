import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { initDatabase} from './databaseSetup.js'
import { schema } from './schema.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const database = await open({ filename: 'database.db', driver: sqlite3.Database });

const app = express();

initDatabase();

app.use("/test", async (req, res) => {
    const data = await database.all("SELECT * FROM Products;", function(err, rows) {  
        if(err){
            reject([]);
        }
        resolve(rows);
    });
    res.send(data)
});

app.use("testTwo", async (req, res) => {
    
})

app.use("/graphql", graphqlHTTP({ schema: schema, graphiql: true}));

app.listen(5500, () => {
    console.log("GraphQL server running at http://localhost:5500.");
});