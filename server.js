import express from 'express';
import passport from 'passport';
import initPassport from './config/passport.js';
import session from 'express-session';
import bodyParser from 'body-parser';
import {
	listFiles,
	createCampaign,
	getModel,
	updateCampaign,
	deleteCampaign
} from './drive.js'

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

initPassport(passport);

var siteUrl = process.env.NODE_ENV === 'production' ? "http://dnd.josephdangerstewart.com" : `http://localhost:${process.env.PORT || 8082}`

app.use(session({secret:"everystudent2017"}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + "/client/dist"));

app.use((request, response, next) => {
	response.header("Access-Control-Allow-Origin", "*");
	response.header('Access-Control-Allow-Methods', 'GET');
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	next();
});

function isLoggedIn(request,response,next) {
	if (request.isAuthenticated()) {
		return next();
	}

	response.redirect(siteUrl + '/login');
	response.status(200).end();
}

app.route("/api/listcampaigns").get(isLoggedIn, (request,response) => {
	listFiles(request.user,response);
})

app.route('/api/updatecampaign/:fid').post(isLoggedIn, (request,response) => {
	updateCampaign(request,response);
})

app.route("/api/createcampaign").get(isLoggedIn, (request,response) => {
	createCampaign(request,response);
})

app.route("/api/deletecampaign/:fid").get(isLoggedIn, (request,response) => {
	deleteCampaign(request,response);
})

app.route("/api/getmodel/:fid").get(isLoggedIn, (request,response) => {
	getModel(request,response)
})

app.route("/login").get((request,response) => {
	response.sendFile('client/dist/login.html', {root: __dirname})
})

app.route("/logingoogle").post(passport.authenticate('googlecb', {
	scope:["profile","email","https://www.googleapis.com/auth/drive","https://www.googleapis.com/auth/drive.appdata"],
	prompt: 'consent',
	accessType: 'offline'
}))

app.route("/logingoogle").get(passport.authenticate('googlecb', {
	scope:["profile","email","https://www.googleapis.com/auth/drive","https://www.googleapis.com/auth/drive.appdata"],
	prompt: 'consent',
	accessType: 'offline'
}))

app.route('/googlecallback').get(
            passport.authenticate('googlecb', {
                    successRedirect : '/',
                    failureRedirect : '/login',
            }));

app.route("/logout").get((request,response) => {
	request.logout();
	response.redirect(siteUrl + "/login");
	response.end();
})

// ...For all the other requests just sends back the Homepage
app.route("*").get(isLoggedIn, (request, response) => {
	response.sendFile('client/dist/main.html', { root: __dirname });
});

app.listen(process.env.PORT || 8082);
console.log(`Server started on port ${process.env.PORT || 8082}`);