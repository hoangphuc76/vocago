import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import express from 'express';
import { OAuthCallback } from '../../controllers/authController.js';


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    // callbackURL: '/api/auth_facebook/facebook/callback',
    callbackURL: 'https://elearning-be-water.onrender.com/api/auth_facebook/facebook/callback',
    profileFields: ['id', 'displayName', 'emails']
  },
  async (accessToken, refreshToken, profile, done) => {
    const FacebookUser = {
      id: profile.id,
      username: profile.displayName,
      email: profile.emails ? profile.emails[0].value : profile.displayName,
      role: 'user',
    };
    done(null, FacebookUser);
  }
));

const router = express.Router();

// OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  OAuthCallback
);

export default router;
