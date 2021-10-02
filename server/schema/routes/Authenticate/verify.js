const Verify = async (req, res, next) => {
  try {
    return res.status(200).send('Ok!');
  } catch (error) {
    return next(error);
  }
};

module.exports = Verify;
