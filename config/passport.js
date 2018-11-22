import authConfig from './auth';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

export default function initPassport(passport) {

	passport.serializeUser((user, done) => {
		return done(null, user);
	});

	passport.deserializeUser((user, done) => {
		done(null, user);
	});

	passport.use('googlecb', new GoogleStrategy({
		clientID: authConfig.googleAuth.clientID,
		clientSecret: authConfig.googleAuth.clientSecret,
		callbackURL: (process.env.NODE_ENV === 'production' ? "http://dnd.josephdangerstewart.com/googlecallback" : `http://localhost:${process.env.PORT || 8082}/googlecallback`)
	},
		(token, refreshToken, profile, done) => {
			process.nextTick(() => {

				if (process.env.CLOG) {
					console.log(token);
					console.log("REFRESH TOKEN (AUTHENTICATION): " + refreshToken)
				}

				return done(null, {
					name: profile.fullName,
					email: profile.primaryEmail,
					token: token,
					refreshToken: refreshToken
				})
			})
		}
	))
}
