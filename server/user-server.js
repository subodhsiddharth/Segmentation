const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";
const { MongoClient} = require('mongodb');
const port = 3002 || process.env.PORT;
const express = require('express');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const url = 'mongodb://127.0.0.1:27017' || process.env.MONGODB_URI // MongoDB URL
const dbName = 'test';

function userExist( username ) {
    const client = new MongoClient(url, { useUnifiedTopology: true })
    return client.db(dbName).collection('user').findOne({username: username})
}

app.get('/', (req, res) => res.send('Server is running'))

app.post('/signup', async (req, result) => {
    var username = req.body.username;
    var password = req.body.password;

    if( !username || !password ) return result.status(406).send('Username or password is empty') 
    if( password.length < 8 ) return result.status(406).send('Password must be at least 8 characters')
    if( username.length < 4 ) return result.status(406).send('Username must be at least 4 characters')
    if( username.length > 20 ) return result.status(406).send('Username must be less than 20 characters')
    if( username.match(/[^a-zA-Z0-9]/) ) return result.status(406).send('Username must be alphanumeric')

    const client = new MongoClient(url, { useUnifiedTopology: true })
    const hashedPassword = await bcrypt.hash(password, saltRounds) 

    if( !hashedPassword ) return result.status(501).send('Server Error : Error hashing password') 
    if( await userExist(username) ) return result.status(403).send('Username already exist')

    return await client.db('test').collection('user').insertOne({username: username, password: hashedPassword})
    .then((res) => result.send(res))
    .catch((err) => result.send(err) )
})

app.post('/login', async (req, result ) => {
    var username = req.body.username;
    var password = req.body.password;

    if( !username || !password ) return result.status(403).send('Username or password is empty') 
    if( password.length < 8 ) return result.status(403).send('Wrong password')
    if( username.length < 4 || username.length > 20 || username.match(/[^a-zA-Z0-9]/) ) return result.status(403).send('Wrong username')

    const client = new MongoClient(url);
    
    return await client.db(dbName).collection('user').findOne({
        username: username
        })
        .then( (res) => {
            if( res) {
                if( bcrypt.compareSync(password, res.password) ) 
                    return result.send({ token: jwt.sign({ username: username }, JWT_SECRET) })
                else 
                    return result.status(401).send('Incorrect password ')
            }
            else 
                return result.status(401).send('User not found')
        })
        .catch((err) => result.send(err) )
})

app.get('/user', (req, res) => {
    try{
        var token = req.headers.authorization.split(' ')[1];
        var oauth = jwt.verify(token, JWT_SECRET)
        return res.send(oauth)
    }catch(err) {
        return res.status(401).send('Invalid token')
    }
})

app.listen(port, () => console.log(`Server is running on port ${port}`) )