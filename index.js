const express = require('express');
const mongoose = require('mongoose');
const mustacheExpress = require('mustache-express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.set('views', `${__dirname}/view`);
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

const mdbUrl = "mongodb+srv://malaka:cS1D4aqvZGXuBZpg@capricorn-free.usjxr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.set('useCreateIndex', true);
mongoose.connect(mdbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

var schema = mongoose.Schema({
  date: {type: String, unique: true},
  data: {}
});
var RedResults = mongoose.model("results", schema, "redbubble-data");


app.get('/', (req, res, next) => {
  RedResults.find({}, 'date', (err, data) => {
    if(!err) {
      res.render('queries', {dates: data});
    } else {
      res.status(400).json({ error: true, err});
    }
  });
});

app.get('/trends/:date', (req, res, next) => {
  RedResults.find({}, (err, data) => {
    if(!err) {
      const values = data.filter(x => x.date === req.params.date)[0].data;
      // const previousDays = data.filter(x => x.date === )

      const a = Object.keys(values)
        .filter(key => values[key] !== 'error')
        .map(key => (
          { 
            key, 
            count: values[key],
            previous: [2,6,4,3,2],
          }));
      a.sort((a, b) => a.count - b.count);

      res.render('public', {data: a});
    } else {
      console.log(err);
      res.status(400).json({ error: true, err});
    }
  });

});

app.get('/results', (req, res, next) => {
  RedResults.find(req.query, (err, data) => {
    if(!err) {
      res.jsonp(data);
    } else {
      res.status(400).json({ error: true, err});
    }
  });
});

app.post('/results/:date', (req, res, next) => {
  RedResults.findOneAndUpdate({date: req.params.date}, {data: req.body, date: req.params.date}, { upsert: true, setDefaultsOnInsert: true}, (err, results) => {
    if (!err) {
      res.jsonp(results);
    } else {
      res.status(400).json({error: true, err});
    }
  });
});

app.listen(process.env.PORT || '3000');