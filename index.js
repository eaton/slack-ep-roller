var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

var roll = require('./roll');
var check = require('./check');
var oppose = require('./oppose');
var define = require('./define');

app.post('/roll', roll);
app.post('/check', check);
app.post('/oppose', oppose);
app.post('/define', define);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});