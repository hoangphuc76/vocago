import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import express from "express";
import { OAuthCallback } from '../../controllers/authController.js';

// import dotenv from 'dotenv';
// dotenv.config();
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: '/api/auth_google/google/callback'
    callbackURL: process.env.GOOGLE_REDIRECT_URL
},
    async (accessToken, refreshToken, profile, done) => {
        const Googleuser = {
            id: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            role: "user",
        };

        done(null, Googleuser);
    }
));


const router = express.Router();


//OAuth 
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    OAuthCallback
);

export default router ;