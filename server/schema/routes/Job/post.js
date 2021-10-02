const mongoose = require('mongoose');
const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');
const { Queue } = require('../../helpers');

const Post = async (req, res, next) => {
  try {
    const Job = mongoose.model('Job');

    const busboy = new Busboy({ headers: req.headers });
    let name = '';

    busboy.on('file', (fieldname, file, filename) => {
      const saveTo = path.resolve(process.cwd(), `./files/${filename}`);

      file.pipe(fs.createWriteStream(saveTo));

      name = filename;
    });

    busboy.on('finish', async () => {
      if (!name) return res.status(200).send('No File Uploaded');
      const data = new Job({
        name,
        status: 'Started',
      });

      await data.save();

      await Queue().add({ name, id: data._id });

      return res.status(200).send('Job Created');
    });

    req.pipe(busboy);
  } catch (error) {
    return next(error);
  }
};
module.exports = Post;
