const express = require('express');
const reviewController = require('../Controllers/reviewController.js');
const authController = require('../Controllers/authController.js');
const router = express.Router({ mergeParams:true});

router.use(authController.protect);

router
.route('/')
.get(reviewController.getAllReviews)
.post(
    authController.restrictTo('user'), 
    reviewController.setTourUserIds,
    reviewController.createReview
    );

router
.route('/:id')
.delete(
    authController.restrictTo('user','admin'),
    reviewController.deleteReview)
.patch(
    authController.restrictTo('user','admin'), 
    reviewController.updateReview
    )
.get(reviewController.getReview);

module.exports = router;