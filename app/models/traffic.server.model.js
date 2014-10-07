'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/*Comments schema*/
var CommentSchema = new Schema({
    commOwner: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    comments: { 
    	type: String, 
    	date: Date, 
    	trim: true, 
    	// default: '' 
    },
   
    updated: {
        type: Date,
        default: Date.now
    }
});

/**
 * Traffic Schema
 */
var TrafficSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please fill Traffic name',
		trim: true
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	comments: [CommentSchema],
});




mongoose.model('Traffic', TrafficSchema);
mongoose.model('Comment', CommentSchema);