const mongoose = require('mongoose');

const Get = async (req, res, next) => {
  try {
    const Job = mongoose.model('Job');

    const data = await Job.find({}).lean();

    return res.status(200).send({ downloads: data });
  } catch (error) {
    return next(error);
  }
};

module.exports = Get;
