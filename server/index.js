/*jshint node:true */
'use strict';

var config = require('config');
var express = require('express');
var session = require('express-session');
var engines = require('consolidate');

var app = express();
var bodyParser = require('body-parser')
var auth = require('./auth');
var authRouter = require('./auth/auth-router');

var sockio = require("socket.io");
var cookieParser = require('socket.io-cookie');
var expressCookieParser = require('cookie-parser')

var authControllers = require('./auth/auth-controller');
var requestify = require('requestify'); 
var channel = require('./channel'); 
var rules = require('./rules')(); 

var rest=null;

var users={}


app.use(bodyParser.json())

// Middleware
app
  .use(session({
    secret: 'rfrvnwerwrnevwrnernren8342$asdfs_%asd',
    resave: false,
    saveUninitialized: true
  }))
  .use(auth.initialize())
  .use(auth.session())
  .use(expressCookieParser())


// Routes
app

  // oauth login
  .use('/auth', authRouter)

  //ugly programming
  //should go to extra module
  var resources=rules.resources();
  for(var r in resources){
     addRest(r);
  }



app
  // API describtion 
  .use('/resource', function(req,res){
       res.send(rules.resource(req.url));
  })
 .use('/resources', function(req,res){
       res.send(rules.resources());
  })

  //public user info
 .use('/user/:id', function(req,res){
        rest.getUser(req.param("id")).then(function(avatar){
            res.send(avatar);
        });
  })


  // serve static files
  .use(express.static(__dirname + '/../client'))

  // 404 not found
  .use('*', function (req, res) {
    res.status(404).send('404 Not Found').end();
  });


  function addRest(r){
    app.use(r+"$",function(req,res){

        //store cookie for websocket request
        if(req.user && req.cookies['connect.sid']){
            if(!users[req.cookies['connect.sid']]){
                users[req.cookies['connect.sid']]=req.user;
            }
            req.body.owner=req.user.id;
        }
        
        if(req.params["raml"]){
            res.send(resources[r]);
        }else{
            var method=req.method.toLowerCase();
            if(typeof(resources[r][method])!=="undefined"){
                var allowed=securedBy(r,resources[r][method],req,res);
                if(!allowed){
                    res.status(401).send("not allowed");
                    return;
                }
                switch(method){
                    case "post":
                        req.body.resource=req.originalUrl; 
                        rest.insert(req.body).then(function(response){;
                            res.send(response);
                        },function(error){
                            res.status(500).send(error); 
                        });
                    break; 
                    case "get":
                        rest.list(req.originalUrl).then(function(response){
                            res.send(response);
                        },function(error){
                            res.status(500).send(error);
                        });
                    break; 
                    case "delete":
                        rest.delete(req.originalUrl).then(function(response){
                            res.status(204).send("");
                        });
                    break;
                    case "put":
                        rest.update(req.originalUrl,req.body).then(function(response){
                            res.status(200).send(response);
                        });
                    break;

                    default:
                        console.warn("method "+method+" not implemented");
                }
            }else{
                res.send("can't find method "+ req.method.toLowerCase()+" for resource "+r);
            }
            
        }
    });
  }

  function securedBy(r,method,req,res){
    console.log(r,method.securedBy,req.user,req.body,req.params.userid);
    var allowed=false;
    for(var s=0;s<method.securedBy.length;s++){
       var rule=method.securedBy[s]; 
        
        console.log("RULE",rule);
        switch(rule){
            case "open": 
                allowed=true;
                break;
            case "privat": 
                if(req.user && req.user.id==req.params.userid){
                    allowed=true;
                } 
                break;
            case "owner": 
                    allowed=true;
                break;
            case "p2p": 
                allowed=true;
                break;
            case "admin": 
                allowed=true;
                break;

        }
    }
    return allowed;
  }


  function restinger(req,res,next){
    console.log(req.method,rules);
    // Rest interface derived from RAML
    var resources=rules.resources();
    for(var r in resources){
         console.log("listen to",r)
         addRest(r);
    }


    next();
  }





/**
And now the socket
*/

console.log("starting at port "+config.get('ports').http);
var io = sockio.listen(app.listen(config.get('ports').http))

io.use(cookieParser);


//http://stackoverflow.com/a/24859515


io.on('connection', function (socket){
    var sessionid=socket.handshake.headers.cookie['connect.sid'];
    socket.user=users[sessionid];
    rest.init(socket);
    return
});



rest=channel();

