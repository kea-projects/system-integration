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

app.use("/test", async (req, res) => {
    const data = await database.all("SELECT * FROM Products;", function(err, rows) {  
        if(err){
            reject([]);
        }
        resolve(rows);
    });
    res.send(data)
});

app.use("testThree", async (req, res) => {
    const result = await database.run(req.body['query']);
    res(result);
})

app.use("/testTwo", async (req, res) => {
    const result = await database.run(`UPDATE Products SET product_name = "updated", product_sub_title = "updated", product_description = "updated", main_category = "updated", sub_category = "updated", price = "2", link = "updated", overall_rating = "updated" WHERE product_id = 1;`);
    res.send(result);
})

app.use("/graphql", graphqlHTTP({ schema: schema, graphiql: true}));

app.listen(5500, () => {
    console.log("GraphQL server running at http://localhost:5500.");
});