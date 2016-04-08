var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var ImagePost = mongoose.model('ImagePost');
var Image = mongoose.model('Image');



/* GET home page. */
router.get('/image-posts', function(req, res, next) {
  //look in mongodb for list
  ImagePost.find(function(err, imagePosts, count) {
	  //  console.log(err, imagePosts, count);
     res.render('index', {list:imagePosts});
  });
});


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
  console.log(typeof(imagePost.save)); //should be function
  imagePost.save(function(err, imagePost, count){
    console.log("Inside save callback");
    if(err){
      console.log(err);
    }
    else{
      res.redirect(302, '/image-posts');
    }
  });

});

module.exports = router;
