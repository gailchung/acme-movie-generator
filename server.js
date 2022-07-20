const express = require('express');
const app = express();
const path = require('path');
const db = require('./db')
const { Movie } = db;

app.use(express.json())

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/movies', async(req, res, next)=> {
  try {
    res.send(await Movie.findAll());
  }
  catch(err) {
    next(err);
  }
});

app.post('/api/movies', async(req, res, next)=> {
  try {
    res.status(201).send(await Movie.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/movies/:id', async(req, res, next)=> {
  try {
    const movie = await Movie.findByPk(req.params.id);
    await movie.destroy();
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.put('/api/movies/:id', async(req, res, next)=> {
  try {
    const movie = await Movie.findByPk(req.params.id);
    await movie.update(req.body);
    res.send(movie);
  }
  catch(ex){
    next(ex);
  }
});


app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ err });
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening on port ${port}`));


const init = async()=> {
  try {
    await db.conn.sync({ force: true });
    const [ Spiderman, Thor, Captain_America] = await Promise.all([
     Movie.create({name: 'Spiderman'}), 
     Movie.create({name: 'Thor'}),  
     Movie.create({name: 'Captain_America'})
    ]);
    }
  catch(ex){
    console.log(ex);
  }
}

init();
