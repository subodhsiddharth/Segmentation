const express = require('express');
const cors = require('cors');
const app = express(cors()) ;
const { MongoClient , ObjectId } = require('mongodb');

const port = 3001 || process.env.PORT
const url = 'mongodb://127.0.0.1:27017' || process.env.MONGODB_URI // MongoDB URL

app.use(express.json());

app.get('/', (req, res) => res.status(200).json({"Status" : 'Server is working fine'}))

app.post('/createNote', (req, result) => {

  if( req.body.title == null || req.body.content == null || req.body.user == null ) return result.send('NULL')

  const client = new MongoClient(url)

  return client.db('test').collection('notes').insertOne(req.body)
  .then((res) => {
    client.close()
    result.send(res)
  })
  .catch((err) =>{
    client.close()
    result.send(err)
  })
})

app.get('/getNotes',  ( request, result ) => {
   
  const client = new MongoClient(url)

  return client.db('test').collection('notes').find({}).toArray()
  .then((res) => {
    client.close();
    return result.status(200).json({res})
  })
  .catch( (err) => {
    client.close();
    return result.status(400).json({err})
  })
  
})

app.get('/getNote/:id', (request, result ) => {

  const client = new MongoClient(url)
  const myid = new ObjectId(request.params.id);

  return client.db('test').collection('notes').findOne({ _id: myid })
  .then((res) => {
      client.close()
      console.log(res)
      return result.status(200).json({res})
  })
  .catch((err) =>{
    client.close()
    result.status(400).json(err)
  })
})

app.put('/updateNote/:id', (request, result ) => {

  const client = new MongoClient(url)
  const myid = new ObjectId(request.params.id);
  console.log(request.body)
  console.log(request.params.id)

  return client.db('test').collection('notes').updateOne({ _id: myid }, { $set: request.body })
  .then((res) => {
    client.close();
    return result.status(200).json({res})
  })
  .catch( (err) => {
    client.close();
    return result.status(400).json({err})
  })
})

app.delete('/deleteNote/:id', (request, result ) => {

  const client = new MongoClient(url)
  const myid = new ObjectId(request.params.id);

  return client.db('test').collection('notes').deleteOne({ _id: myid })
    .then((res) => {
      client.close();
      return result.status(200).json({res})
    })
    .catch( (err) => {
      client.close();
      return result.status(400).json({err})
    })
})

app.get('/getNoteByLikeTitle/:title', (request, result ) => {

  const client = new MongoClient(url)

  return client.db('test').collection('notes').find({ title: { $regex: request.params.title } }).toArray()
  .then((res) => {
    client.close();
    return result.status(200).json({res})
  })
  .catch( (err) => {
    client.close();
    return result.status(400).json({err})
  })
})

app.get('/getNoteByLikeContent/:content', (request, result ) => {

  const client = new MongoClient(url)

  return client.db('test').collection('notes').find({ content: { $regex: request.params.content } }).toArray()
  .then((res) => {
    client.close();
    return result.status(200).json({res})
  })
  .catch( (err) => {
    client.close();
    return result.status(400).json({err})
  })
})

app.delete('/deleteAll', (request, result ) => {
  const client = new MongoClient(url)

  return client.db('test').collection('notes').deleteMany({})
  .then((res) => {
    client.close();
    return result.status(200).json({res})
  })
  .catch( (err) => {
    client.close();
    return result.status(400).json({err})
  })
})

app.get('/getNotesByUser/:user', (request, result ) => {
  const client = new MongoClient(url)

  return client.db('test').collection('notes').find({ user: request.params.user }).toArray()
  .then((res) => {
    client.close();
    return result.status(200).json({res})
  })
  .catch( (err) => {
    client.close();
    return result.status(400).json({err})
  })
})


app.listen(port, () => console.log(`Server listening on port ${port}!`))
