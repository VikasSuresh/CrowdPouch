const Queue = require('bull');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);
const uuid = require('uuid').v4;
const mongoose = require('mongoose');
const path = require('path');

module.exports = () => {
  const Job = mongoose.model('Job');

  const videoQueue = new Queue('video transcoding', {
    redis: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_URL,
    },
  });

  videoQueue.process(async (job, done) => {
    let fileName = '';
    const { data } = job;
    try {
      job.progress(0);
      global.io.emit('progress', { progress: 0, jobId: data.id });

      const promise = new Promise((resolve, reject) => {
        fileName = `./files/${data.name.slice(0, data.name.lastIndexOf('.'))}_output.mp4`;

        const op = path.resolve(process.cwd(), fileName);

        ffmpeg(path.resolve(process.cwd(), `./files/${data.name}`))
          .videoCodec('libx264')
          .audioCodec('libmp3lame')
          .on('error', (err) => {
            reject(err);
          })
          .on('end', () => {
            global.io.emit('videoDone', { jobId: data.id });
            resolve(true);
          })
          .save(op);
      });

      promise.then(async () => {
        await Job.findOneAndUpdate({ _id: mongoose.mongo.ObjectId(data.id) }, {
          status: 'Completed',
          fileLocation: fileName,
        }, { upsert: false });
      }).catch(async (error) => {
        await err(Job, data.id, fileName);
      });

      done();
    } catch (error) {
      await err(Job, data.id, fileName);
    }
  });

  return videoQueue;
};

const err = async (Job, id, fileName) => {
  try {
    await Job.findOneAndUpdate({ _id: mongoose.mongo.ObjectId(id) }, {
      status: 'Errored',
      fileLocation: fileName,
    }, { upsert: false });
  } catch (error) {
    console.log(error);
  }
};
