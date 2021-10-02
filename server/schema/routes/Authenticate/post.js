const moment = require('moment');
const jwt = require('jsonwebtoken');

const GET = async (req, res, next) => {
  try {
    const payload = {
      token: 'Cookie',
      sub: 'admin',
      email: 'admin@admin.com',
      name: 'admin',
    };
    const time = new Date().getTime();
    const end = moment(time).add(7, 'days');
    const expiresIn = moment(time).diff(end, 'milliseconds');
    const jwtOptions = { expiresIn };

    const token = jwt.sign({
      ...payload,
      iat: time,
    }, process.env.SECRET, jwtOptions);

    return res.cookie('Secure', token, {
      path: '/',
      expires: new Date(end.valueOf()),
      httpOnly: true,
      secure: true,
    }).send();
  } catch (error) {
    return next(error);
  }
};

module.exports = GET;
