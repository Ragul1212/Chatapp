var User = require('../models/user');
var Chat = require('../models/chats');
var jwt = require('jsonwebtoken');
var secret = 'Happy';
module.exports = function(router) {
    // Chat Message
    router.get('/chatmessage', function(req, res){
        console.log("Chat Message is getting");
        Chat.find(function(err, docs) {
            console.log(docs);
            res.json(docs);
        });
    });
    // Register Route
    router.post('/users', function(req, res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    console.log("success" + user);
    user.save(function(err){
                if(err) {
                    var rsx = {
                        "message":"username or email id already exist",
                        "txStatus":"danger"
                    }
                    res.send(rsx);
                     
                }
                else {
                   var rsx = {
                        "message":"User created Successfully",
                        "txStatus":"success"
                    }
                    res.send(rsx);
                }
                
            });
    });
    // Signin Route
    router.post('/signin', function(req, res){
        console.log(req.body.username);
        User.findOne({ "username": req.body.username}).select('username password email').exec(function(err, user){
            if(err) throw err;
            if(!user) {
                var rsx = {
                    "message":"User name doesn't exist",
                    "txStatus":"danger"
                }
                res.send(rsx);
            }
            else if(user) {
               var validPassword = user.comparePassword(req.body.password);
               if(!validPassword) {
                   var rsx = {
                        "message":"Incorrect Password",
                        "txStatus":"danger"
                    }
                    res.send(rsx);
               } else {
                  var token = jwt.sign({
                        username: user.username,
                        email: user.username
                   }, secret, {expiresIn: '24h'});
                   var rsx = {
                        "message":"User Authenticated",
                        "txStatus":"success",
                        "token": token
                    }
                    res.send(rsx);
               }
            }
        });
        console.log('sign route is working');
    });
    router.use(function(req, res, next){
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        console.log('token is not-' + token);
        if(token) {
            jwt.verify(token, secret, function(err, decoded){
                if(err) {
                    res.json({ success: false, message: "token invalid"});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else {
            res.json({ success: false, message: "no token provided"});
        }
    });
    router.post('/me', function(req, res){
        res.send(req.decoded);
    });
    
    return router;
}