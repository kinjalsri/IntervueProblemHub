const router = require('express').Router();

const ensureAuth = require('../Middlewares/ensureAuth');
const ensureAdmin = require('../Middlewares/ensureAdmin');

const {
    problemValidation
} = require('../Middlewares/ProblemValidation');

const {
    addProblem,
    fetchProblems,
    getAdminProblems,
    problemDetail,
    updateProblemStatus,
    updateProblem,
    deleteProblem
} = require('../Controllers/ProblemController');


//company admin create problems 
router.post('/', ensureAuth, ensureAdmin, problemValidation, addProblem);


//get all Problems
router.get('/', ensureAuth, fetchProblems);

//admin gets only problems created by them
router.get('/my-problems', ensureAuth, ensureAdmin, getAdminProblems);

//opening a particular problem details 
router.get('/:id', ensureAuth, problemDetail)

//updating problem status 
router.post('/:id/status', ensureAuth, updateProblemStatus);

//update/changing problem statement 
router.put('/:id', ensureAuth, ensureAdmin, updateProblem);

//delete problem 
router.delete('/:id', ensureAuth, ensureAdmin, deleteProblem);

module.exports = router; 
