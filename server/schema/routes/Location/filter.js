const mongoose = require('mongoose');
const Joi = require('joi');

const schema = Joi.object({
  city: Joi.string(),
  state: Joi.string(),
  pop: Joi.number(),
}).required();

const Get = async (req, res, next) => {
  try {
    const Location = mongoose.model('Location');

    const { error, value: { city, state, pop } } = schema.validate(req.query);

    if (error) return res.status(400).send('400 Bad Request!');

    const query = {
      city: [],
      state: [],
      pop: [],
    };

    if (city) {
      query.city = [{
        $match: {
          city: {
            $regex: new RegExp(`^${city}`),
            $options: 'i',
          },
        },
      }];
    }

    if (state) {
      query.state = [{
        $match: {
          state: {
            $regex: new RegExp(`^${state}`),
            $options: 'i',
          },
        },
      }];
    }

    if (pop) {
      query.pop = [{
        $match: {
          pop,
        },
      }];
    }

    const data = await Location.aggregate([
      {
        $facet: {
          cities: [
            ...query.city,
            {
              $group: {
                _id: '$city',
              },
            },
            {
              $limit: 20,
            },
          ],
          populations: [
            ...query.pop,
            {
              $group: {
                _id: '$pop',
              },
            },
            {
              $limit: 20,
            },
          ],
          states: [
            ...query.state,
            {
              $group: {
                _id: '$state',
              },
            },
            {
              $limit: 20,
            },
          ],
        },
      },
    ]);

    return res.status(200).send(data[0]);
  } catch (error) {
    return next(error);
  }
};

module.exports = Get;
