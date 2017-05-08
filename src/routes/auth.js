const fs = require('fs');
const path = require('path');

module.exports = function(router){

  const postgresClient = new pg.Client({
    user: 'reditscratch',
    password: 'redacademy',
    database: 'reditscratch',
    port:5432,
    host:'localhost'
  });

  postgresClient.connect((err) => {
    if (err) throw err;
    app.post('/login', (req, res) => {
      const { username, password } = req.body;
      const query = `SELECT * FROM users WHERE username='${username}' AND password=crypt('${password}', password);`
      postgresClient.query(query, (err, user) => {
        console.log(err, user);
        if(user.rows.length) return res.status(200).send();
        return res.status(403).send('Invalid username or password...');
      });
    });
  });
}
