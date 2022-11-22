import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const connectDB = open({
  filename: './data/db.sqlite',
  driver: sqlite3.Database
})

export default connectDB;