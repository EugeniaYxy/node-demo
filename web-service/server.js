/*
    server.js
    main server script for our task list web service
*/

var port = 8080;

// 1. Load all modules we need
    // express web server framework
var express = require('express');
    // sqlite library
var sqlite = require('sqlite3');
    // create a new express app
var app = express();

    // body parser library
var bodyParer = require('body-parser');

/*
// 2. Add a route for our home page
app.get('/', function(req, res) {
   res.send('<h1>Hello World!</h1>');
}); */

// 4. Tell express to serve static files from the static subdir
app.use(express.static(__dirname + '/static'));

// tell express to parse post body data as json
app.use(bodyParer.json());

// api route for getting tasks
app.get('/api/tasks', function(req, res, next) {
   var sql = 'select rowid, title, done, createdOn from tasks where done != 1';
   db.all(sql, function(err, rows) {
       if(err) {
           return next(err);
       }

       // send rows back to client as JSON
       res.json(rows);
   });
});

// 6. When someone posts to /api/task
app.post('/api/tasks', function(req, res, next) {
    var newTask = {
        title: req.body.title,
        done: false,
        createdOn: new Date()
    };
    var sql = 'insert into tasks(title, done, createdOn) values(?,?,?)';
    db.run(sql, [newTask.title, newTask.done, newTask.createdOn], function(err) {
        if(err) {
            return next(err);
        }
        res.status(201).json(newTask);
    });
});

// 7. When someone PUTs to /api/tasks/<task-id>...
app.put('/api/tasks/: rowid', function(req, res, next) {
   var sql = 'update tasks set done=? where rowid=?';
    db.run(sql,[req.body.done, req.params.rowid], function(err) {
        if(err) {
            return next(err);
        }

        res.json(req.body);
    });
});


// 5. Create database
    // open the database and also we need to provide a callback function
    // node asynchronously
var db = new sqlite.Database(__dirname + '/data/tasks.db', function(err) {
    if(err) {
        throw err;
    }

    var sql = 'create table if not exists ' +
        'tasks(title string, done int, createdOn datetime)';
    db.run(sql, function(err) {
        if(err) {
            throw err;
        }
    });

    // 3. Start the server (we only want one app.listener)
    // call back function
    app.listen(port, function() {
        console.log('server is listening on http://localhost:' + port);
    });

});


