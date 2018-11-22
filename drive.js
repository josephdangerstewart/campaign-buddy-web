import authConfig from './config/auth';
import { generateNewModel } from './client/src/models';
var google = require('googleapis');
var stream = require('stream');
const OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(
	authConfig.googleAuth.clientID,
	authConfig.googleAuth.clientSecret,
	process.env.NODE_ENV == 'production' ? "http://dnd.josephdangerstewart.com/googlecallback" : "http://localhost:8082/googlecallback"
);

console.log(oauth2Client)

const listFiles = (user, response) => {

	if (process.env.CLOG) {
		console.log("USER");
		console.log(user);
		console.log("-----");
	}

	oauth2Client.credentials = {
		access_token: user.token,
		refresh_token: user.refreshToken
	}

	if (process.env.CLOG)
		console.log(oauth2Client);

	let drive = google.drive({ version: 'v3', auth: oauth2Client });
	drive.files.list({
		spaces: 'appDataFolder',
		fields: 'nextPageToken, files(id, name)',
		pageSize: 100
	}, (err, data) => {
		if (err) {
			console.log('The API returned an error: ' + err);
			return response.json({
				status: 501,
				message: err
			});
		}

		const files = data.files;
		if (files.length) {
			return response.json({status: 200, files});
		} else {
			return response.json({status: 200, files: []});
		}
	});
}

const updateCampaign = (request, response) => {
	oauth2Client.credentials = {
		access_token: request.user.token,
		refresh_token: request.user.refreshToken
	}

	let { fid } = request.params;
	let { body } = request;
	console.log(body);

	var media = {
		mimeType: 'application/json',
		body: JSON.stringify(body)
	};

	let drive = google.drive({ version: 'v3', auth: oauth2Client });
	drive.files.update({
		media: media,
		uploadType: 'media',
		fileId: fid
	}, (err, result) => {
		if (err) {
			return response.json({
				status: 501,
				reason: err
			})
		} else {
			return response.json({
				status: 200,
				result: result
			})
		}
	})

}

const createCampaign = (request, response) => {
	oauth2Client.credentials = {
		access_token: request.user.token,
		refresh_token: request.user.refreshToken
	}

	let { name, system } = request.query;

	var fileMetadata = {
		'name': name,
		'parents': ['appDataFolder']
	};

	const model = generateNewModel();
	model.config.gameSystem = system;

	var media = {
		mimeType: 'application/json',
		body: JSON.stringify(model),
	};

	let drive = google.drive({ version: 'v3', auth: oauth2Client });
	drive.files.create({
		resource: fileMetadata,
		media: media,
		fields: 'id'
	}, function (err, file) {
		if (err) {
			// Handle error
			console.error(err);
			console.log("THERE WAS AN OOPSIES")
			response.json({
				status: 200,
				reason: err
			});
		} else {
			response.json({
				status: 200,
				id: file.id
			})
		}
	});
}

const getModel = (request, response) => {
	oauth2Client.credentials = {
		access_token: request.user.token,
		refresh_token: request.user.refreshToken
	}

	let output = "";
	let { fid } = request.params;
	console.log(fid);

	var writableStream = new stream.Writable({
		objectMode: true,
		highWaterMark: 16,
		write: function (chunk, encoding, callback) {
			output += chunk.toString('utf-8');
			callback();
		},
		writev: function (chunk, callback) {
			callback();
		}
	});

	let drive = google.drive({ version: 'v3', auth: oauth2Client });
	drive.files.get({
		spaces: 'appDataFolder',
		fileId: fid,
		alt: 'media'
	}).on('end',
		(v) => {
			try {
				response.json({
					status: 200,
					model: JSON.parse(output)
				});
			} catch (err) {
				response.json({
					status: 501,
					reason: err
				})
			}
		}
	).on('error',
		(er) => {
			response.json({
				status: 501,
				reason: er
			})
		}
	).pipe(writableStream);
}

const deleteCampaign = (request, response) => {
	oauth2Client.credentials = {
		access_token: request.user.token,
		refresh_token: request.user.refreshToken
	}

	let { fid } = request.params;

	let drive = google.drive({ version: 'v3', auth: oauth2Client })
	drive.files.delete({
		fileId: fid
	}, (err) => {
		if (err) {
			response.json({
				status: 501,
				reason: err
			})
		} else {
			response.json({
				status: 200
			})
		}
	})
}

export {
	listFiles,
	createCampaign,
	getModel,
	updateCampaign,
	deleteCampaign
}
