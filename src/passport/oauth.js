import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import LocalStrategy from 'passport-local';
import axios from 'axios';
import dotenv from 'dotenv';
import userService from '../services/userService.js';

dotenv.config();

passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    // Replace this with your user authentication logic
    try {
      const user = await userService.findUserByPassword({ email: email, password: password });
      return done(null, user);
    } catch (err) {
      return done(null, false, err);
    }
  }),
);

// OAuth2 GitHub strategy
passport.use(
  'github',
  new OAuth2Strategy(
    {
      authorizationURL: 'https://github.com/login/oauth/authorize',
      tokenURL: 'https://github.com/login/oauth/access_token',
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // 여기에서 사용자 정보 확인 및 저장
      try {
        const response = await axios.get('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const emailResponse = await axios.get('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        response.data.email = emailResponse.data[0].email;

        return done(null, response.data);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
// OAuth2 Google strategy
passport.use(
  'google',
  new OAuth2Strategy(
    {
      authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
      tokenURL: 'https://oauth2.googleapis.com/token',
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // 이곳에서 사용자를 찾거나 새로 생성할 수 있습니다.
      const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = response.data;

      return done(null, user);
    },
  ),
);

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  done(null, user);
});

export default passport;
