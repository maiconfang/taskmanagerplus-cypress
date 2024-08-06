const mysql = require('mysql');

function queryTestDb(query) {
  // Database configuration
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'taskmanagerplusapi'
  });

  // Create a new Promise and connect to the database
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(err);
      }
      // Execute the provided query
      connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
        connection.end();
      });
    });
  });
}

module.exports = queryTestDb;
