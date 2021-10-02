const express = require('express');
const { Verify } = require('../../helpers');

const router = express.Router({ mergeParams: true });

router.get('/', Verify, require('./get'));
router.get('/filter', Verify, require('./filter'));

module.exports = router;
