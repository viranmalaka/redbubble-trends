const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const twoDigi = (a) => (a < 10) ? '0' + a : a;
const getDate = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${twoDigi(d.getMonth() + 1)}-${twoDigi(d.getDate())}`;
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

var schema = mongoose.Schema({
  date: {type: String, unique: true},
  data: {}
});
var RedResults = mongoose.model("results", schema, "redbubble-data");

app.get('/dates', (req, res, next) => {
  RedResults.find({}, 'date', (err, data) => {
    if(!err) {
      res.send(data);
    } else {
      res.status(400).json({ error: true, err});
    }
  });
});

app.get('/trends/:date', (req, res, next) => {
  RedResults.find({}, (err, data) => {
    if(!err) {
      const values = data.filter(x => x.date === req.params.date)[0].data;

      const previousDays = Array(10).fill({}).map((_, index) => {
        return getDate(new Date(req.params.date).getTime() - (86400000 * (index + 1)))
      });
      const previousDaysData = data.filter(x => previousDays.includes(x.date)).reduce((obj, current) => {
        obj[current.date] = current.data
        return obj;
      }, {});

      const a = Object.keys(values)
        .filter(key => values[key] !== 'error')
        .map(key => {
          return {
            key,
            count: values[key],
            previous: Object.keys(previousDaysData).map(day => previousDaysData[day] && previousDaysData[day][key]),
          };
        });
      a.sort((a, b) => a.count - b.count);

      res.json({data: a.map((x, index) => ({...x, index}))});
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
