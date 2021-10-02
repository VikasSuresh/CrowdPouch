const express = require('express');
const { Verify } = require('../../helpers');

const router = express.Router({ mergeParams: true });

router.post('/', require('./post'));
router.post('/verify', Verify, require('./verify'));

module.exports = router;
