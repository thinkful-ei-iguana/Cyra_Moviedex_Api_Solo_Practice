require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./movieData.json');

const app = express();


app.use(helmet());
app.use(cors());

const morganSetting = 
  process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));

app.use(function validateBearerToken(req, res, next){
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if(!authToken || authToken.split(' ')[1] !== apiToken){
    return res.status(401).json({error: 'unathorized request'});
  }
  next();
});

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error'}};
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

app.get('/movie', function handleGetMovie(req,res){
  let results = movies;
  if(req.query.genre){
    results= results.filter(movie =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())	
    );
  }
  if(req.query.country){
    results = results.filter(movie => 
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }
  if(req.query.avg_vote){
    results = results.filter(movie => 
      Number(movie.avg_vote) >= Number(req.query.avg_vote)
    );
  }
  res.json(results);


});




const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  
});