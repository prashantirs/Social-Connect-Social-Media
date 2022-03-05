const express = require('express');
const { createPost, likeAndUnlikePost, deletePost, getPostOfFollowing, updateCaption, commentOnPost, deleteComment } = require('../controllers/post');
const { isAuthenticated } = require('../middlewares/auth');

const router=express.Router();

//createPost from controller post.js is exported 
// localhost:4000/api/v1/post/upload
router.route("/post/upload").post(isAuthenticated,createPost); 

//localhost:4000/api/v1/post/:id
router
    .route("/post/:id")
    .get(isAuthenticated,likeAndUnlikePost)
    .put(isAuthenticated,updateCaption)
    .delete(isAuthenticated,deletePost);


router.route("/posts").get(isAuthenticated,getPostOfFollowing);    

//comment on post
router.route("/post/comment/:id").put(isAuthenticated,commentOnPost).delete(isAuthenticated,deleteComment);

module.exports=router; //we will use in app.js