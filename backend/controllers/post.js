const Post=require('../models/Post');
const User=require('../models/User');
const  cloudinary = require('cloudinary');
//creating post
exports.createPost=async(req,res)=>{

    try {
      const myCloud=await cloudinary.v2.uploader.upload(req.body.image,{
        folder:"posts"
      });

        const newPostData={
            caption:req.body.caption,
            image:{
                public_id:myCloud.public_id,
                url:myCloud.secure_url,
            },

            //all the information is saved in owner
            owner:req.user._id,
        };

        const post=await Post.create(newPostData);

        //find user
        const user=await User.findById(req.user._id);

        //in models user there is an array of posts so we push thing into that array
        user.posts.unshift(post._id);

        //save it
        await user.save();

        res.status(201).json({
            success:true,
            message:"Post Created"
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//Delete post
exports.deletePost = async (req, res) => {
    try {
      //find post of that user
      const post = await Post.findById(req.params.id);
      
      //if post dont exists
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
      
      //check post belongs to that user or not
      //compare their id if not then it is other user
      if (post.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
      
     //Also Delete from cloudinary 
     await cloudinary.v2.uploader.destroy(post.image.public_id);

      //if post belongs to that user then
      await post.remove();
      
      //find user
      const user = await User.findById(req.user._id);

      //delete all like he made in other account
      const index = user.posts.indexOf(req.params.id);
      user.posts.splice(index, 1);
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Post deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

//Like and Unlinke post
exports.likeAndUnlikePost=async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        //if post dont exist
        if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found",
        });
        }

        //if post is already liked then dislike
        if (post.likes.includes(req.user._id)) {
        const index = post.likes.indexOf(req.user._id);

        post.likes.splice(index, 1);

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post Unliked",
        });
        } else {
        //if not like then like post by sending user id    
        post.likes.push(req.user._id);

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post Liked",
        });
        }
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//Get Post of following in your Home page
exports.getPostOfFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const posts = await Post.find({
      owner: {
        $in: user.following,
      },
    }).populate("owner likes comments.user");

    res.status(200).json({
      success: true,
      posts: posts.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update caption
exports.updateCaption = async (req, res) => {
  try {
    //find post
    const post = await Post.findById(req.params.id);
    //if post dont exist
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    //check owner is changing the caption or other person
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    //update caption by taking from body
    post.caption = req.body.caption;
    //save post
    await post.save();
    res.status(200).json({
      success: true,
      message: "Post updated",
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//comment
exports.commentOnPost = async (req, res) => {
  try {
    //find post
    const post = await Post.findById(req.params.id);
    //if post not found
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    //for new user
    let commentIndex = -1;

    // Checking if comment already exists
    //if user id is same as logged in user then do
    post.comments.forEach((item, index) => {
      if (item.user.toString() === req.user._id.toString()) {
        commentIndex = index;
      }
    });

    //means existing user have commenting and now is commenting again
    if (commentIndex !== -1) {
      post.comments[commentIndex].comment = req.body.comment;

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Comment Updated",
      });
    } else {

      //if new user then simply add comment
      post.comments.push({
        user: req.user._id,
        comment: req.body.comment,
      });

      await post.save();
      return res.status(200).json({
        success: true,
        message: "Comment added",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete comment
exports.deleteComment=async(req,res)=>{
  try {
    //find post
    const post=await Post.findById(req.params.id);

      //if post not found
      if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    //if post found

   // Checking If owner wants to delete comment in his profile
   if (post.owner.toString() === req.user._id.toString()) {

     //if there is no comment on post so we cant delete from empty array
      if (req.body.commentId === undefined) {
        return res.status(400).json({
          success: false,
          message: "Comment Id is required",
        });
      }

      post.comments.forEach((item, index) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Selected Comment has deleted",
      });
  } else {
    //we have commented on other profile and now we are deleting it
      post.comments.forEach((item, index) => {
        if (item.user.toString() === req.user._id.toString()) {
          return post.comments.splice(index, 1);
        }
      });
      //save post
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Your Comment has deleted",
      });
  }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}