import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = new sqlite3.Database('./db/chinook.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

export default db;