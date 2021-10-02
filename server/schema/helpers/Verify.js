const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.cookie;
  try {
    console.log('token');
    const info = jwt.verify(token.split('=')[1], process.env.SECRET);
    if (info) return next();
  } catch (error) {
    return res.status(401).send('Invalid Token');
  }

  return next();
};
