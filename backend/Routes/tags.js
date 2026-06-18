const router = require('express').Router();

const ensureAuth = require('../Middlewares/ensureAuth');

const { getTags } = require('../Controllers/TagController');

router.get(
    '/',
    ensureAuth,
    getTags
);

module.exports = router;