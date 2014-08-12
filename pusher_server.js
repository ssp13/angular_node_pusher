var express = require('express');
var Pusher = require('pusher');
var app=express();
var pusher = new Pusher({
  appId: '84171',
  key: '599a9eb32ff37b5469f7',
  secret: '413438491ed4db5b583e'
});
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });
app.use(express.static(__dirname + '/AC'));
app.get('/api/get/priv/on',function(req,res){
  
pusher.trigger('private-channel', 'client-turnon', { message: "on" });
res.send('sended channel-1');
});
app.get('/api/get/priv/off',function(req,res){
  
pusher.trigger('private-channel', 'client-turnoff', { message: "on" });
res.send('sended channel-1');
});
app.get('/hello.txt', function(req, res){

pusher.trigger('channel-1', 'test_event', { message: "hello world" });
  
});
 app.get('/api/get/on',function(req,res){
  
pusher.trigger('ac_channel', 'turnoff', { message: "on" });
res.send('sended ac_channel-turnoff');
});   
app.get('/api/get/off',function(req,res){
  
pusher.trigger('ac_channel', 'turnoff', { message: "off" });
res.send('sended ac_channen-turnoff');
});





var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
