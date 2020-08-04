//const fs = require('fs');
const express = require('express');
const tourController = require('../Controllers/tourController.js');
const authController = require('../Controllers/authController.js');
const reviewRouter = require('./../routes/reviewRouters');
const router = express.Router();



router.use('/:tourId/reviews',reviewRouter);

router.route('/tour-stats')
.get(tourController.getTourStats);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
.route('/monthly-plan/:year')
.get(authController.protect,
    authController.restrictTo('admin','lead-guide','guide'),
    tourController.getMonthlyPlan
    );


router.route('/top-5-cheap')
.get(tourController.aliasTopTours,tourController.getAllTours);

router
.route('/')
.get(tourController.getAllTours)
.post(authController.protect,
     authController.restrictTo('admin','lead-guide'),
     tourController.createTour
     );


router
.route('/:id')
.get(tourController.getTour)
.delete(authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.deleteTour)
.patch(authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
    );



module.exports = router; 