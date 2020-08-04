const Review = require('./../models/reviewModel');

//const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');




exports.setTourUserIds = (req, res, next) => {
  if(!req.body.tour) req.body.tour = req.params.tourId;
  if(!req.body.user) req.body.user = req.user.id;
  next();
}
//get Review
exports.getReview = factory.getOne(Review);

//Get all reviews
exports.getAllReviews = factory.getAll(Review);

//create Review
exports.createReview = factory.createOne(Review);

//update review
exports.updateReview = factory.updateOne(Review);

//delete Review
exports.deleteReview = factory.deleteOne(Review);

