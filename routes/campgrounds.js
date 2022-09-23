const express = require('express');
const router = express.Router({ mergeParams: true });
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');



//create get route for displaying all campgrounds
router.get('/', catchAsync(campgrounds.index));

//create get route for getting the form for new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

//create post route for submitting new data
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

//create show route for individual campgrounds
router.get('/:id', catchAsync(campgrounds.showCampground));

//route for editing campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;