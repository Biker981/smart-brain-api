const Clarifai = require('clarifai');

const app = new Clarifai.App({
 //ALWAYS STORE PASSWORDS AND KEYS AS ENVIRONMENT VARIABLES
 apiKey: process.env.CLARIFAI_API_KEY
});

const handleApiCall = (req, res) => {
	app.models
	.predict(Clarifai.FACE_DETECT_MODEL, 
     req.body.input)
	.then(data => {
		res.json(data);
	})
	.catch(err => res.status(400).json('unable to make api request'))
}


const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
}
