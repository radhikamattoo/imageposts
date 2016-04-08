var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var ImagePost = mongoose.model('ImagePost');
var Image = mongoose.model('Image');



//HOME PAGE
router.get('/image-posts', function(req, res, next) {
  //look in mongodb for list
  ImagePost.find(function(err, imagePosts, count) {
	   console.log(imagePosts);
     res.render('index', {list:imagePosts});
  });
});

//SUBMIT IMAGE-POST
router.post('/image-posts', function(req, res, next){
  //title of imagepost
  var title = req.body.title;

  //parse req.body for image captions and urls
  var images = [];
  for(var i = 1; i <= 3; i++){
    //get name attribute
    var url = 'image' + i + 'URL';
    var caption = 'image' + i + 'Cap';

    //take care of empty string
    if(req.body[url] === ""){continue;}

    var newImage = new Image({
      caption: req.body[caption],
      url: req.body[url]
    });
    images.push(newImage);
  }
  //create imagePost instance and save to db
  var imagePost = new ImagePost({
    title: title,
    images: images
  });
  imagePost.save(function(err, imagePost, count){
    if(err){
      res.send(err);
    }
    else{
      res.redirect(302, '/image-posts');
    }
  });

});


//GET INDIVIDUAL IMAGE POST
router.get('/image-posts/:slug', function(req, res, next){
    var slug = req.params.slug;
    ImagePost.findOne({slug:slug}, function(err, imagePost, count){
      res.render('individualPost', {list:imagePost});
    });
});


//ADD AN IMAGE
router.post('/image-posts/add', function(req, res, next){
  //parse body
  var url = req.body.URL;
  var caption = req.body.caption;
  var slug = req.body.slug; //for finding image post

  var newImage = new Image({
    caption: caption,
    url: url
  });

  //update image post on db
  ImagePost.findOneAndUpdate({slug: slug}, {$push: {images: newImage}}, function(err, imagePost, count){
    if(err){
      res.send(err);
    }else{
      res.redirect('/image-posts/' + slug);
    }
  });

});

//DELETE AN IMAGE
router.post('/image-posts/delete', function(req, res, next){
  var toRemove = req.body.selections; //checkboxes
  var slug = req.body.slug; //for finding image post

  //get this imagepost object
  ImagePost.findOne({slug:slug}, function(err, post, count){
    //remove image(s)
    if(Array.isArray(toRemove)){
      toRemove.forEach(function(imageID){
        post.images.id(imageID).remove();
      });
    }else{
      post.images.id(toRemove).remove();
    }

    //resave imagePost object
    post.save(function (err) {
      if (err) console.log(err);
      else console.log('sub-doc(s) removed');
    });
  });

  //redirect to single post page
  res.redirect('/image-posts/' + slug);
});


module.exports = router;
