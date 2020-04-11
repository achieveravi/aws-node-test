var express = require('express');
var mysql = require('mysql');
var dbconfig = require('opsworks');

var app = express();
var outputString = '';

app.engine('html', require('ejs').renderFile);

app.locals.hostname = dbconfig.db['host'];
app.locals.username = dbconfig.db['username'];
app.locals.password = dbconfig.db['password'];
app.locals.port = dbconfig.db['port'];
app.locals.database = dbconfig.db['database'];
app.locals.connectionerror = 'successful';
app.locals.databases = '';


var connection = mysql.createConnection({
    host: dbconfig.db['host'],
    user: dbconfig.db['username'],
    password: dbconfig.db['password'],
    port: dbconfig.db['port'],
    database: dbconfig.db['database']
});

connection.connect(function(err) {
    if(err) {
        app.locals.databases = err.stack;
        return;
    }
});

connection.query('SHOW DATABASES', function(err, results) {
    if(err) {
        app.locals.databases = err.stack;
    }

    if(results) {
        for(var i in results) {
            outputString = outputString + results[i].Database + ', ';
        }
        app.locals.databases = outputString.slice(0, outputString.length -2);
    }
});

connection.end();

app.get('/', function(req, res) {
    res.render('./index.html');
});

app.use(express.static('public'));

app.listen(process.env.PORT);