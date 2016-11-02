var express = require('express');
var router = express.Router();
var path = process.cwd();
var request = require('request');
var path	   = process.cwd();

var mongoose = require('mongoose');
var db = mongoose.connection;
var nameSchema = require('../models/company.js').nameSchema;
var name = db.model('name', nameSchema);
// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
/*'mongodb://huy:huy@ds135797.mlab.com:35797/polls_app'||*/
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/polls';

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path + '/views/index.html');
});
router.get('/stock/:name', function(req, res){
    request('https://www.quandl.com/api/v3/datasets/WIKI/' + req.params.name.toUpperCase() + '.json?start_date=2014-09-01&end_date=2016-11-02&api_key=zxxQagsbzyaYuzn4ysWc', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        var docs=data.dataset.data;
        var allTime=[];
        //console.log("docs.length: " + docs.length);
        for(var j = docs.length-1 ; j>=0; j--){
            var date=docs[j][0];
            var myDate=natToUnix(date) * 1000;
            var oneDay=[ myDate , docs[j][4]];
            allTime.push(oneDay);
        }
        res.json(allTime);
      }
    })
});
router.get('/check/:name', function(req, res){
    request('https://www.quandl.com/api/v3/datasets/WIKI/' + req.params.name.toUpperCase() + '.json?start_date=2014-09-01&end_date=2016-11-02&api_key=zxxQagsbzyaYuzn4ysWc', function (error, response, body) {
        console.log(response.statusCode);
        if(response.statusCode == 404 || response.statusCode == 400){
            res.send({statusCode: "not found"});
        } else {
            res.send({
                statusCode: "found",
                name: JSON.parse(body).dataset.name,
                symbol: JSON.parse(body).dataset.dataset_code
            });
        }
    })
});
function natToUnix(nat){
    var unixtime=(new Date(nat).getTime())/1000;
    return unixtime;
}
module.exports = router;