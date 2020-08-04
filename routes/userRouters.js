const fs = require('fs');
const express = require('express');

const userController = require('../Controllers/userController.js');
const authController = require('../Controllers/authController.js');

const router = express.Router();



router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.get('/logout',authController.logout);

router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);

//protect all users after this
router.use(authController.protect);

router.get(
'/me',
userController.getMe,
userController.getUser
);

router.patch('/updateMyPassword',
authController.updatePassword); 

router.patch('/updateMe', userController.uploadUserPhoto,userController.resizeUserPhoto, userController.updateMe);

router.delete('/deleteMe',userController.deleteMe);
//restricted to admin
router.use(authController.restrictTo('admin'));
router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);


router
.route('/:id')
.get(userController.getAllUsers)
.delete(userController.deleteUser)
.patch(userController.updateUser)
.get(userController.getUser);

module.exports = router;

