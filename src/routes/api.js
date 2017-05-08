const fs = require('fs');
const path = require('path');
const pg = require('pg');
const json = require('body-parser').json;

const postgresClient = new pg.Client({
  user: 'reditscratch',
  password: 'redacademy',
  database: 'reditscratch',
  port:5432,
  host:'localhost'
});

module.exports = function(router){


  postgresClient.connect((err) => {

    if (err) throw err;
    console.log('connect to postgress...');

    router.use('/api', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    router.use(json());

    router.get('/posts', (req, res) => {
      postgresClient.query('SELECT * FROM posts', (err, posts) => {
        if (err) return res.status(500);
        return res.status(200).json(posts.rows);
      });
    });

    router.get('/weeks', (req, res) => {
      postgresClient.query('SELECT * FROM weeks', (err, weeks) => {
        if(err) return res.status(500).send();
        postgresClient.query('SELECT * FROM lessons', (err, lessons) => {
          const response = weeks.rows.map( week => {
            return {
              title:week.title,
              lessons: lessons.rows.filter(lesson => lesson.week_id === week.id)
            };
          });
          res.status(200).send(response);
        });
      });
    });

    // router.get('/lessons/:lesson_id/posts', (req, res) => {
    //   const mockData = fs.readFileSync(path.resolve(__dirname, '../mockdata.json'));
    //   const id = req.params.lesson_id;
    //   const posts = JSON.parse(mockData).posts.filter(post => post.lessons.find( lesson => lesson.id === id));
    //   posts.length ? res.status(200).send(posts) : res.status(404).send()
    // });

    return router;
  });

}
