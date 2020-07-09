const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/User');
var configAuth = require('../auth');

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  // Match Email's User
  const user = await User.findOne({email: email});
  if (!user) {
    return done(null, false, { message: 'Usuario no encontrado.' });
  } else {
    // Match Password's User
    const match = await user.matchPassword(password);
    if(match) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Contraseña incorrecta.' });
    }
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


//Google
passport.use(new GoogleStrategy({
  clientID: configAuth.googleAuth.clientID,
  clientSecret: configAuth.googleAuth.clientSecret,
  callbackURL: configAuth.googleAuth.callbackURL
},
function(accessToken, refreshToken, id, done) {
    process.nextTick(function(){
      User.findOne({ 'google.id': profile.id}, function(err, user){
        if(err)
          return done(err);
        if(user)
          return done(null, user);
        else {
          var newUser = new User();
          newUser.users.id = profile.id;
          newUser.users.name = profile.displayName;
          newUser.users.email = profile.emails[0].value;

          newUser.save(function(err){
            if(err)
              throw err;
            return done(null, newUser);
          })
          console.log(profile);
        }
      });
    });
  }

));
//GOOGLE

