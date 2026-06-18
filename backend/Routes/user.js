const router = require('express').Router();

const ensureAuth = require('../Middlewares/ensureAuth');

const {getMe, 
    getLikedProblems,
    getSolvedProblems,
    getWorkingProblems,
    updateInterests,
    getUserInterests,
    getRecommendations
} = require('../Controllers/UserControllers');



//check for a particular user
router.get('/me', ensureAuth, getMe);

//get particular status problem 
router.get('/working-problems', ensureAuth, getWorkingProblems);

router.get('/liked-problems', ensureAuth, getLikedProblems);

router.get('/solved-problems', ensureAuth, getSolvedProblems);

//user-interests
router.put('/interests', ensureAuth, updateInterests);

//get user-tags
router.get('/interest', ensureAuth, getUserInterests);

//get recs 
router.get('/recommendations', ensureAuth, getRecommendations);


module.exports = router; 