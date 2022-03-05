const express = require('express');
const { register, login, followUser, logout, updatePassword, updateProfile, deleteMyProfile, myProfile, getUserProfile, getAllUsers, forgotPassword, resetPassword, getMyPosts, getUserPost } = require('../controllers/user');
const { isAuthenticated } = require('../middlewares/auth');

const router=express.Router();

//register & login &logout
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgot/password").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

//show profiles
router.route("/me").get(isAuthenticated,myProfile); 
router.route("/user/:id").get(isAuthenticated,getUserProfile);
router.route("/my/posts").get(isAuthenticated,getMyPosts);
router.route("/users").get(isAuthenticated,getAllUsers);
router.route("/userposts/:id").get(isAuthenticated,getUserPost);

//update user
router.route("/update/password").put(isAuthenticated,updatePassword);
router.route("/update/profile").put(isAuthenticated,updateProfile);

//delete user
router.route("/delete/me").delete(isAuthenticated,deleteMyProfile);
//follow and following
router.route("/follow/:id").get(isAuthenticated,followUser);

module.exports=router; //we will use in app.js 
