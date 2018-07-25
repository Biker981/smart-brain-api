
const handleSignIn = (db, bcrypt) => (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {//prevent blank user sign on
		return res.status(400).json("incorrect form submission");
	}
	db.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			//compare signin password against hash stored in the database
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return db.select('*').from('users')
				  .where('email', '=', email)
				  .then(user => {
				  	res.json(user[0]);
				  })
				  .catch(err => res.status(400).json('unable to get user'))	
			} else {//return if the password and/or email is wrong
				res.status(400).json('wrong crendentials')
			}
		})
		.catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
	handleSignIn: handleSignIn
}