debugger;
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');
var passport = require('passport');
var social = require('./app/passport/passport')(app,passport);
var Chat = require('./app/models/chats');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components'))); 
app.use('/api',appRoutes);
// web socketr server side
var server   = require('http').Server(app);
var io       = require('socket.io')(server);
 
var users = [];
var imageFiles = [];
io.on('connection', function(socket) {
    var username = '';
    console.log('connection est');
    socket.on('request-users', function(){
        socket.emit('users', {users: users});
    });
    socket.on('add-user', function(data){
        //add user 
        var newMsg = new Chat({chatusername: data.username});
        newMsg.save(function(err){
            if(err)
            throw err;
            else {
               if(users.indexOf(data.username) == -1){
                    io.emit('add-user', { username: data.username});
                    username = data.username;
                    users.push(data.username);
                }
                else {
                    io.emit('prompt-username', {
                        message: 'user has already exist'
                    });
                }
            }
        })
    });
    socket.on('disconnect', function() {
        console.log(username + ' has disconnected');
        users.splice(users.indexOf(username), 1);
        io.emit('remove-user', {username: username});
    });
    socket.on('message', function(data){
        var newMsg = new Chat({chatusername: username, msg: data.message});
        newMsg.save(function(err){
            if(err)
            throw err;
            else {
                if(data.imageFiles) {
                    data.message = "has sent image";
                    io.emit('message', {username: username, message: data.message, imageFiles: data.imageFiles});
                }
                else {
                    io.emit('message', {username: username, message: data.message});
                }
            }
        })
    })
});
mongoose.connect('mongodb://localhost:27017/tutorial', function(err){
    if(err) {
        console.log("not connected to the db" + err);
    }
    else{
        console.log("connected to the mongodb");
    }
});
app.get('/', function(req,res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});
app.get('/home', function(req, res){
    res.send("You sre getting response from server and you are in home page");
});


server.listen(port, function(){
    console.log("running the server");
});


