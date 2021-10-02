const express = require('express');
const { Verify } = require('../../helpers');

const router = express.Router({ mergeParams: true });

router.use(Verify);

router.get('/:fileId', require('./getId'));
router.get('/', require('./get'));
router.post('/', require('./post'));

module.exports = router;
