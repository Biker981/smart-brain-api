
const handleProfileGet = (req, res, db) => {
	//has access to param id	
	const { id } = req.params;
	let found = false;
	db.select('*').from('users').where({
		id: id
	})
	   .then(user => {
	   	if (user.length) {
	   		res.json(user[0]);
	   	} else {//db returns empty array for no users
	   		res.status(400).json('Not Found');
	   	}
	})
	  	.catch(err => res.status(400).json('error getting user'))
}

module.exports = {
	handleProfileGet: handleProfileGet
}
