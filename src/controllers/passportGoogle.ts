import passport from 'passport'
const GoogleStrategy = require("passport-google-oauth20").Strategy;

import { PrismaClient } from '@prisma/client'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../secrets';

const prisma = new PrismaClient();

const GOOGLE_CALLBACK_URL = "http://localhost:3000/api/auth/google/callback";

passport.use(
    new GoogleStrategy(
 {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    allbackURL: GOOGLE_CALLBACK_URL,
    passReqToCallback: true
 },
 async (req:any, accessToken:any, refreshToken:any, profile:any, cb:any) => {
    console.log(profile)
    const defaultUser = {
      firstName: `${profile.name.givenName}`,
      lastName: `${profile.name.familyName}`,
      email: profile.emails[0].value,
      googleId: profile.id,
    };

    const user = await prisma.user.findFirst({
        where: { googleId: profile.id }    
      }).catch((err:any) => {
        console.log("Error signing In", err);
        cb(err, null);
      });
      if(!user) throw Error ('Error signing In');

      prisma.user.create({
        data: defaultUser
      }).catch((err:any) => {
        console.log("Error signing Up", err);
        cb(err, null);
      });
      if (user) return cb(null, user);
}))

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user:any, done) => {
	done(null, user);
});

