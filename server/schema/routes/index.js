const express = require('express');

const router = express.Router();

router.get('/healthCheck', require('../index'));

router.use('/job', require('./Job'));
router.use('/', require('./Location'));
router.use('/auth', require('./Authenticate'));

module.exports = router;
