/* server.js */

  var express = require('express');
  var app = express();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);
  var shortid = require('shortid');
  var sharejs = require('share');
  var redis = require('redis');
 

  app.set('view engine', 'ejs');
  app.use(express.static(__dirname + '/public'));

  var client1 = redis.createClient();

  app.get('/',function(req,res){
      res.render('index');
  });

   var urllist;

   client1.lrange('urllistdb',0,-1,function(err,reply) {
        reply.forEach(function(url) {
           app.get(url,function(req,res){
                res.render('index');     
           });
        });
  });
 console.log("loaded url");



  io.on('connection', function(socket)  {

      socket.on('key pressed', function(msg)  {
          socket.broadcast.emit(msg.cat,msg); 
      });

      socket.on('copy selection',function(msg) {
          socket.broadcast.emit(msg.Id,msg);
      });     

      socket.on('new editor',function(msg) {
          var timeBasedID = shortid.generate();
    
          client1.rpush('urllistdb','/'+timeBasedID);
          app.get('/'+timeBasedID,function(req,res){
              res.render('index');
          });
          socket.emit('new editor',timeBasedID);
      });
  });

 
  var options = {
   db: {type: 'redis'},
  };

  sharejs.server.attach(app,options);

  http.listen(3000,function()
  {console.log("listening");});
