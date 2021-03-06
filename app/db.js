/*
Radhika Mattoo, rm3485@nyu.edu
Applied Internet Tech Spring 2016
Homework 6
*/
   var mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs');

//insert schemas
var Image = new mongoose.Schema({
  caption: {type: String},
  url: {type: String, required:true}
});

var ImagePost = new mongoose.Schema({
  title: {type: String, required:true},
  images: [Image]
});

//slug for imagepost schema
ImagePost.plugin(URLSlugs('title'));

//register schema as model
mongoose.model('Image', Image);
mongoose.model('ImagePost', ImagePost);


//connect to db
mongoose.connect('mongodb://localhost/hw06');
