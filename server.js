const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const register = require('./controllers/register.js');
const signIn = require('./controllers/signIn.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');
const db = knex({//setup database
	client: 'pg',//type of db
	connection: {
		host: process.env.DATABASE_URL,
		ssl: true
	}
});

//console.log(postgres.select('*').from('users'));
//need this instead
// db.select('*').from('users').then(data=> {
// 	console.log(data); //returns array
// });

const app = express();
app.use(bodyParser.json()); //needed to read body
app.use(cors()); //needed to overcome same origin restriction error



app.get('/', (req, res) => {
	res.send('it is working');
})

app.post('/signin', signIn.handleSignIn(db, bcrypt)); //(req, res) fed automatically and put into the handler via currying
	/*passes dependencies (db and bcrypt) to the module it references
	  also known as "Dependency Injection" */


app.post('/register', (req, res) => { 
	register.handleRegister(req, res, db, bcrypt);
	/*passes dependencies (db and bcrypt) to the module it references
	  also known as "Dependency Injection" */
});

app.get('/profile/:id', (req, res) => {
	profile.handleProfileGet(req, res, db);
});

app.put('/image', (req, res) => {
	image.handleImage(req, res, db);
})

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)} )

app.listen(process.env.PORT || 3001, ()=> {
	console.log(`app is running on port ${process.env.PORT}`)
})

/*
API PLAN
Think about what API will look like
--> res = this is working
/signin --> POST (for security) = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> returns updated user ranking dependent on how many pictures are processed
*/