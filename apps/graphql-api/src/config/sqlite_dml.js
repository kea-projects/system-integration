import db from './connection';

db.exec(`
    INSERT INTO skrt (skrt, skrt) 
    VALUES ("skrt", "skrt")
`)

const projects = db.all('SELECT * FROM skrt')

console.log(projects);
