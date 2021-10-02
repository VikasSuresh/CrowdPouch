const mongoose = require('mongoose');
const Joi = require('joi');

const schema = Joi.object({
  city: Joi.string(),
  state: Joi.string(),
  pop: Joi.string(),
  sort: Joi.string(),
  search: Joi.string(),
  page: Joi.number().default(0),
  size: Joi.number().default(20),
}).required();

const Get = async (req, res, next) => {
  try {
    const Location = mongoose.model('Location');

    const {
      error,
      value: {
        city,
        state,
        pop,
        sort,
        search,
        page,
        size,
      },
    } = schema.validate(req.query);

    if (error) return res.status(400).send('400 Bad Request!');

    const query = {
      ...(city ? { city: { $in: city.split(',') } } : {}),
      ...(state ? { state: { $in: state.split(',') } } : {}),
      ...(pop ? { pop: { $in: pop.split(',') } } : {}),
    };

    const options = {};

    const regex = {
      $regex: new RegExp(`^${search}`),
      $options: 'i',
    };

    if (search) {
      if (Number.isNaN(parseInt(search, 10))) {
        query.$or = [
          {
            city: regex,
          },
          {
            state: regex,
          },
        ];
      } else {
        query.$or = [
          {
            pop: { $eq: search },
          },
          {
            loc: { $in: search },
          },
        ];
      }
    }

    if (sort) {
      options.sort = sort.split(',').reduce((a, c) => ({
        ...a,
        [c.split(':')[0]]: c.split(':')[1] === 'asc' ? 1 : -1,
      }), {});
    }

    const data = await Location
      .find(query)
      .skip(size * page)
      .limit(size)
      .sort(options.sort)
      .lean();

    const total = await Location
      .countDocuments(query)
      .lean();

    return res.status(200).send({
      data,
      pageInfo: { total: Math.ceil(total / size), page, count: data.length },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = Get;
