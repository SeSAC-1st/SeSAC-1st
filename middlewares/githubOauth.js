const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/index');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, '../.env'),
}); 

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
        try {
            const [user, created] = await User.findOrCreate({
                where: { githubId: profile.id },
                defaults: { username: profile.username },
            });
            console.log('user.username =>', user.username);
            console.log('user.githubId =>', user.githubId);
            console.log(created); // The boolean indicating whether this instance was just created
            
            if (created) {
            console.log(user.username);
            }
            return cb(null, user);
            
        } catch (err) {
            return cb(err, user);
        }   
    }
));

// 세션에 사용자 정보 저장
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;