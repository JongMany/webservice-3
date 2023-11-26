const crypto = require('crypto');
const User = require('../model/user');
// const jwtUtil = require('../modules/jwt')
// export const encodePassword = password => crypto.createHash('sha512').update(password).digest('base64')

const createSalt = () =>
    new Promise((resolve, reject) => {
      crypto.randomBytes(64, (err, buf) => {
        if (err) reject(err);
        resolve(buf.toString('base64'));
      });
    });


exports.createHashedPassword = (plainPassword) =>
    new Promise(async (resolve, reject) => {
      const salt = await createSalt();
      crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
        if (err) reject(err);
        resolve({password: key.toString('base64'), salt});
      });
    });

exports.makePasswordHashed = (id, plainPassword) =>
    new Promise(async (resolve, reject) => {

      // userId인자로 해당 유저 salt를 가져오는 부분
      const {salt} = await User
          .findOne({
            id
          })
      // .then((result) => result.salt);

      // 위에서 가져온 salt와 plainPassword를 다시 해시 암호화 시킴. (비교하기 위해)
      crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
        if (err) reject(err);
        resolve(key.toString('base64'));
      });
    });