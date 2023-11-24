import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../model/user';
import Keys from './keys';

export default function(passport){
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = Keys.secretOrKey;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id, (err, user) => {
      if(err){
        return done(err, false);
      }
      if(user){
        return done(null, user);
      }else{
        return done(null, false);
      }
    });
  }));
}