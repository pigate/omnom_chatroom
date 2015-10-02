var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('pages/index');
});

app.listen(app.get('port'), function(){
  console.log('OMNOM-CHATROOM running on port', app.get('port'));
});
