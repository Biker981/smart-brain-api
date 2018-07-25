const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	if (!email || !name || !password) {//Validates that all register items are filled out
		return res.status(400).json('incorrect form submission');
		//return needed to exit the function
	}
	const hash = bcrypt.hashSync(password); //hash password
	/*transaction makes sure that if one 
	change in transaction fails 
	that all of the changes fail*/
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*') // returns what was just inserted
			.insert({
				email: loginEmail[0],//so email is plain text and not array in db
				name: name,
				//entries: 0 by default according to db rules
				joined: new Date()
			})
			.then(user => {//returns just registered user
				res.json(user[0]);//so we don't get an array
			})
		})
		.then(trx.commit) //send the transaction through
		.catch(trx.rollback)
		//if fail then undo the transaction and return db to previous state
	})
	
		.catch(err => res.status(400).json('unable to register'))//catch errors
}

module.exports = {
	handleRegister: handleRegister
};