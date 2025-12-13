import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';

/*
 * Initialize the Google OAuth strategy.
 *
 * When running in a test environment the GOOGLE_CLIENT_ID and
 * GOOGLE_CLIENT_SECRET environment variables may not be defined.  Passing
 * `undefined` values into `passport-google-oauth20` will cause it to throw
 * a TypeError.  To make the strategy safe for tests, provide sensible
 * defaults when the environment variables are missing.  These dummy values
 * will never be used to authenticate against Google during unit tests but
 * allow the module to load without error.
 */
const googleStrategy = new GoogleStrategy(
  {
    clientID:
      process.env.GOOGLE_CLIENT_ID || 'DUMMY_GOOGLE_CLIENT_ID',
    clientSecret:
      process.env.GOOGLE_CLIENT_SECRET || 'DUMMY_GOOGLE_CLIENT_SECRET',
    callbackURL:
      `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      }

      // Create new user from Google profile
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        isVerified: true, // Google emails are pre-verified
      });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

export default googleStrategy;
