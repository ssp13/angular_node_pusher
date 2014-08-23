var express = require('express');
var Pusher = require('pusher');
var bodyParser = require('body-parser');
var app=express();
var Firebase=require('firebase');
var pusher = new Pusher({
  appId: '84171',
  key: '599a9eb32ff37b5469f7',
  secret: '413438491ed4db5b583e'
}); 

var myFirebaseRef = new Firebase("https://crackling-fire-1603.firebaseio.com/");

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
  
  next();
 });
 app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
 
app.post('/api/coordinates',function(req,res){
    myFirebaseRef.set(req.body);
	    console.log(req.body);
    var pos=req.body;
    console.log(pos.coords.latitude);
    
	var position={
	lat:pos.coords.latitute,
	lon:pos.coords.longtitude
	};
	var homePosition={
	lat:22,
	lon:35
	};
	function getDistance(lat1,lon1,lat2,lon2){
	var R = 6371; // Radius of the earth in km
 	 var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
 	 var dLon = (lon2-lon1).toRad(); 
 	 var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
  	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  	var d = R * c; // Distance in km
 	 return d;
	}
 	/** Converts numeric degrees to radians */
  if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
 }


  
    res.end();  

 // just call res.end(), or show as string on web
   
 });
 var logger = function(req, res, next) {
    console.log("GOT REQUEST !");
    next(); // Passing the request to the next handler in the stack.
};
 app.get('/api/getturnon',function(req,res){
   //myFirebaseRef.set(req.body);
   var turnon=[8400,4200,550,1600,550,550,550,500,600,500,550,1600,600,500,550,550,550,500,600,1600,550,1600,550,550,550,500,600,500,550,550,550,550,550,500,600,500,550,550,550,500,600,500,550,550,550,1600,550,550,550,1600,550,550,550,550,550,500,550,1600,600];
     myFirebaseRef.set(turnon);
   console.log("Got response: " + req);
var js=JSON.stringify(turnon);
  
    //res.send(js);
    res.send(turnon);
    
   // just call res.end(), or show as string on web
   
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
  
pusher.trigger('ac_channel', 'turnon', { message: "on" });
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
