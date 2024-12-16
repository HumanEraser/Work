import mysql from 'mysql2/promise';

export async function connect(user,db){
  var host = 'localhost';
  return await mysql.createConnection({
    host: host,
    user: user,
    database: db
  });
}
