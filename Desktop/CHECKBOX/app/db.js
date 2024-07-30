const sqlite3 = require('sqlite3').verbose();
const { join } = require('path');


const databasePath = join(__dirname, '../database.sqlite');


const database = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error('Failed to connect to the database:', error);
  } else {
    console.log('Successfully connected to SQLite database.');
  }
});

module.exports = database;
