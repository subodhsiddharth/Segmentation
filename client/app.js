const axios = require('axios')
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";
const app = express(cors())
app.use(express.json());

const port = 3000 || process.env.PORT
const serverport = 3001 || process.env.PORT
const userport = 3002 || process.env.PORT
const server = "http://127.0.0.1"

app.get('/', (req, res) => res.status(200).json({"Status" : 'Home is working fine'}))

app.get('/server1' , async (req,res) => {
    return await axios.get(server+":"+serverport)
    .then( (response) => res.status(200).send("OK"))
    .catch( () => res.status(404).send("Server Down") )
})

app.get('/server2' , async ( req,res) => {
    return await axios.get( server+":"+userport)
    .then( () => res.status(200).send("OK") )
    .catch( () => res.status(404).send("Server Down") )
}) 


app.get('/createNote', async (req, res) => {

    try{
        var token = req.headers.authorization.split(' ')[1];
        var oauth = jwt.verify(token, JWT_SECRET)

        return await axios.post('http://localhost:3001/createNote', {
        title: req.body.title , 
        content: req.body.content,
        user : oauth.username
        })
        .then( response => res.status(200).json(response.data))
        .catch(error => res.status(400).json({error }))
    }catch(err) {
        return res.status(401).send('Invalid token')
    }
})

app.get('/getNotes', (req,res) => {
    return axios.get('http://localhost:3001/getNotes')
    .then( response => {
        console.log(response.data)
        res.status(200).json(response.data)
    })
    .catch(error => {
        console.log(error)
        res.status(200).json(error)
    })
})

app.delete('/deleteNote/:id', (req,res) => {
    return axios.delete('http://localhost:3001/deleteNote/'+req.params.id)
    .then( response => {
        console.log(response.data)
        res.status(200).json(response.data )
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({error })
    })
})

app.put('/updateNote/:id', (req,res) => {
    return axios.put('http://localhost:3001/updateNote/'+req.params.id , {
        title: req.body.title ,
        content: req.body.content
    })
    .then( response => {
        console.log(response.data)
        res.status(200).json(response.data)
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({error })
    })
})

app.get('/getNote/:id', (req,res) => {
    return axios.get('http://localhost:3001/getNote/'+req.params.id)
    .then( response => {
        console.log(response.data)
        res.status(200).json(response.data)
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({error })
    })
})

app.get('/getNoteByLikeTitle/:title', (req,res) => {
    return axios.get('http://localhost:3001/getNoteByLikeTitle/'+req.params.title)
    .then( response => {
        console.log(response.data)
        res.status(200).json(response.data)
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({error })
    })
})

app.get('/getNoteByLikeContent/:content', (req,res) => {
    return axios.get('http://localhost:3001/getNoteByLikeContent/'+req.params.content)
    .then( response => {
        console.log(response.data)
        res.status(200).json(response.data)
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({error })
    })
})

app.delete('/deleteAll', (req,res) => {
    if( req.body.password !== 'pass' || req.body.user !== "user" )
         return res.status(400).json({error : 'Not Authorized'})


    return axios.delete('http://localhost:3001/deleteAll')
    .then( response => {
        console.log(response.data)
        res.status(200).json(response.data)
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({error })
    })
})

app.post('/signup', async (req,res) => {

    return await axios.post('http://localhost:3002/signup', {
        username : req.body.username,
        password : req.body.password
    })
    .then( response => {
        console.log(response.data)
        res.status(200).json(response.data)
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({error })
    })
})

app.post('/login', async (req,res) => {
    return await axios.post('http://localhost:3002/login', {
        username : req.body.username,
        password : req.body.password
    })
    .then( response => {
        console.log(response.data)
        res.status(200).json(response.data)
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({error })
    })
})

app.get('/user', async (req,res) => {
    var token = req.headers.authorization.split(' ')[1];
    var val = await axios.get('http://localhost:3002/user', { headers: { Authorization: `Bearer ${token}` } })
    .then( response => res.send(response.data) )
    .catch(error => res.status(400).json({error}))
})

app.get('/UserNotes', async (req,res) => {
    var token = req.headers.authorization.split(' ')[1];
    var val = await axios.get('http://localhost:3002/user', { headers: { Authorization: `Bearer ${token}` } })
    .then( response => response.data )
    .catch(error => res.status(400).json({error}))

    var val2 = await axios.get('http://localhost:3001/getNotesByUser/'+val.username)
    .then( response => response.data )
    .catch(error => res.status(400).json({error}))

    res.status(200).send({
        user : val,
        notes : val2
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))