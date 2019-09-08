// this shit was made by Evil Factory https://steamcommunity.com/id/programador_gay/
// im dont like const fuck you

//config

const SERVER_PORT = 80
const SERVER_DIR = "server-side"
const CLIENT_DIR = "public"


var express = require("express");
var fs = require('fs');
var path = require('path');



var app = express();

var server = app.listen(SERVER_PORT);

function restart(){

app.use(express.static(CLIENT_DIR));

var Warnings = 0;


console.log("\x1b[36m","Server Starting... \x1b[37m");


var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};


function getExtension(filename) {
    var ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
}

process.stdout.write("\x1b[36m Checking clientside files... \x1b[37m");
//console.log("\x1b[36m","Checking clientside files... \x1b[37m");

fs.stat(CLIENT_DIR, function(err) {
    if (err) {
    process.stdout.write("\x1b[31mError \x1b[37m");
     process.stdout.write("\n\x1b[33m Warning: Clientside directory not created or specified on options")
    Warnings++;
    }else{
      process.stdout.write("\x1b[32mOK \x1b[37m");
    }



    process.stdout.write("\n\x1b[36m Executing server-side files... \x1b[37m");



walk(SERVER_DIR, function(err, results) {
  if (err) {
    process.stdout.write("\x1b[31mError \x1b[37m");
    console.log("\x1b[33m","\n Warning: Serverside directory not created or specified on options\n")
    Warnings++;
  }else{
    process.stdout.write("\x1b[32mOK \x1b[37m\n");

  for(var file in results){
if(getExtension(results[file]) == "js"){
    console.log("\x1b[35m","   "+results[file]+" \x1b[37m")
  }
  }


  for(var file in results){
  if(getExtension(results[file]) == "js"){
    eval(fs.readFileSync(results[file])+'');
  }
  }

}

if(Warnings > 0){
console.log("\x1b[33m","Server up running! With "+Warnings+" warning(s)! press ctrl + c to stop \x1b[37m");
}else{
console.log("\x1b[32m","Server up running! all fine! press ctrl + c to stop \x1b[37m");
}

});


});

}

restart()

process.stdin.setEncoding('utf8');

process.stdin.on('data', function (text) {

  if (text.trim() === 'restart') {
    restart();
  }

  if (text.trim() === 'quit') {
    process.exit()
  }
});